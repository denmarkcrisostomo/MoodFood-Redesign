"use client";

import {
  formatMoney,
  getFilterRemovalUrl,
  getSortByValue,
  isFilterInputActive,
  parseCollectionParams,
  serializeCollectionParams,
  type AvailableFilter,
  type CollectionState,
  type MoneyV2,
  type ProductFilter,
} from "@shopify/hydrogen";
import {
  CollectionProvider,
  useCollection,
  useCollectionForm,
} from "@shopify/hydrogen/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { ProductCard, type ProductCardData } from "./product-card";

const COLLECTION_SORT_OPTIONS = [
  { label: "Featured", value: getSortByValue("COLLECTION_DEFAULT", false) },
  { label: "Best selling", value: getSortByValue("BEST_SELLING", false) },
  { label: "Alphabetically, A-Z", value: getSortByValue("TITLE", false) },
  { label: "Alphabetically, Z-A", value: getSortByValue("TITLE", true) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
  { label: "Date, old to new", value: getSortByValue("CREATED", false) },
  { label: "Date, new to old", value: getSortByValue("CREATED", true) },
];

const SEARCH_SORT_OPTIONS = [
  { label: "Relevance", value: getSortByValue("RELEVANCE", false) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
];

// Single-market storefront: one fixed locale keeps server and client symbols identical.
const LOCALE = "en-US";

type BrowserProps = {
  mode: "collection" | "search";
  /** Collection handle, or the submitted search term in search mode. */
  handle: string;
  products: ProductCardData[];
  availableFilters: AvailableFilter[];
  currencyCode: MoneyV2["currencyCode"];
  dataSearch: string;
  pageInfo: { hasNextPage: boolean; endCursor?: string | null };
};

export function CollectionBrowser(props: BrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.toString();
  const storeHandle =
    props.mode === "search" ? `search:${props.handle}` : props.handle;

  return (
    <CollectionProvider
      // dataSearch is the server-committed search string for the loaded products;
      // urlSearch is the live URL and can be ahead during transitions.
      data={{ handle: storeHandle, dataSearch: props.dataSearch }}
      urlSearch={urlSearch}
      onChange={(search) => {
        const href = `${pathname}${search}`;
        if (urlSearch) router.replace(href, { scroll: false });
        else router.push(href, { scroll: false });
        router.refresh();
      }}
    >
      <BrowserContent {...props} path={pathname} />
    </CollectionProvider>
  );
}

function BrowserContent({
  mode,
  handle,
  products,
  availableFilters,
  currencyCode,
  pageInfo,
  path,
}: BrowserProps & { path: string }) {
  const router = useRouter();
  const state = useCollection();
  const { formProps } = useCollectionForm();
  const isLoading = state.status === "loading";
  const sortOptions =
    mode === "search" ? SEARCH_SORT_OPTIONS : COLLECTION_SORT_OPTIONS;
  const currentParams = serializeCollectionParams(state);
  const nextHref = pageInfo.endCursor
    ? `${path}?${withParam(currentParams, mode === "search" ? { q: handle } : {}, "after", pageInfo.endCursor)}`
    : null;

  return (
    <form
      {...formProps()}
      method="get"
      action={path}
      className="grid gap-8 md:grid-cols-[14rem_1fr]"
    >
      {mode === "search" ? <input type="hidden" name="q" value={handle} /> : null}
      <aside className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Sort by
          <select
            name="sort_by"
            value={currentSortValue(state, sortOptions)}
            onChange={requestFormSubmit}
            className="rounded border p-2"
          >
            {sortOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {availableFilters.map((filter) => (
          <fieldset key={filter.id} className="flex flex-col gap-1">
            <legend className="mb-1 font-medium">{filter.label}</legend>
            <FilterGroup
              activeFilters={state.filters}
              currencyCode={currencyCode}
              filter={filter}
            />
          </fieldset>
        ))}
        <noscript>
          <button type="submit">Apply filters</button>
        </noscript>
      </aside>

      <div className={isLoading ? "opacity-50" : undefined} aria-busy={isLoading}>
        {state.filters.length > 0 ? (
          <ul className="mb-4 flex flex-wrap gap-2">
            {state.filters.map((filter, index) => {
              const removal = getFilterRemovalUrl(currentParams, filter);
              const base =
                mode === "search" ? `${path}?q=${encodeURIComponent(handle)}` : path;
              const href =
                removal === "?"
                  ? base
                  : mode === "search"
                    ? `${path}?${withParam(new URLSearchParams(removal), { q: handle })}`
                    : `${path}${removal}`;
              return (
                <li key={index}>
                  <Link
                    href={href}
                    onClick={() => router.refresh()}
                    className="rounded-full border px-3 py-1 text-sm"
                  >
                    {describeFilter(filter)} ✕
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
        {products.length === 0 ? (
          <p className="text-zinc-600">No products found.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
        {pageInfo.hasNextPage && nextHref ? (
          <p className="mt-6">
            <Link href={nextHref} onClick={() => router.refresh()} className="underline">
              Next page
            </Link>
          </p>
        ) : null}
      </div>
    </form>
  );
}

function withParam(
  base: URLSearchParams,
  extra: Record<string, string>,
  key?: string,
  value?: string,
) {
  const params = new URLSearchParams(base);
  for (const [name, val] of Object.entries(extra)) params.set(name, val);
  if (key && value) params.set(key, value);
  return params.toString();
}

function currentSortValue(
  state: CollectionState,
  options: { label: string; value: string }[],
) {
  const value = getSortByValue(state.sortKey ?? "COLLECTION_DEFAULT", state.reverse);
  return options.some((option) => option.value === value) ? value : options[0].value;
}

function requestFormSubmit(
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
) {
  event.currentTarget.form?.requestSubmit();
}

function isMutuallyExclusive(filter: AvailableFilter) {
  return filter.type === "BOOLEAN";
}

function uncheckSiblings(input: HTMLInputElement) {
  const form = input.form;
  if (!form) return;
  for (const sibling of form.querySelectorAll<HTMLInputElement>(
    `input[type="checkbox"][name="${CSS.escape(input.name)}"]`,
  )) {
    if (sibling !== input) sibling.checked = false;
  }
}

function describeFilter(filter: ProductFilter) {
  if (filter.price) {
    return `Price: ${filter.price.min ?? 0}–${filter.price.max ?? "∞"}`;
  }
  if (filter.available !== undefined) {
    return filter.available ? "In stock" : "Out of stock";
  }
  if (filter.variantOption) {
    return `${filter.variantOption.name}: ${filter.variantOption.value}`;
  }
  const [key, value] = Object.entries(filter)[0] ?? [];
  return key ? `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}` : "Filter";
}

function FilterGroup({
  activeFilters,
  currencyCode,
  filter,
}: {
  activeFilters: ProductFilter[];
  currencyCode: MoneyV2["currencyCode"];
  filter: AvailableFilter;
}) {
  if (filter.type === "PRICE_RANGE") {
    return <PriceRangeInput activeFilters={activeFilters} currencyCode={currencyCode} />;
  }

  return filter.values.map((value) => (
    <CheckboxFilterValue
      key={value.id}
      activeFilters={activeFilters}
      filter={filter}
      value={value}
    />
  ));
}

function PriceRangeInput({
  activeFilters,
  currencyCode,
}: {
  activeFilters: ProductFilter[];
  currencyCode: MoneyV2["currencyCode"];
}) {
  // One timer for both inputs, so editing min then max submits once.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const price = activeFilters.find((filter) => filter.price)?.price;
  const min = price?.min ?? "";
  const max = price?.max ?? "";
  const symbol = formatMoney({ amount: "0", currencyCode }, { locale: LOCALE })
    .currencyNarrowSymbol;

  useEffect(() => {
    for (const [input, value] of [
      [minInput.current, min],
      [maxInput.current, max],
    ] as const) {
      if (!input) continue;
      const matches =
        value === ""
          ? input.value === ""
          : input.value !== "" && Number(input.value) === value;
      if (!matches) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        input.value = String(value);
      }
    }
  }, [min, max]);

  useEffect(() => {
    function cancelPendingSubmit() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    }

    function restoreHistoryPrice() {
      // Cancel drafts before history data loads, even if the price is unchanged.
      cancelPendingSubmit();
      const { filters } = parseCollectionParams(
        new URLSearchParams(window.location.search),
      );
      const historyPrice = filters.find((filter) => filter.price)?.price;
      if (minInput.current) minInput.current.value = String(historyPrice?.min ?? "");
      if (maxInput.current) maxInput.current.value = String(historyPrice?.max ?? "");
    }

    // Any form submission (native Enter included) already carries the typed price.
    const form = minInput.current?.form;
    form?.addEventListener("submit", cancelPendingSubmit);
    window.addEventListener("popstate", restoreHistoryPrice);
    return () => {
      form?.removeEventListener("submit", cancelPendingSubmit);
      window.removeEventListener("popstate", restoreHistoryPrice);
      cancelPendingSubmit();
    };
  }, []);

  function submitAfterTyping(event: React.ChangeEvent<HTMLInputElement>) {
    if (timer.current) clearTimeout(timer.current);
    const form = event.currentTarget.form;
    timer.current = setTimeout(() => {
      timer.current = null;
      form?.requestSubmit();
    }, 350);
  }

  return (
    <>
      <PriceInput
        inputRef={minInput}
        name="filter.v.price.gte"
        defaultValue={min}
        label={`Minimum price in ${currencyCode}`}
        symbol={symbol}
        onChange={submitAfterTyping}
      />
      <PriceInput
        inputRef={maxInput}
        name="filter.v.price.lte"
        defaultValue={max}
        label={`Maximum price in ${currencyCode}`}
        symbol={symbol}
        onChange={submitAfterTyping}
      />
    </>
  );
}

function PriceInput({
  inputRef,
  name,
  defaultValue,
  label,
  symbol,
  onChange,
}: {
  inputRef: React.Ref<HTMLInputElement>;
  name: string;
  defaultValue: number | "";
  label: string;
  symbol: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">{symbol}</span>
      <input
        ref={inputRef}
        type="number"
        name={name}
        defaultValue={defaultValue}
        aria-label={label}
        min="0"
        step="any"
        onChange={onChange}
        className="min-w-0 flex-1 rounded border p-1"
      />
    </span>
  );
}

function filterValueInputParamEntries(
  input: string,
): Array<{ name: string; value: string }> {
  let filter: ProductFilter;
  try {
    filter = JSON.parse(input) as ProductFilter;
  } catch {
    return [];
  }

  return Array.from(
    serializeCollectionParams({ filters: [filter], sortKey: undefined, reverse: false }),
    ([name, value]) => ({ name, value }),
  );
}

function CheckboxFilterValue({
  activeFilters,
  filter,
  value,
}: {
  activeFilters: ProductFilter[];
  filter: AvailableFilter;
  value: AvailableFilter["values"][number];
}) {
  const entries = filterValueInputParamEntries(value.input);
  if (entries.length !== 1) return null;

  const [{ name, value: paramValue }] = entries;

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        value={paramValue}
        checked={isFilterInputActive(activeFilters, value.input)}
        onChange={(event) => {
          if (isMutuallyExclusive(filter) && event.currentTarget.checked) {
            uncheckSiblings(event.currentTarget);
          }
          requestFormSubmit(event);
        }}
      />
      {value.label} ({value.count})
    </label>
  );
}

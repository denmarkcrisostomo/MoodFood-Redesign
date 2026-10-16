import { Suspense } from "react";

import { SearchViewedTracker } from "@/components/analytics";
import { CollectionBrowser } from "@/components/collection-browser";
import { EMPTY_SEARCH, querySearch } from "@/lib/browse-queries";
import { toURLSearchParams } from "@/lib/search-params";

export const metadata = { title: "Search" };

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SearchPage({ searchParams }: Props) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Search</h1>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SearchContent({ searchParams }: Props) {
  const urlSearch = toURLSearchParams(await searchParams);
  const term = (urlSearch.get("q") ?? "").trim();
  // Empty terms never hit the Storefront API.
  const result = term ? await querySearch(term, urlSearch.toString()) : EMPTY_SEARCH;

  return (
    <>
      {/* Uncontrolled so the no-JS GET submit works; key resets it on navigation. */}
      <form method="get" action="/search" className="mb-6 flex gap-2" key={term}>
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Search products"
          aria-label="Search products"
          className="flex-1 rounded border p-2"
        />
        <button type="submit" className="rounded border px-4">
          Search
        </button>
      </form>
      {term ? (
        <>
          <SearchViewedTracker term={term} />
          <p className="mb-4 text-zinc-600">
            {result.totalCount} result{result.totalCount === 1 ? "" : "s"} for “{term}”
          </p>
          <CollectionBrowser
            mode="search"
            handle={term}
            products={result.products}
            availableFilters={result.availableFilters}
            currencyCode={result.currencyCode}
            dataSearch={result.dataSearch}
            pageInfo={result.pageInfo}
          />
        </>
      ) : (
        <p className="text-zinc-600">Enter a search term to find products.</p>
      )}
    </>
  );
}

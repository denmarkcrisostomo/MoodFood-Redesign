"use client";

import {
  buildProductSelectionSearchParams,
  canAddToCart,
  type SelectedOption,
} from "@shopify/hydrogen";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { openCartDrawer } from "@/lib/cart-drawer";
import { formatPrice } from "@/lib/money";
import { ProductProvider, useProduct, useProductForm } from "@/lib/product";
import type { ProductData } from "@/lib/product-query";

import { ProductViewedTracker } from "./analytics";

export function ProductDetails({ product }: { product: ProductData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <ProductProvider
      product={product}
      onSelect={(result) => {
        router.replace(
          variantUrl(
            product,
            result.selectedOptions,
            result.selectedVariant?.product?.handle,
            searchParams,
          ),
          { scroll: false },
        );
      }}
    >
      <ProductViewedTracker product={product} />
      <div className="grid gap-8 md:grid-cols-2">
        <Gallery product={product} />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <Price product={product} />
          <VariantSelector product={product} />
          <AddToCart product={product} />
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
    </ProductProvider>
  );
}

function Gallery({ product }: { product: ProductData }) {
  const { selectedVariant } = useProduct();
  const fallback = product.media.nodes.find((node) => "image" in node && node.image);
  const image =
    selectedVariant?.image ??
    (fallback && "image" in fallback ? fallback.image : null);
  if (!image) return <div className="aspect-square rounded bg-zinc-100" />;
  return (
    <Image
      src={image.url}
      alt={image.altText ?? product.title}
      width={image.width ?? 800}
      height={image.height ?? 800}
      priority
      className="aspect-square w-full rounded object-cover"
    />
  );
}

function Price({ product }: { product: ProductData }) {
  const { selectedVariant } = useProduct();
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;
  return (
    <p className="text-xl">
      {formatPrice(price)}
      {compareAt ? (
        <s className="ml-2 text-zinc-500">{formatPrice(compareAt)}</s>
      ) : null}
    </p>
  );
}

// Focus is restored on the activated value after a cross-product navigation remounts the page.
let pendingFocus: { handle: string; optionName: string; value: string } | null = null;

function focusIfPending(
  node: HTMLAnchorElement | null,
  handle: string,
  optionName: string,
  value: string,
) {
  if (
    !node ||
    pendingFocus?.handle !== handle ||
    pendingFocus.optionName !== optionName ||
    pendingFocus.value !== value
  ) {
    return;
  }
  pendingFocus = null;
  node.focus();
}

function VariantSelector({ product }: { product: ProductData }) {
  const { options, register } = useProductForm();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <fieldset key={option.name}>
          <legend className="mb-2 font-medium">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const className = `rounded border px-3 py-1 ${
                value.selected ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : ""
              } ${value.available ? "" : "opacity-50"}`;

              if (!value.exists) {
                return (
                  <button
                    key={value.name}
                    type="button"
                    disabled
                    aria-pressed={value.selected}
                    className={`${className} line-through opacity-30`}
                  >
                    {value.name}
                  </button>
                );
              }

              const href = variantUrl(
                product,
                value.selectedOptions,
                value.handle,
                searchParams,
              );
              const sameProduct = value.handle === product.handle;

              return (
                <Link
                  key={value.name}
                  href={href}
                  scroll={false}
                  ref={(node) =>
                    focusIfPending(node, product.handle, option.name, value.name)
                  }
                  aria-current={value.selected ? "true" : undefined}
                  data-available={value.available ? "true" : "false"}
                  className={className}
                  onNavigate={(event) => {
                    if (sameProduct) {
                      // The provider owns URL sync; stop Link from navigating a second time.
                      event.preventDefault();
                      register("optionValue", {
                        optionName: option.name,
                        value: value.name,
                      }).onClick();
                    } else {
                      pendingFocus = {
                        handle: value.handle,
                        optionName: option.name,
                        value: value.name,
                      };
                    }
                  }}
                >
                  {value.name}
                  {!value.available ? <span className="sr-only"> (Sold out)</span> : null}
                </Link>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function AddToCart({ product }: { product: ProductData }) {
  const { options, selectedVariant, register, formProps, pending, errors } =
    useProductForm();
  const addable = canAddToCart(product, options);

  return (
    <>
      <form {...formProps({ beforeSubmit: openCartDrawer })} className="flex gap-2">
        <input type="hidden" {...register("merchandiseId", {})} />
        <input
          {...register("quantity", { defaultValue: 1 })}
          aria-label="Quantity"
          className="w-16 rounded border p-2 text-center"
        />
        <button
          {...register("addToCart", {})}
          disabled={!addable || pending}
          className="flex-1 rounded bg-black px-4 py-3 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {addable ? "Add to cart" : selectedVariant ? "Sold out" : "Select options"}
        </button>
      </form>
      {errors.userErrors.length > 0 ? (
        <ul role="alert" className="text-sm text-red-700">
          {errors.userErrors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function variantUrl(
  product: { handle: string; options: Array<{ name: string }> },
  selectedOptions: SelectedOption[],
  handle = product.handle,
  base: URLSearchParams | ReturnType<typeof useSearchParams> = new URLSearchParams(),
) {
  const params = buildProductSelectionSearchParams({
    selectedOptions,
    optionNames: product.options.map((option) => option.name),
    base: new URLSearchParams(base),
  });
  const query = params.toString();
  return `/products/${handle}${query ? `?${query}` : ""}`;
}

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCartAnalytics } from "@shopify/hydrogen/react";

import { useCart } from "@/lib/cart";
import { AnalyticsEvent, getAnalytics } from "@/lib/analytics";
import type { ProductData } from "@/lib/product-query";

// Wires confirmed cart changes to cart_updated / product_added_to_cart events.
export function CartAnalytics() {
  useCartAnalytics();
  return null;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.PAGE_VIEWED);
  }, [pageKey]);

  return null;
}

export function ProductViewedTracker({ product }: { product: ProductData }) {
  const variant = product.selectedOrFirstAvailableVariant;

  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      products: [
        {
          id: product.id,
          title: product.title,
          price: variant?.price ?? product.priceRange.minVariantPrice,
          vendor: product.vendor,
          variantId: variant?.id ?? product.id,
          variantTitle: variant?.title ?? product.title,
          quantity: 1,
          sku: variant?.sku ?? undefined,
        },
      ],
    });
    // Once per product, not per variant selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.handle]);

  return null;
}

export function CollectionViewedTracker({
  id,
  handle,
}: {
  id: string;
  handle: string;
}) {
  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.COLLECTION_VIEWED, {
      collection: { id, handle },
    });
  }, [id, handle]);

  return null;
}

export function SearchViewedTracker({ term }: { term: string }) {
  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.SEARCH_VIEWED, { searchTerm: term });
  }, [term]);

  return null;
}

// Publishes cart_viewed once the cart has settled, for the /cart page.
// The default cart fragment lacks per-line merchandise prices, so it is not a
// compatible AnalyticsCart; pass null rather than a partial object.
export function CartViewedTracker() {
  const settled = useCart(
    (state) => !state.loading && !state.revalidating && !state.pending.cost,
  );

  useEffect(() => {
    if (!settled) return;
    getAnalytics()?.publish(AnalyticsEvent.CART_VIEWED, { cart: null });
  }, [settled]);

  return null;
}

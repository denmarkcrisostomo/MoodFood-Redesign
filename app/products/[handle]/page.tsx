import { getSelectedProductOptions } from "@shopify/hydrogen";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductDetails } from "@/components/product-details";
import { PRODUCT_QUERY } from "@/lib/product-query";
import { toURLSearchParams } from "@/lib/search-params";
import { getStorefrontClient } from "@/lib/storefront";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ProductPage(props: Props) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Suspense fallback={<p role="status">Loading…</p>}>
        <ProductContent {...props} />
      </Suspense>
    </main>
  );
}

async function ProductContent({ params, searchParams }: Props) {
  const { handle } = await params;
  const selectedOptions = getSelectedProductOptions({
    searchParams: toURLSearchParams(await searchParams),
  });
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  // GraphQL errors are a 500, never a 404.
  if (errors) {
    console.error("[hydrogen] Product query failed", errors);
    throw new Error("Product query failed");
  }
  if (!data?.product) notFound();

  return <ProductDetails product={data.product} />;
}

import { gql } from "@shopify/hydrogen";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { formatPrice } from "@/lib/money";
import { getStorefrontClient } from "@/lib/storefront";

const HOME_QUERY = gql(`
  query Home($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 8) {
      nodes {
        id
        title
        handle
        image { url altText }
      }
    }
    products(first: 12) {
      nodes {
        id
        title
        handle
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
`);

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Suspense fallback={<p role="status" className="text-zinc-600">Loading…</p>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

async function HomeContent() {
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(HOME_QUERY);
  if (errors) console.error("[hydrogen] Home query failed", errors);

  const collections = data?.collections.nodes ?? [];
  const products = data?.products.nodes ?? [];

  return (
    <>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Collections</h2>
        {collections.length === 0 ? (
          <p className="text-zinc-600">No collections yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/collections/${collection.handle}`}>
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText ?? collection.title}
                      width={400}
                      height={400}
                      className="aspect-square w-full rounded object-cover"
                    />
                  ) : null}
                  <span className="mt-2 block font-medium">{collection.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Products</h2>
        {products.length === 0 ? (
          <p className="text-zinc-600">No products yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.handle}`}>
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      width={400}
                      height={400}
                      className="aspect-square w-full rounded object-cover"
                    />
                  ) : null}
                  <span className="mt-2 block font-medium">{product.title}</span>
                  <span className="text-zinc-600">
                    {formatPrice(product.priceRange.minVariantPrice)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

import {
  type MoneyV2,
  createShopifyRequestContext,
  createStorefrontClient,
  gql,
} from "@shopify/hydrogen";
import { cacheLife } from "next/cache";

export type JarKey = "chunky" | "recover" | "energy";

export type JarVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
};

export type Jar = {
  key: JarKey;
  /** Null until a product with the configured handle exists in the store. */
  product: { id: string; title: string; variants: JarVariant[] } | null;
};

export const JAR_KEYS: JarKey[] = ["chunky", "recover", "energy"];

// Set these in .env to match the product handles in your Shopify store.
function handles() {
  return {
    chunky: process.env.JAR_HANDLE_CHUNKY ?? "chunky-peanut-butter",
    recover: process.env.JAR_HANDLE_RECOVER ?? "recover-chocolate-peanut-butter",
    energy: process.env.JAR_HANDLE_ENERGY ?? "energy-peanut-butter",
  };
}

const JAR_FIELDS = gql(`
  fragment JarFields on Product {
    id
    title
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
      }
    }
  }
`);

const JARS_QUERY = gql(
  `
  query Jars(
    $chunky: String!
    $recover: String!
    $energy: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    chunky: product(handle: $chunky) { ...JarFields }
    recover: product(handle: $recover) { ...JarFields }
    energy: product(handle: $energy) { ...JarFields }
  }
`,
  [JAR_FIELDS],
);

// A catalogue read that is the same for every visitor, so it is cached and the
// landing page stays static.
export async function getJars(): Promise<Jar[]> {
  "use cache";
  cacheLife("minutes");

  const client = createStorefrontClient({
    type: "public",
    requestContext: createShopifyRequestContext({
      request: { headers: new Headers() },
      i18n: { country: "US", language: "EN" },
    }),
    config: {
      storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
      publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    },
  });

  const { data, errors } = await client.graphql(JARS_QUERY, {
    variables: handles(),
  });
  if (errors) console.error("[hydrogen] Jars query failed", errors);

  return JAR_KEYS.map((key) => {
    const product = data?.[key];
    return {
      key,
      product: product
        ? {
            id: product.id,
            title: product.title,
            variants: product.variants.nodes.map((v) => ({
              id: v.id,
              title: v.title,
              availableForSale: v.availableForSale,
              price: v.price,
            })),
          }
        : null,
    };
  });
}

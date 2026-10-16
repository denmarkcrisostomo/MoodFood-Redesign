import {
  gql,
  parseCollectionParams,
  type StorefrontApi,
} from "@shopify/hydrogen";
import type { ProductFilter as StorefrontApiProductFilter } from "@shopify/hydrogen/storefront-api-types";

import { getStorefrontClient } from "@/lib/storefront";

const PAGE_SIZE = 12;

const PRODUCT_CARD = gql(`
  fragment ProductCard on Product {
    id
    title
    handle
    featuredImage { url altText }
    priceRange { minVariantPrice { amount currencyCode } }
  }
`);

const COLLECTION_QUERY = gql(
  `
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop { paymentSettings { currencyCode } }
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        nodes { ...ProductCard }
        filters { id label type values { id label count input } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`,
  [PRODUCT_CARD],
);

const COLLECTIONS_QUERY = gql(`
  query Collections($after: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 24, after: $after) {
      nodes { id title handle image { url altText } }
      pageInfo { hasNextPage endCursor }
    }
  }
`);

const SEARCH_QUERY = gql(
  `
  query Search(
    $term: String!
    $first: Int
    $after: String
    $productFilters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop { paymentSettings { currencyCode } }
    search(
      query: $term
      first: $first
      after: $after
      types: [PRODUCT]
      productFilters: $productFilters
      sortKey: $sortKey
      reverse: $reverse
    ) {
      totalCount
      nodes { ... on Product { ...ProductCard } }
      productFilters { id label type values { id label count input } }
      pageInfo { hasNextPage endCursor }
    }
  }
`,
  [PRODUCT_CARD],
);

export type CollectionResult = NonNullable<
  Awaited<ReturnType<typeof queryCollection>>
>;

function toFilters(filters: ReturnType<typeof parseCollectionParams>["filters"]) {
  return filters.length > 0
    ? (filters as StorefrontApiProductFilter[])
    : undefined;
}

export async function queryCollection(handle: string, searchString: string) {
  const params = new URLSearchParams(searchString);
  const browse = parseCollectionParams(params);
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(COLLECTION_QUERY, {
    variables: {
      handle,
      first: PAGE_SIZE,
      after: params.get("after") ?? undefined,
      filters: toFilters(browse.filters),
      sortKey: browse.sortKey as StorefrontApi.VariablesOf<
        typeof COLLECTION_QUERY
      >["sortKey"],
      reverse: browse.reverse || undefined,
    },
  });
  if (errors) {
    console.error("[hydrogen] Collection query failed", errors);
    throw new Error("Collection query failed");
  }
  if (!data?.collection) return null;
  const { products } = data.collection;
  return {
    id: data.collection.id,
    handle: data.collection.handle,
    title: data.collection.title,
    description: data.collection.description,
    products: products.nodes,
    availableFilters: products.filters,
    pageInfo: products.pageInfo,
    currencyCode: data.shop.paymentSettings.currencyCode,
    dataSearch: searchString,
  };
}

export async function queryCollections(after?: string) {
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(COLLECTIONS_QUERY, {
    variables: { after },
  });
  if (errors) {
    console.error("[hydrogen] Collections query failed", errors);
    throw new Error("Collections query failed");
  }
  return data?.collections ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

const SEARCH_SORT_KEYS = new Set(["RELEVANCE", "PRICE"]);

export async function querySearch(term: string, searchString: string) {
  const params = new URLSearchParams(searchString);
  const browse = parseCollectionParams(params);
  const storefront = await getStorefrontClient();
  const sortKey =
    browse.sortKey && SEARCH_SORT_KEYS.has(browse.sortKey)
      ? browse.sortKey
      : "RELEVANCE";
  const { data, errors } = await storefront.graphql(SEARCH_QUERY, {
    variables: {
      term,
      first: PAGE_SIZE,
      after: params.get("after") ?? undefined,
      productFilters: toFilters(browse.filters),
      sortKey: sortKey as StorefrontApi.VariablesOf<
        typeof SEARCH_QUERY
      >["sortKey"],
      reverse: sortKey === "PRICE" ? browse.reverse || undefined : undefined,
    },
  });
  if (errors) {
    console.error("[hydrogen] Search query failed", errors);
    throw new Error("Search query failed");
  }
  const search = data?.search;
  return {
    products: (search?.nodes ?? []).flatMap((node) =>
      "handle" in node ? [node] : [],
    ),
    availableFilters: search?.productFilters ?? [],
    pageInfo: search?.pageInfo ?? { hasNextPage: false, endCursor: null },
    totalCount: search?.totalCount ?? 0,
    currencyCode: data?.shop.paymentSettings.currencyCode ?? "USD",
    dataSearch: searchString,
  };
}

export const EMPTY_SEARCH = {
  products: [],
  availableFilters: [],
  pageInfo: { hasNextPage: false, endCursor: null },
  totalCount: 0,
  currencyCode: "USD" as const,
  dataSearch: "",
};

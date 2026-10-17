import { gql } from "@shopify/hydrogen";

import { getStorefrontClient } from "@/lib/storefront";

const PAGE_QUERY = gql(`
  query ShopPage($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    page(handle: $handle) { id title body }
  }
`);

const POLICIES_QUERY = gql(`
  query ShopPolicies($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      refundPolicy { title body }
      privacyPolicy { title body }
      termsOfService { title body }
      shippingPolicy { title body }
    }
  }
`);

export type ShopContent = { title: string; body: string };

/** A Shopify page by handle, or null when the store has none (or it is empty). */
export async function queryShopPage(handle: string): Promise<ShopContent | null> {
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(PAGE_QUERY, {
    variables: { handle },
  });
  if (errors) {
    console.error("[hydrogen] Page query failed", errors);
    return null;
  }
  const page = data?.page;
  return page?.body?.trim() ? { title: page.title, body: page.body } : null;
}

const POLICY_KEYS = {
  "refund-policy": "refundPolicy",
  "privacy-policy": "privacyPolicy",
  "terms-of-service": "termsOfService",
  "shipping-policy": "shippingPolicy",
} as const;

export type PolicyHandle = keyof typeof POLICY_KEYS;

/** A Shopify shop policy by route handle, or null when the store has none. */
export async function queryShopPolicy(handle: PolicyHandle): Promise<ShopContent | null> {
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(POLICIES_QUERY);
  if (errors) {
    console.error("[hydrogen] Policy query failed", errors);
    return null;
  }
  const policy = data?.shop?.[POLICY_KEYS[handle]];
  return policy?.body?.trim() ? { title: policy.title, body: policy.body } : null;
}

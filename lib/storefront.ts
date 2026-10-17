import { headers } from "next/headers";
import { cache } from "react";
import {
  createShopifyRequestContext,
  createStorefrontClient,
} from "@shopify/hydrogen";
import { MARKET } from "@/lib/market";

export const getStorefrontClient = cache(async () => {
  const requestHeaders = await headers();
  const requestContext = createShopifyRequestContext({
    request: { headers: requestHeaders },
    i18n: { country: MARKET.country, language: MARKET.language },
  });

  return createStorefrontClient({
    type: "public",
    requestContext,
    config: {
      storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
      publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    },
  });
});

import {
  createCartServerHandlers,
  createShopifyRequestContext,
  createStorefrontClient,
  handleShopifyRoutes,
} from "@shopify/hydrogen";
import { createCustomerAccountServerHandlers } from "@shopify/hydrogen/customer-account";
import { NextResponse, type NextRequest } from "next/server";

import { cartHandlers } from "@/lib/cart-handlers";
import { customerSession } from "@/lib/customer-session";
import { routeTemplates } from "@/lib/route-templates";
import { createSessionManager } from "@/lib/session";
import { MARKET } from "@/lib/market";

// Customer Account handlers are only registered when a real store is configured.
const handlerGroups = (() => {
  if (!customerSession) return [cartHandlers];
  const syncedCartHandlers = createCartServerHandlers({ customerSession });
  return [
    syncedCartHandlers,
    createCustomerAccountServerHandlers({
      customerSession,
      cartServerHandlers: syncedCartHandlers,
    }),
  ];
})();

export async function proxy(request: NextRequest) {
  const requestContext = createShopifyRequestContext({
    request,
    i18n: { country: MARKET.country, language: MARKET.language },
  });
  const storefrontClient = createStorefrontClient({
    type: "public",
    requestContext,
    config: {
      storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
      publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    },
  });
  const sessionManager = await createSessionManager(request);

  const shopifyRoute = handleShopifyRoutes({
    request,
    requestContext,
    sessionManager,
    storefrontClient,
    routeTemplates,
    handlers: handlerGroups,
  });
  if (shopifyRoute) return shopifyRoute;

  const requestHeaders = requestContext.getForwardedRequestHeaders();
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  requestContext.applyResponseHeaders(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|favicon.ico).*)"],
};

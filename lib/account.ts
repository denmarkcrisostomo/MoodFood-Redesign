import {
  createCustomerAccountClient,
  type ReadonlyCustomerSessionManager,
} from "@shopify/hydrogen/customer-account";
import { createShopifyRequestContext } from "@shopify/hydrogen";
import { headers } from "next/headers";

import { customerSession } from "./customer-session";
import { createSessionManager } from "./session";

/**
 * Read-only account context for Server Components. Exposes only getSessionItem,
 * so render paths cannot refresh tokens or write cookies.
 */
export async function getAccountContext() {
  if (!customerSession) return null;

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const proto =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const request = new Request(`${proto}://${host}/account`, {
    headers: requestHeaders,
  });
  const requestContext = createShopifyRequestContext({
    request,
    i18n: { country: "US", language: "EN" },
  });
  const writable = await createSessionManager(request);
  const sessionManager: ReadonlyCustomerSessionManager = {
    getSessionItem: (key) => writable.getSessionItem(key),
  };

  return {
    customerSession,
    requestContext,
    sessionManager,
    client: createCustomerAccountClient({
      shopId: process.env.SHOP_ID!,
      requestContext,
    }),
  };
}

import { createCartServerHandlers } from "@shopify/hydrogen";

// Server-only. Registered with handleShopifyRoutes in proxy.ts and read by AppShell.
export const cartHandlers = createCartServerHandlers();

import { AnalyticsEvent, type StorefrontAnalytics } from "@shopify/hydrogen";

export { AnalyticsEvent };

let bus: StorefrontAnalytics | null = null;

// Browser-lazy: window.Shopify.analytics is created by ShopifyScripts after hydration.
export function getAnalytics(): StorefrontAnalytics | null {
  if (typeof window === "undefined") return null;
  bus ??= window.Shopify?.analytics ?? null;
  return bus;
}

import type { ShopifyScriptsI18n, ShopifyScriptsShop } from "@shopify/hydrogen";

// Resolved on the server and passed to client components as serialized props.
export function getShopifyScriptsConfig(): {
  shop: ShopifyScriptsShop;
  i18n: ShopifyScriptsI18n;
} {
  return {
    shop: {
      // mock.shop has no real shop ID; "0" keeps analytics inert until a real store is set.
      shopId: process.env.SHOP_ID || "0",
      storefrontId: process.env.PUBLIC_STOREFRONT_ID || "0",
      myshopifyDomain: process.env.PUBLIC_STORE_DOMAIN!,
    },
    i18n: { country: "US", language: "EN" },
  };
}

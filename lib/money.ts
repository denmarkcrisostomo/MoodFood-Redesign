import { formatMoney, type MoneyV2 } from "@shopify/hydrogen";

// Single-market storefront: default locale. Pass the active locale if markets are added.
export function formatPrice(money: MoneyV2, locale = "en-US"): string {
  return formatMoney(money, { locale }).toString();
}

import { formatMoney, type MoneyV2 } from "@shopify/hydrogen";
import { MARKET } from "@/lib/market";

// Single-market storefront: defaults to the active market locale.
export function formatPrice(money: MoneyV2, locale: string = MARKET.locale): string {
  return formatMoney(money, { locale }).toString();
}

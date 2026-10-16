"use client";

import type { ShopifyScriptsI18n, ShopifyScriptsShop } from "@shopify/hydrogen";
import { ShopifyScripts } from "@shopify/hydrogen/react";
import { useRouter } from "next/navigation";

import { routeTemplates } from "@/lib/route-templates";

export function StorefrontScripts({
  shop,
  i18n,
}: {
  shop: ShopifyScriptsShop;
  i18n: ShopifyScriptsI18n;
}) {
  const router = useRouter();
  return (
    <ShopifyScripts
      shop={shop}
      i18n={i18n}
      routes={routeTemplates}
      consent={{ mode: "default-banner" }}
      navigate={(url) => router.push(url)}
    />
  );
}

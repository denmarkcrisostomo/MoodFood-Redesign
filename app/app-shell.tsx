import { connection } from "next/server";

import { Suspense } from "react";

import { CartAnalytics, PageViewTracker } from "@/components/analytics";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StorefrontScripts } from "@/components/shopify-scripts";
import { cartHandlers } from "@/lib/cart-handlers";
import { getShopifyScriptsConfig } from "@/lib/shopify-config";
import { getStorefrontClient } from "@/lib/storefront";

import { Providers } from "./providers";

export async function AppShell({ children }: { children: React.ReactNode }) {
  await connection();

  const { shop, i18n } = getShopifyScriptsConfig();
  const cartData = getStorefrontClient().then((storefrontClient) =>
    cartHandlers.get({ storefrontClient }).then(({ data }) => data),
  );

  return (
    <Providers cartData={cartData}>
      <StorefrontScripts shop={shop} i18n={i18n} />
      <CartAnalytics />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <CartDrawer />
    </Providers>
  );
}

import { handleShopifyRedirects } from "@shopify/hydrogen";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { routeTemplates } from "@/lib/route-templates";
import { getStorefrontClient } from "@/lib/storefront";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-16">
      <Suspense fallback={null}>
        <RedirectChecker />
      </Suspense>
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-zinc-600">This page could not be found.</p>
    </div>
  );
}

async function RedirectChecker() {
  await connection();
  const url = (await headers()).get("x-storefront-url");

  if (url) {
    const result = await handleShopifyRedirects({
      request: new Request(url),
      routeTemplates,
      storefrontClient: await getStorefrontClient(),
    });
    const location = result?.headers.get("location");
    if (location) redirect(location);
  }

  return null;
}

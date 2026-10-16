import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionViewedTracker } from "@/components/analytics";
import { CollectionBrowser } from "@/components/collection-browser";
import { queryCollection } from "@/lib/browse-queries";
import { toURLSearchParams } from "@/lib/search-params";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function CollectionPage(props: Props) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Suspense fallback={<p role="status">Loading…</p>}>
        <CollectionContent {...props} />
      </Suspense>
    </main>
  );
}

async function CollectionContent({ params, searchParams }: Props) {
  const { handle } = await params;
  const urlSearch = toURLSearchParams(await searchParams);
  const result = await queryCollection(handle, urlSearch.toString());
  if (!result) notFound();

  return (
    <>
      <CollectionViewedTracker id={result.id} handle={result.handle} />
      <h1 className="mb-2 text-3xl font-semibold">{result.title}</h1>
      {result.description ? (
        <p className="mb-6 text-zinc-600">{result.description}</p>
      ) : null}
      <CollectionBrowser
        mode="collection"
        handle={result.handle}
        products={result.products}
        availableFilters={result.availableFilters}
        currencyCode={result.currencyCode}
        dataSearch={result.dataSearch}
        pageInfo={result.pageInfo}
      />
    </>
  );
}

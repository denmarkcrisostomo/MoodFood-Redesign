import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { queryCollections } from "@/lib/browse-queries";
import { toURLSearchParams } from "@/lib/search-params";

export const metadata = { title: "Collections" };

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Collections</h1>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <CollectionList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function CollectionList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const after = toURLSearchParams(await searchParams).get("after") ?? undefined;
  const { nodes, pageInfo } = await queryCollections(after);

  if (nodes.length === 0) return <p className="text-zinc-600">No collections yet.</p>;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {nodes.map((collection) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.handle}`}>
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded object-cover"
                />
              ) : null}
              <span className="mt-2 block font-medium">{collection.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {pageInfo.hasNextPage && pageInfo.endCursor ? (
        <p className="mt-6">
          <Link
            href={`/collections?after=${encodeURIComponent(pageInfo.endCursor)}`}
            className="underline"
          >
            Next page
          </Link>
        </p>
      ) : null}
    </>
  );
}

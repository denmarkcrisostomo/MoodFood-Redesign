import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DocBody, DocLoading, DocShell } from "@/components/doc-page";
import { queryShopPage } from "@/lib/page-content";
import { INFO_PAGE_HANDLES, PAGE_FALLBACKS } from "@/lib/page-fallbacks";

type Props = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return INFO_PAGE_HANDLES.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  return { title: PAGE_FALLBACKS[handle]?.title ?? "Mood Food" };
}

export default async function InfoPage({ params }: Props) {
  const { handle } = await params;
  if (!(INFO_PAGE_HANDLES as readonly string[]).includes(handle)) notFound();
  return (
    <DocShell>
      <Suspense fallback={<DocLoading />}>
        <InfoContent handle={handle} />
      </Suspense>
    </DocShell>
  );
}

async function InfoContent({ handle }: { handle: string }) {
  const shop = await queryShopPage(handle);
  return <DocBody handle={handle} shop={shop} />;
}

import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DocBody, DocLoading, DocShell } from "@/components/doc-page";
import { queryShopPolicy, type PolicyHandle } from "@/lib/page-content";
import { PAGE_FALLBACKS, POLICY_HANDLES } from "@/lib/page-fallbacks";

type Props = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return POLICY_HANDLES.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  return { title: PAGE_FALLBACKS[handle]?.title ?? "Mood Food" };
}

export default async function PolicyPage({ params }: Props) {
  const { handle } = await params;
  if (!(POLICY_HANDLES as readonly string[]).includes(handle)) notFound();
  return (
    <DocShell>
      <Suspense fallback={<DocLoading />}>
        <PolicyContent handle={handle} />
      </Suspense>
    </DocShell>
  );
}

async function PolicyContent({ handle }: { handle: string }) {
  const shop = await queryShopPolicy(handle as PolicyHandle);
  return <DocBody handle={handle} shop={shop} />;
}

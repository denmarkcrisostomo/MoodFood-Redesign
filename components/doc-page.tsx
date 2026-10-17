import type { ShopContent } from "@/lib/page-content";
import { PAGE_FALLBACKS } from "@/lib/page-fallbacks";

/** Shell: cream page under the fixed header, with a readable column. */
export function DocShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="doc">
      <div className="doc-in">{children}</div>
    </main>
  );
}

export function DocLoading() {
  return <p role="status">Loading…</p>;
}

/** Shopify content when the store has it, else the static brand fallback, else a calm empty state. */
export function DocBody({
  handle,
  shop,
}: {
  handle: string;
  shop: ShopContent | null;
}) {
  if (shop) {
    return (
      <>
        <h1>{shop.title}</h1>
        {/* Shopify-authored rich text from the store's own admin. */}
        <div className="shop-body" dangerouslySetInnerHTML={{ __html: shop.body }} />
      </>
    );
  }
  const page = PAGE_FALLBACKS[handle];
  if (!page) {
    return <p className="empty">This page isn&apos;t available yet.</p>;
  }
  return (
    <>
      <h1>{page.title}</h1>
      {page.intro ? <p className="lead">{page.intro}</p> : null}
      {page.sections.map((s, i) => (
        <section key={i}>
          {s.heading ? <h2>{s.heading}</h2> : null}
          {s.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
          {s.items ? (
            <ul>{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
          ) : null}
        </section>
      ))}
    </>
  );
}

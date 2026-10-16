import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto flex max-w-5xl gap-6 px-6 py-6 text-sm text-zinc-600">
        <Link href="/collections">Collections</Link>
        <Link href="/search">Search</Link>
        {/* Full-page cart fallback when the drawer is unavailable. */}
        <a href="/cart">Cart</a>
      </div>
    </footer>
  );
}

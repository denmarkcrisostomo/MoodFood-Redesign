import Link from "next/link";

import { CartTrigger } from "./cart-trigger";

export function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-semibold">
          MoodFood
        </Link>
        <Link href="/collections">Collections</Link>
        <Link href="/search">Search</Link>
        <span className="flex-1" />
        {/* Plain anchor: the login handler returns a raw external redirect. */}
        <a href="/account">Account</a>
        <CartTrigger />
      </nav>
    </header>
  );
}

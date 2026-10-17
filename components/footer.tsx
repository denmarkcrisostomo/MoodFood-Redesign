import Link from "next/link";

import { JarLink } from "./jar-link";

export function Footer() {
  return (
    <footer className="foot">
      <div className="in">
        <div className="mark" aria-hidden="true">Mood Food</div>
        <div className="cols">
          <nav className="places" aria-label="Jars">
            <JarLink chapter={1}>Chunky</JarLink>
            <JarLink chapter={2}>Recover</JarLink>
            <JarLink chapter={3}>Energy</JarLink>
          </nav>
          <nav className="small" aria-label="Site">
            <Link href="/collections">Shop</Link>
            <Link href="/search">Search</Link>
            {/* Full-page cart: the fallback when the drawer is unavailable. */}
            <a href="/cart">Cart</a>
            <a href="#top">Back to top</a>
          </nav>
        </div>
        <div className="legal">
          <span>© Mood Food</span>
        </div>
      </div>
    </footer>
  );
}

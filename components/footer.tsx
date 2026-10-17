import Link from "next/link";

import { FOOTER_LINKS } from "@/lib/pages";

export function Footer() {
  return (
    <footer className="foot">
      <div className="in">
        <div className="mark" aria-hidden="true">Mood Food</div>
        <nav className="legal" aria-label="Help and policies">
          <div className="lg">
            {FOOTER_LINKS.help.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>
          <span className="dot" aria-hidden="true">•</span>
          <div className="lg">
            {FOOTER_LINKS.policies.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>
          <span className="dot" aria-hidden="true">•</span>
          <span className="own">{FOOTER_LINKS.own}</span>
        </nav>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const KEYS = ["", "chunky", "recover", "energy"];

/** Link to one chapter of the home page: scrolls there on `/`, or goes home first. */
export function JarLink({
  chapter,
  className,
  children,
  onNavigate,
}: {
  chapter: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Link
      href={`/#${KEYS[chapter]}`}
      className={className}
      scroll={false}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
        if (pathname === "/") {
          window.dispatchEvent(new CustomEvent("mf:goto", { detail: chapter }));
        } else {
          router.push(`/#${KEYS[chapter]}`);
        }
      }}
    >
      {children}
    </Link>
  );
}

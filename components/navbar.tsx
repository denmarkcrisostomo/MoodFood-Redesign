"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";
import { CART_DRAWER_ID, openCartDrawer } from "@/lib/cart-drawer";
import { NAV_LEFT, PEANUT_BUTTER_HREF, PRODUCTS_HREF } from "@/lib/pages";

import { JarLink } from "./jar-link";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCart((state) => state.data.totalQuantity);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const renderLink = (item: { label: string; href: string }, onNavigate?: () => void) => {
    if (item.href === PEANUT_BUTTER_HREF) {
      return (
        <JarLink key={item.label} chapter={1} onNavigate={onNavigate}>
          {item.label}
        </JarLink>
      );
    }
    if (item.href === PRODUCTS_HREF) {
      return (
        <Link
          key={item.label}
          href={item.href}
          scroll={false}
          onClick={(event) => {
            onNavigate?.();
            const target = pathname === "/" ? document.getElementById("products") : null;
            if (!target) return;
            event.preventDefault();
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          }}
        >
          {item.label}
        </Link>
      );
    }
    return (
      <Link key={item.label} href={item.href} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header className="nav" id="top">
        <button
          type="button"
          className="ib text menu"
          aria-expanded={open}
          aria-controls="drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav className="links" aria-label="Main">
          {NAV_LEFT.map((item) => renderLink(item))}
        </nav>
        <Link className="logo" href="/" aria-label="Mood Food home" onClick={close}>
          <span>Mood</span>
          <span>Food</span>
        </Link>
        <div className="utility">
          <Link href="/search" aria-label="Search" className="ib">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          </Link>
          {/* Plain anchor: the login handler returns a raw external redirect. */}
          <a href="/account" className="ib text login">Log in</a>
          <a
            href="/cart"
            aria-label={`Cart, ${count} items`}
            aria-controls={CART_DRAWER_ID}
            aria-haspopup="dialog"
            className="ib"
            onClick={(event) => {
              event.preventDefault();
              openCartDrawer();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11h-11z" /><path d="M9 8.5V7a3 3 0 016 0v1.5" /></svg>
            <span className={`count${count > 0 ? " on" : ""}`}>{count}</span>
          </a>
        </div>
      </header>
      <nav className={`drawer${open ? " open" : ""}`} id="drawer" aria-label="Menu">
        {NAV_LEFT.map((item) => renderLink(item, close))}
        <a href="/account" onClick={close}>Log in</a>
      </nav>
    </>
  );
}

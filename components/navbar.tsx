"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import { CART_DRAWER_ID, openCartDrawer } from "@/lib/cart-drawer";

import { JarLink } from "./jar-link";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCart((state) => state.data.totalQuantity);

  return (
    <>
      <header className="nav">
        <Link className="logo" href="/" aria-label="Mood Food home">
          <span>Mood</span>
          <span>Food</span>
        </Link>
        <nav className="links" aria-label="Main">
          <JarLink chapter={1}>Peanut butter</JarLink>
          <Link href="/collections">Shop all</Link>
        </nav>
        <div className="icons">
          <Link href="/search" aria-label="Search" className="icon-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          </Link>
          {/* Plain anchor: the login handler returns a raw external redirect. */}
          <a href="/account" aria-label="Account" className="icon-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" /></svg>
          </a>
          <a
            href="/cart"
            aria-label={`Cart, ${count} items`}
            aria-controls={CART_DRAWER_ID}
            aria-haspopup="dialog"
            className="icon-btn"
            onClick={(event) => {
              event.preventDefault();
              openCartDrawer();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11h-11z" /><path d="M9 8.5V7a3 3 0 016 0v1.5" /></svg>
            <span className={`count${count > 0 ? " on" : ""}`}>{count}</span>
          </a>
          <button
            type="button"
            className="menu"
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <nav className={`drawer${open ? " open" : ""}`} id="drawer" aria-label="Menu">
        <JarLink chapter={1} onNavigate={() => setOpen(false)}>Peanut butter</JarLink>
        <Link href="/collections" onClick={() => setOpen(false)}>Shop all</Link>
        <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
      </nav>
    </>
  );
}

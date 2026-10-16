"use client";

import { useEffect } from "react";

import {
  CART_DRAWER_ID,
  closeCartDrawer,
  configureOpenCartAction,
} from "@/lib/cart-drawer";

import { CartContent } from "./cart-content";

export function CartDrawer() {
  useEffect(() => {
    configureOpenCartAction();
  }, []);

  return (
    <dialog
      id={CART_DRAWER_ID}
      aria-labelledby="cart-drawer-title"
      closedby="any"
      className="bg-white text-black dark:bg-zinc-900 dark:text-white"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h2 id="cart-drawer-title" className="text-lg font-semibold">
            Cart
          </h2>
          <button type="button" aria-label="Close cart" onClick={closeCartDrawer}>
            Close
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <CartContent />
        </div>
      </div>
    </dialog>
  );
}

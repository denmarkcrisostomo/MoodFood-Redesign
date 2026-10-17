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
    >
      <div className="cd">
        <header>
          <h2 id="cart-drawer-title">Cart</h2>
          <button type="button" aria-label="Close cart" onClick={closeCartDrawer}>
            Close
          </button>
        </header>
        <CartContent />
      </div>
    </dialog>
  );
}

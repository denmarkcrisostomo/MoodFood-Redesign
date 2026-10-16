"use client";

import { useCart } from "@/lib/cart";
import { CART_DRAWER_ID, openCartDrawer } from "@/lib/cart-drawer";

export function CartTrigger() {
  const count = useCart((state) => state.data.totalQuantity);

  return (
    <a
      href="/cart"
      onClick={(event) => {
        event.preventDefault();
        openCartDrawer();
      }}
      aria-controls={CART_DRAWER_ID}
      aria-haspopup="dialog"
    >
      Cart ({count})
    </a>
  );
}

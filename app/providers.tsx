"use client";

import type { ReactNode } from "react";

import { CartProvider } from "@/lib/cart";
import type { cartHandlers } from "@/lib/cart-handlers";

type CartData = Awaited<ReturnType<typeof cartHandlers.get>>["data"];

export function Providers({
  cartData,
  children,
}: {
  cartData: Promise<CartData>;
  children: ReactNode;
}) {
  return <CartProvider initialData={cartData}>{children}</CartProvider>;
}

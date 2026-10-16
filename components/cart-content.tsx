"use client";

import type { CartLine as CartLineData } from "@shopify/hydrogen";
import { Suspense } from "react";

import { useCart, useCartForm, useSuspenseCart } from "@/lib/cart";
import { formatPrice } from "@/lib/money";


export function CartContent({
  showFooter = true,
}: {
  showFooter?: boolean;
}) {
  return (
    <Suspense fallback={<p role="status">Loading cart…</p>}>
      <CartContentBody showFooter={showFooter} />
    </Suspense>
  );
}

function CartContentBody({ showFooter }: { showFooter: boolean }) {
  const lines = useSuspenseCart((state) => state.data.lines.nodes);
  const networkErrors = useCart((state) => state.errors.network);
  const cartErrors = useCart((state) => state.errors.cart);

  if (lines.length === 0) {
    return <p className="text-zinc-600">Your cart is empty.</p>;
  }

  const bannerMessages = [
    ...networkErrors.map((error) => error.message),
    ...cartErrors.userErrors.map((error) => error.message),
  ];

  return (
    <div className="flex flex-col gap-4">
      {bannerMessages.length > 0 ? (
        <ul role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">
          {bannerMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : null}
      <ul className="flex flex-col gap-4">
        {lines.map((line) => (
          <CartLine key={line.id} line={line} />
        ))}
      </ul>
      {showFooter ? <CartTotals /> : null}
    </div>
  );
}

function CartLine({ line }: { line: CartLineData }) {
  const { formProps, register } = useCartForm();
  const pending = useCart((state) => state.pending.lines.has(line.id));
  const lineErrors = useCart((state) => state.errors.lines);
  const errors = lineErrors.get(line.id)?.userErrors ?? [];
  const merchandise = line.merchandise;
  const errorId = `line-error-${line.id}`;

  return (
    <li className="flex gap-3">
      {merchandise?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={merchandise.image.url}
          alt={merchandise.image.altText ?? ""}
          width={80}
          height={80}
          className="h-20 w-20 rounded object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-1">
        {merchandise?.product.handle ? (
          <a href={`/products/${merchandise.product.handle}`} className="font-medium">
            {merchandise.product.title}
          </a>
        ) : (
          <span className="font-medium">{merchandise?.title ?? "Product"}</span>
        )}
        <span className="text-sm text-zinc-600">
          {(merchandise?.selectedOptions ?? [])
            .map((option) => `${option.name}: ${option.value}`)
            .join(" · ")}
        </span>
        <form {...formProps()} className="flex flex-wrap items-center gap-2">
          <button {...register("set")} hidden />
          <input type="hidden" {...register("lineId", { value: line.id })} />
          <button {...register("decrease")} aria-label="Decrease quantity" className="rounded border px-2">
            −
          </button>
          <input
            {...register("quantity", { value: line.quantity, interactive: true })}
            aria-label="Quantity"
            aria-invalid={errors.length > 0 || undefined}
            aria-describedby={errors.length > 0 ? errorId : undefined}
            className={`w-14 rounded border px-2 py-1 text-center ${pending ? "opacity-30" : ""}`}
          />
          <button {...register("increase")} aria-label="Increase quantity" className="rounded border px-2">
            +
          </button>
          <button {...register("remove")} className="text-sm underline">
            Remove
          </button>
        </form>
        {errors.length > 0 ? (
          <ul id={errorId} role="alert" className="text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <span className={pending ? "opacity-30" : ""}>
        {formatPrice(line.cost.totalAmount)}
      </span>
    </li>
  );
}

function CartTotals() {
  const subtotal = useCart((state) => state.data.cost.subtotalAmount);
  const checkoutUrl = useCart((state) => state.data.checkoutUrl);
  const totalsPending = useCart(
    (state) => state.pending.cost === true || state.revalidating === true,
  );

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <p className="flex justify-between font-medium">
        <span>Subtotal</span>
        <span className={totalsPending ? "opacity-30" : ""}>
          {formatPrice(subtotal)}
        </span>
      </p>
      <a
        href={checkoutUrl}
        className="rounded bg-black px-4 py-3 text-center text-white dark:bg-white dark:text-black"
      >
        Checkout
      </a>
    </div>
  );
}

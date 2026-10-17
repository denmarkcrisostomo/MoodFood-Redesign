"use client";

import type { CartLine as CartLineData } from "@shopify/hydrogen";
import { Suspense } from "react";

import { closeCartDrawer } from "@/lib/cart-drawer";
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
    return (
      <div className="body">
        <div className="empty">
          <p>Your cart is empty</p>
          <button type="button" className="btn" onClick={closeCartDrawer}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  const bannerMessages = [
    ...networkErrors.map((error) => error.message),
    ...cartErrors.userErrors.map((error) => error.message),
  ];

  return (
    <>
      <div className="body">
        {bannerMessages.length > 0 ? (
          <ul role="alert" className="cd-alert">
            {bannerMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        ) : null}
        <ul className="lines">
          {lines.map((line) => (
            <CartLine key={line.id} line={line} />
          ))}
        </ul>
      </div>
      {showFooter ? <CartTotals /> : null}
    </>
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
    <li className="line">
      {merchandise?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={merchandise.image.url}
          alt={merchandise.image.altText ?? ""}
          width={64}
          height={64}
        />
      ) : (
        <span className="ph" aria-hidden="true" />
      )}
      <div className="info">
        {merchandise?.product.handle ? (
          <a href={`/products/${merchandise.product.handle}`}>
            {merchandise.product.title}
          </a>
        ) : (
          <b>{merchandise?.title ?? "Product"}</b>
        )}
        <span className="opts">
          {(merchandise?.selectedOptions ?? [])
            .map((option) => `${option.name}: ${option.value}`)
            .join(" · ")}
        </span>
        <form {...formProps()} className="qty">
          <button {...register("set")} hidden />
          <input type="hidden" {...register("lineId", { value: line.id })} />
          <button {...register("decrease")} aria-label="Decrease quantity">
            −
          </button>
          <input
            {...register("quantity", { value: line.quantity, interactive: true })}
            aria-label="Quantity"
            aria-invalid={errors.length > 0 || undefined}
            aria-describedby={errors.length > 0 ? errorId : undefined}
            className={pending ? "pending" : undefined}
          />
          <button {...register("increase")} aria-label="Increase quantity">
            +
          </button>
          <button {...register("remove")} className="rm">
            Remove
          </button>
        </form>
        {errors.length > 0 ? (
          <ul id={errorId} role="alert" className="cd-alert">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <span className={`price${pending ? " pending" : ""}`}>
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
    <footer>
      <p className="total">
        <span>Estimated total</span>
        <span className={totalsPending ? "pending" : undefined}>
          {formatPrice(subtotal)}
        </span>
      </p>
      <small>Taxes and shipping calculated at checkout.</small>
      <a href={checkoutUrl} className="btn">
        Check out
      </a>
    </footer>
  );
}

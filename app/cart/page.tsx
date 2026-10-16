import { CartViewedTracker } from "@/components/analytics";
import { CartContent } from "@/components/cart-content";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Cart</h1>
      <CartViewedTracker />
      <CartContent />
    </main>
  );
}

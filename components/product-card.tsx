import type { MoneyV2 } from "@shopify/hydrogen";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/money";

export type ProductCardData = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: MoneyV2["currencyCode"] } };
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${product.handle}`}>
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          width={400}
          height={400}
          className="aspect-square w-full rounded object-cover"
        />
      ) : null}
      <span className="mt-2 block font-medium">{product.title}</span>
      <span className="text-zinc-600">
        {formatPrice(product.priceRange.minVariantPrice)}
      </span>
    </Link>
  );
}

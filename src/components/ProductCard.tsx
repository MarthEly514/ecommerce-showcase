import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-3xl bg-white transition hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-black/5">
        <img
          src={`/api/images/${product.image_key}`}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-ink/70">{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  );
}

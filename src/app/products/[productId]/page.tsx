export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getProduct, getRelatedProducts, recordEvent } from "@/lib/db";
import type { Product } from "@/lib/types";

const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER ?? "22900000000";

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) notFound();

  await recordEvent("visit", product.id);
  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-16 px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl bg-black/5">
            <img
              src={`/api/images/${product.image_key}`}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-5">
            <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-lg text-ink/70">{product.description}</p>
            <p className="text-2xl font-medium">{product.price.toFixed(2)} XOF</p>
            <WhatsAppButton
              productId={product.id}
              productName={product.name}
              phoneNumber={WHATSAPP_PHONE_NUMBER}
            />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Découvrir d'autres produits</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related: Product) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

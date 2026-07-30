import Link from "next/link";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/db";

export default async function HomePage() {
  const params = await searchParams;
  const products = await listProducts({ search: params.search, category: params.category });
  return (
    <>
      <Navbar />
      <main className="mx-auto bg-red-400 flex min-h-[80vh] max-w-6xl flex-col items-start justify-center gap-6 px-6 py-24">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Des produits digitaux premium, sans détour.
        </h1>
        <p className="max-w-xl text-lg text-ink/70">
          Parcourez notre catalogue et contactez-nous directement sur WhatsApp pour finaliser votre achat.
        </p>
        <Link
          href="/products"
          className="min-h-[44px] rounded-3xl bg-ink px-8 py-4 text-base font-medium text-paper transition hover:opacity-90"
        >
          Découvrir le catalogue
        </Link>
        {products.length === 0 ? (
          <p className="py-12 text-center text-ink/50">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

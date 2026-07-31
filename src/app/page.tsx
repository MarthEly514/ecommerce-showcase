import Link from "next/link";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/db";

export default async function HomePage() {
  const products = (await listProducts({ search: "", category: "" })).slice(0, 5);
  const sample_products_list = products
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center gap-6 px-6 py-24">
        <div className="relative w-full min-h-[70vh] flex flex-row items-center justify-between">
          <div className="w-max max-w-[60%] h-full flex flex-col items-start justify-center gap-8">
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Des produits digitaux premium, sans détour.
            </h1>
            <p className="max-w-xl text-lg text-ink/70">
              Parcourez notre catalogue et contactez-nous directement sur WhatsApp pour finaliser votre achat.
            </p>
            <Link
              href="/products"
              className="h-max min-h-[44px] w-max rounded-xl bg-ink px-8 py-4 text-base font-medium flex flex-col items-center justify-center text-paper transition hover:opacity-80 hover:scale-105"
            >
              Découvrir le catalogue
            </Link>
          </div>
          <img
            src="/products2.png"
            className="w-[48%] min-w-[300px] absolute right-0"
          />
        </div>
        <h2 className="text-lg font-semibold">Nos derniers produits</h2>
        {sample_products_list.length === 0 ? (
          <p className="py-12 text-center text-ink/50">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center">
            {sample_products_list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <Link
              href="/products"
              className="h-max min-h-[44px] w-max rounded-xl bg-ink px-8 py-4 text-base font-medium flex flex-col items-center justify-center text-paper transition hover:opacity-80 hover:scale-105"
            >
              Tout voir
            </Link>
          </div>
        )}
      </main >
    </>
  );
}

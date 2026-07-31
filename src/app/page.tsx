import Link from "next/link";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/db";

export default async function HomePage() {
  const page = 1;
  const { products } = (await listProducts({ page, pageSize: 12 }));
  const sliced_products = products.slice(0,5)

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center gap-6 px-6 py-24">
        <div className="relative w-full min-h-[70vh] flex flex-row items-center justify-between sm:overflow-hidden">
          <div className="w-max lg:max-w-[60%] h-full flex flex-col items-start justify-center gap-8">
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
          {/* laptop */}
          <img
            src="/products2.png"
            className="w-[48%] min-w-[300px] hidden lg:flex absolute right-0"
          />
          {/* phone */}
          <img
            src="/headphones.png"
            className="min-w-[300px] absolute sm:hidden right-[-30%] top-[-10vh]"
          />
          {/* tablet */}
          <img
            src="/headphones.png"
            className="w-[350px] absolute hidden sm:flex lg:hidden left-0 top-0"
          />
          <img
            src="/powerdrill.png"
            className="w-[40vw] absolute hidden sm:flex lg:hidden right-0 bottom-[-13vh]"
          />
          <div className="w-full absolute bottom-0 h-32 bg-gradient-to-t from-paper to-transparent"></div>
          <div className="w-full absolute hidden sm:flex top-0 h-32 bg-gradient-to-b from-paper to-transparent"></div>
        </div>
        <h2 className="text-lg font-semibold">Nos derniers produits</h2>
        {products.length === 0 ? (
          <p className="py-12 text-center text-ink/50">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center">
            {products.map((product) => (
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

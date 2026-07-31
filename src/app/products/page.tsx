export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import ProductCard from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/db";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const products = await listProducts({ search: params.search, category: params.category });
  const categories = await listCategories();

  return (
    <>
      {/* <Navbar /> */}
      <header className="sticky top-0 left-0 w-full z-30 border-b border-black/5 bg-paper/90 backdrop-blur h-[80px] flex items-center justify-center">
        <nav className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Re-Shop
          </Link>
          {/* <Link
            href="/products"
            className="rounded-xl border border-ink px-5 py-2 text-sm font-medium transition hover:bg-ink hover:text-paper"
          >
            Voir les produits
          </Link> */}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-bold">Catalogue de produits</h1>
        <div className="space-y-4">
          <SearchBar />
          <CategoryPills categories={categories} />
        </div>

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

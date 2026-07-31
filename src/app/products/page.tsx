export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { listCategories, listProducts } from "@/lib/db";
import Link from "next/link";

const PAGE_SIZE = 12;

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { products, total } = await listProducts({
    search: params.search,
    category: params.category,
    page,
    pageSize: PAGE_SIZE,
  });
  const categories = await listCategories();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      {/* ... ton header ... */}
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-bold">Catalogue de produits</h1>
        <div className="space-y-4">
          <SearchBar />
          <CategoryPills categories={categories} />
        </div>

        {products.length === 0 ? (
          <p className="py-12 text-center text-ink/50">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </main>
    </>
  );
}
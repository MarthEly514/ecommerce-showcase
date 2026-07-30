"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="relative">
      <input
        type="search"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Rechercher un produit..."
        aria-label="Rechercher un produit"
        className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-base outline-none transition focus:border-ink"
      />
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryPills({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  function handleSelect(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
      params.delete("page")
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  }

  const options = ["all", ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
      {options.map((category) => (
        <button
          key={category}
          onClick={() => handleSelect(category)}
          className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
            active === category ? "bg-ink text-paper" : "bg-white text-ink/70 hover:bg-black/5"
          }`}
        >
          {category === "all" ? "Tous" : category}
        </button>
      ))}
    </div>
  );
}

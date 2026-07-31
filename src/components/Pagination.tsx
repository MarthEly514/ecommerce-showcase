"use client";

import { useRouter, useSearchParams } from "next/navigation";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  for (let i = 1; i <= total; i++) {
    const isEdge = i === 1 || i === total;
    const isNearCurrent = Math.abs(i - current) <= 1;
    if (isEdge || isNearCurrent) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
}

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    page <= 1 ? params.delete("page") : params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-4" aria-label="Pagination du catalogue">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-h-[44px] rounded-full px-4 text-sm font-medium text-ink/70 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Précédent
      </button>

      {getPageNumbers(currentPage, totalPages).map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-ink/40">…</span>
        ) : (
          <button
            key={item}
            onClick={() => goToPage(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`min-h-[44px] min-w-[44px] rounded-full px-4 text-sm font-medium transition ${
              item === currentPage ? "bg-ink text-paper" : "text-ink/70 hover:bg-black/5"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="min-h-[44px] rounded-full px-4 text-sm font-medium text-ink/70 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Suivant
      </button>
    </nav>
  );
}
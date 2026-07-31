import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-30 border-b border-black/5 bg-paper/90 backdrop-blur h-[80px] flex items-center justify-center">
      <nav className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Re-Shop
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-ink px-5 py-2 text-sm font-medium transition hover:bg-ink hover:text-paper"
        >
          Voir les produits
        </Link>
      </nav>
    </header>
  );
}

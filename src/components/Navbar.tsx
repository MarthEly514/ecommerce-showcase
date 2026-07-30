import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Boutique Digitale
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-ink px-5 py-2 text-sm font-medium transition hover:bg-ink hover:text-paper"
        >
          Voir les produits
        </Link>
      </nav>
    </header>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, AnalyticsSummary } from "@/lib/types";

interface AdminPanelProps {
  products: Product[];
  summary: AnalyticsSummary;
}

export default function AdminPanel({ products, summary }: AdminPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Veuillez ajouter une image.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const uploadData = new FormData();
    uploadData.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
    const uploadJson = (await uploadRes.json()) as { key?: string; error?: string };

    if (!uploadRes.ok || !uploadJson.key) {
      setError(uploadJson.error ?? "Échec de l'envoi de l'image.");
      setIsSubmitting(false);
      return;
    }

    const createRes = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), image_key: uploadJson.key }),
    });

    setIsSubmitting(false);

    if (!createRes.ok) {
      const data = (await createRes.json()) as { error?: string };
      setError(data.error ?? "Échec de la création du produit.");
      return;
    }

    setForm({ name: "", description: "", category: "", price: "" });
    setFile(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <button onClick={handleLogout} className="text-sm text-ink/60 underline">
          Déconnexion
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-6">
          <p className="text-sm text-ink/50">Visites totales</p>
          <p className="text-3xl font-semibold">{summary.totalVisits}</p>
        </div>
        <div className="rounded-3xl bg-white p-6">
          <p className="text-sm text-ink/50">Clics WhatsApp</p>
          <p className="text-3xl font-semibold">{summary.totalWhatsappClicks}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ajouter un produit</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2">
          <input
            required
            placeholder="Nom du produit"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ink"
          />
          <input
            required
            placeholder="Catégorie"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ink"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Prix (€)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ink"
          />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-2xl border border-black/10 px-4 py-3"
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="col-span-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ink"
            rows={3}
          />
          {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="col-span-full min-h-[44px] rounded-3xl bg-ink px-6 py-3 font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Envoi..." : "Ajouter le produit"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Produits existants</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-2xl bg-white p-4">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-ink/50">
                  {product.category} · {product.price.toFixed(2)} €
                </p>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="min-h-[44px] rounded-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const dynamic = "force-dynamic";

import AdminPanel from "@/components/AdminPanel";
import { getAnalyticsSummary, listProducts } from "@/lib/db";

export default async function AdminPage() {
  const page = 1;

  const { products } = await listProducts({
    page,
    pageSize: 12,
  });
  const summary = await getAnalyticsSummary();

  return <AdminPanel products={products} summary={summary} />;
}

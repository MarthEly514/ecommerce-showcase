export const dynamic = "force-dynamic";

import AdminPanel from "@/components/AdminPanel";
import { getAnalyticsSummary, listProducts } from "@/lib/db";

export default async function AdminPage() {
  const products = await listProducts({});
  const summary = await getAnalyticsSummary();

  return <AdminPanel products={products} summary={summary} />;
}

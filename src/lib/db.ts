import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Product } from "./types";

// Single source of truth for accessing the D1 binding.
function getDb() {
  return getCloudflareContext().env.DB;
}

export async function listProducts(params: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const db = getDb();
  const conditions: string[] = [];
  const values: string[] = [];

  if (params.search) {
    conditions.push("name LIKE ?");
    values.push(`%${params.search}%`);
  }
  if (params.category && params.category !== "all") {
    conditions.push("category = ?");
    values.push(params.category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const pageSize = params.pageSize ?? 12;
  const page = Math.max(1, params.page ?? 1);
  const offset = (page - 1) * pageSize;

  const countResult = await db
    .prepare(`SELECT COUNT(*) AS total FROM products ${where}`)
    .bind(...values)
    .first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const { results } = await db
    .prepare(`SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...values, pageSize, offset)
    .all<Product>();

  return { products: results, total, page, pageSize };
}

export async function getProduct(id: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Product>();
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4) {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM products WHERE category = ? AND id != ? ORDER BY created_at DESC LIMIT ?")
    .bind(category, excludeId, limit)
    .all<Product>();
  return results;
}

export async function createProduct(product: Omit<Product, "created_at">) {
  const db = getDb();
  await db
    .prepare(
      "INSERT INTO products (id, name, description, category, price, image_key) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(product.id, product.name, product.description, product.category, product.price, product.image_key)
    .run();
}

export async function deleteProduct(id: string) {
  const db = getDb();
  await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}

export async function listCategories() {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT DISTINCT category FROM products ORDER BY category")
    .all<{ category: string }>();
  return results.map((r: { category: string }) => r.category);
}

export async function recordEvent(eventType: "visit" | "whatsapp_click", productId?: string) {
  const db = getDb();
  await db
    .prepare("INSERT INTO analytics_events (event_type, product_id) VALUES (?, ?)")
    .bind(eventType, productId ?? null)
    .run();
}

export async function getAnalyticsSummary() {
  const db = getDb();

  const totals = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'visit') AS visits,
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'whatsapp_click') AS clicks`
    )
    .first<{ visits: number; clicks: number }>();

  const { results: byProduct } = await db
    .prepare(
      `SELECT p.id AS product_id, p.name AS product_name, COUNT(a.id) AS clicks
       FROM products p
       LEFT JOIN analytics_events a ON a.product_id = p.id AND a.event_type = 'whatsapp_click'
       GROUP BY p.id
       ORDER BY clicks DESC`
    )
    .all<{ product_id: string; product_name: string; clicks: number }>();

  return {
    totalVisits: totals?.visits ?? 0,
    totalWhatsappClicks: totals?.clicks ?? 0,
    clicksByProduct: byProduct,
  };
}

export function getBucket() {
  return getCloudflareContext().env.PRODUCT_IMAGES;
}

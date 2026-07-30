export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? undefined;
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const products = await listProducts({ search, category });
  return NextResponse.json({ products });
}

// Product creation is admin-only; the DB writes use bound params, so no SQL injection is possible.
export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = await verifySessionToken(token, process.env.ADMIN_SECRET ?? "");
  if (!isAuthed) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await req.json()) as {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    image_key?: string;
  };

  if (!body.name || !body.description || !body.category || !body.price || !body.image_key) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await createProduct({
    id,
    name: body.name,
    description: body.description,
    category: body.category,
    price: body.price,
    image_key: body.image_key,
  });

  return NextResponse.json({ id }, { status: 201 });
}

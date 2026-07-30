export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProduct, getBucket } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = await verifySessionToken(token, process.env.ADMIN_SECRET ?? "");
  if (!isAuthed) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  await getBucket().delete(product.image_key);
  await deleteProduct(id);

  return NextResponse.json({ ok: true });
}

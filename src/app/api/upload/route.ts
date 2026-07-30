export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getBucket } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 Mo

// Simple per-isolate rate limit to protect the R2 quota against upload spam.
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string) {
  const record = uploadCounts.get(ip);
  const now = Date.now();

  if (!record || now > record.resetAt) {
    uploadCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_UPLOADS;
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = await verifySessionToken(token, process.env.ADMIN_SECRET ?? "");
  if (!isAuthed) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop d'envois, réessayez plus tard." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Type de fichier non autorisé." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 2 Mo)." }, { status: 400 });
  }

  const extension = file.type.split("/")[1];
  const key = `${crypto.randomUUID()}.${extension}`;

  await getBucket().put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return NextResponse.json({ key }, { status: 201 });
}

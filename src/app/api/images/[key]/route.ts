export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getBucket } from "@/lib/db";

// Proxies R2 objects so the bucket and its credentials are never exposed directly to the client.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const object = await getBucket().get(key);
  if (!object) {
    return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
  }

  return new NextResponse(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

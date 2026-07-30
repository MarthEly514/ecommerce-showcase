export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { recordEvent, getAnalyticsSummary } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Public: records a visit or a WhatsApp CTA click.
export async function POST(req: NextRequest) {
  const { eventType, productId } = (await req.json()) as {
    eventType?: "visit" | "whatsapp_click";
    productId?: string;
  };

  if (eventType !== "visit" && eventType !== "whatsapp_click") {
    return NextResponse.json({ error: "Type d'événement invalide." }, { status: 400 });
  }

  await recordEvent(eventType, productId);
  return NextResponse.json({ ok: true });
}

// Admin-only: summary for the dashboard.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = await verifySessionToken(token, process.env.ADMIN_SECRET ?? "");
  if (!isAuthed) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const summary = await getAnalyticsSummary();
  return NextResponse.json(summary);
}

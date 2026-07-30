// Signed session token: `${timestamp}.${hmacSignature}`.
// Verified with a server-only secret so the client never handles credentials.

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(signature).toString("hex");
}

export async function createSessionToken(secret: string) {
  const timestamp = Date.now().toString();
  const signature = await sign(timestamp, secret);
  return `${timestamp}.${signature}`;
}

export async function verifySessionToken(token: string | undefined, secret: string) {
  if (!token) return false;
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  if (Date.now() - Number(timestamp) > SESSION_TTL_MS) return false;

  const expected = await sign(timestamp, secret);
  return expected === signature;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

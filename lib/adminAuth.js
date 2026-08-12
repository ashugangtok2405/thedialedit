/* Simple single-admin session: an HMAC token signed with ADMIN_PASSWORD,
   stored in an httpOnly cookie. No sessions table needed. Uses Web Crypto
   (crypto.subtle) so it works in both the Node.js and Edge runtimes. */

export const ADMIN_COOKIE_NAME = "tde_admin_session";
const SESSION_PAYLOAD = "tde-admin-authenticated-v1";

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(SESSION_PAYLOAD));
  return bufToHex(sig);
}

export async function createSessionToken() {
  return sign(process.env.ADMIN_PASSWORD);
}

export async function isValidSessionToken(token) {
  if (!token) return false;
  const expected = await sign(process.env.ADMIN_PASSWORD);
  return token === expected;
}

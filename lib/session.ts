import type { WritableCustomerSessionManager } from "@shopify/hydrogen/customer-account";

const COOKIE_NAME = "__Host-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function getKey() {
  const secret = process.env.CUSTOMER_ACCOUNT_SESSION_SECRET;
  if (!secret) throw new Error("CUSTOMER_ACCOUNT_SESSION_SECRET is not set");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

async function seal(data: Record<string, unknown>) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await getKey(),
    encoder.encode(JSON.stringify(data)),
  );
  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(cipher))}`;
}

async function unseal(value: string | undefined) {
  if (!value) return {};
  try {
    const [iv, cipher] = value.split(".");
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64Url(iv) as BufferSource },
      await getKey(),
      fromBase64Url(cipher) as BufferSource,
    );
    return JSON.parse(decoder.decode(plain)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

/**
 * Encrypted, HttpOnly cookie session. Only Customer Account state lives here;
 * tokens never reach client code. `commit()` returns the Set-Cookie header.
 */
export async function createSessionManager(
  request: Request,
): Promise<WritableCustomerSessionManager> {
  const origin = new URL(request.url).origin;
  const data = await unseal(readCookie(request, COOKIE_NAME));
  let dirty = false;

  return {
    getSessionOrigin: () => origin,
    getSessionItem: (key) => data[key],
    setSessionItem: (key, value) => {
      data[key] = value;
      dirty = true;
    },
    removeSessionItem: (key) => {
      delete data[key];
      dirty = true;
    },
    commit: async () => {
      if (!dirty) return;
      const value = await seal(data);
      return {
        "set-cookie": `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`,
      };
    },
  };
}

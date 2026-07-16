import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "khurjadeals-secret-change-in-production";

const PROTECTED_PATHS = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/queries",
  "/admin/properties",
  "/admin/products",
  "/admin/settings",
  "/admin/profile",
];

// Helper to verify HS256 JWT using Web Crypto API (Edge Runtime safe)
async function verifyJwt(token: string, secretStr: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretStr),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const base64UrlToBuffer = (base64url: string) => {
      let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      const binStr = atob(base64);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        bytes[i] = binStr.charCodeAt(i);
      }
      return bytes;
    };

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToBuffer(signatureB64);

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid) return false;

    // Check expiration
    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("kd_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const isValid = await verifyJwt(token, SECRET);
  if (!isValid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


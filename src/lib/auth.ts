import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthUser } from "@/types/user";

const SECRET = process.env.JWT_SECRET || "khurjadeals-secret-change-in-production";

const COOKIE_NAME = "kd_token";
const EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days

/** Sign a JWT and set it in an HttpOnly cookie */
export async function signIn(user: AuthUser): Promise<void> {
  const token = jwt.sign({ ...user }, SECRET, { expiresIn: EXPIRES_IN });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRES_IN,
    path: "/",
  });
}

/** Verify and decode the JWT from cookies */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return jwt.verify(token, SECRET) as unknown as AuthUser;
  } catch {
    return null;
  }
}

/** Clear the auth cookie */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}


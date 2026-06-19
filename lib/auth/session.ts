import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload } from "@/types/auth";

const COOKIE_NAME = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set in environment variables");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function buildSessionCookie(token: string): string {
  const maxAge = SESSION_DURATION_SECONDS;
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

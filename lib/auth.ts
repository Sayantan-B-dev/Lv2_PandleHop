import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = "pandalpass.session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const KEY_LENGTH = 64;

export interface SessionUser {
  id: number;
  username: string;
}

function sessionSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "pandalpass-local-session-secret",
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");
  if (!expected.length) return false;

  const derived = (await scrypt(password, salt, expected.length)) as Buffer;
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(sessionSecret());
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    const id = Number(payload.sub);
    const username = typeof payload.username === "string" ? payload.username : "";
    if (!Number.isInteger(id) || !username) return null;
    return { id, username };
  } catch {
    return null;
  }
}

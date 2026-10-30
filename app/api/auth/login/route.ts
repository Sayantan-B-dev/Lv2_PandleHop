import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifyPassword,
} from "@/lib/auth";
import { readCredentials } from "@/lib/credentials";
import { isDatabaseConfigured, query } from "@/lib/db";

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  password_hash: string;
};

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const parsed = readCredentials(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Accounts are unavailable because the database is not configured." },
      { status: 503 },
    );
  }

  try {
    const rows = await query<UserRow>(
      "SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1",
      [parsed.username],
    );
    const row = rows[0];

    if (!row || !(await verifyPassword(parsed.password, row.password_hash))) {
      return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
    }

    const user = { id: Number(row.id), username: row.username };
    const token = await createSessionToken(user);
    const response = NextResponse.json({ user });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("[pandalpass] login failed:", (error as Error).message);
    return NextResponse.json({ error: "Could not sign in. Try again." }, { status: 500 });
  }
}

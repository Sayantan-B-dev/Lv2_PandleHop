import { NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { readCredentials } from "@/lib/credentials";
import { execute, isDatabaseConfigured } from "@/lib/db";

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
    const passwordHash = await hashPassword(parsed.password);
    const result = await execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      parsed.username,
      passwordHash,
    ]);

    const user = { id: result.insertId, username: parsed.username };
    const token = await createSessionToken(user);
    const response = NextResponse.json({ user }, { status: 201 });
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
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
    }
    console.error("[pandalpass] register failed:", (error as Error).message);
    return NextResponse.json({ error: "Could not create the account. Try again." }, { status: 500 });
  }
}

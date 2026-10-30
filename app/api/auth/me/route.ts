import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

export async function GET() {
  const user = await readSession();
  const response = NextResponse.json({ user });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

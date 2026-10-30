import { NextResponse } from "next/server";
import { getData } from "@/lib/data";
import { generatePass, normalizePrefs } from "@/lib/itinerary";

export async function POST(request: Request) {
  const data = getData();
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const prefs = normalizePrefs(data, body);
  return NextResponse.json(generatePass(data, prefs));
}

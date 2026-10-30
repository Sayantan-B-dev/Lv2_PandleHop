import { NextResponse } from "next/server";
import { generatePass, normalizePrefs } from "@/lib/itinerary";
import { getProductData } from "@/lib/repository";

export async function POST(request: Request) {
  const data = await getProductData();
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const prefs = normalizePrefs(data, body);
  return NextResponse.json(generatePass(data, prefs));
}

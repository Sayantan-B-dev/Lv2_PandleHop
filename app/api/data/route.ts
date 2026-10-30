import { NextResponse } from "next/server";
import { getProductData } from "@/lib/repository";

export async function GET() {
  return NextResponse.json(await getProductData());
}

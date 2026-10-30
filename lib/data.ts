import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PandalPassData } from "./types";

let cache: PandalPassData | null = null;

export function getData(): PandalPassData {
  if (!cache) {
    const raw = readFileSync(join(process.cwd(), "data.json"), "utf8");
    cache = JSON.parse(raw) as PandalPassData;
  }
  return cache;
}

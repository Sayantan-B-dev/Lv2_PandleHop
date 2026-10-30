import { isDatabaseConfigured, query } from "./db";
import type { Crowd, EngineConfig, PandalPassData, Prefs, SiteConfig } from "./types";
import type { RowDataPacket } from "mysql2/promise";

type PandalRow = RowDataPacket & {
  id: number;
  name: string;
  area: string;
  tagline: string;
  crowd: "low" | "moderate" | "heavy";
  x: number;
  y: number;
};

type PandalTagRow = RowDataPacket & { pandal_id: number; tag: string };
type StartRow = RowDataPacket & { name: string; x: number; y: number };
type FoodRow = RowDataPacket & {
  id: string;
  icon: string;
  name: string;
  kind: string;
  area: string;
  price: number;
};
type VibeRow = RowDataPacket & { id: string; icon: string; label: string };
type TimeRow = RowDataPacket & { hours: number; count: number };
type ModeRow = RowDataPacket & { id: string; icon: string; label: string };
type AreaRow = RowDataPacket & { label: string; x: number; y: number };
type SettingRow = RowDataPacket & { name: string; value: unknown };

const CACHE_MS = 30_000;

let cache: { data: PandalPassData; expires: number } | null = null;
let pending: Promise<PandalPassData> | null = null;
let warned = false;

function setting<T>(settings: Record<string, unknown>, name: string): T {
  const value = settings[name];
  return (typeof value === "string" ? JSON.parse(value) : value) as T;
}

async function readFromDatabase(): Promise<PandalPassData> {
  const [pandalRows, tagRows, startRows, foodRows, vibeRows, timeRows, modeRows, areaRows, settingRows] =
    await Promise.all([
      query<PandalRow>("SELECT id, name, area, tagline, crowd, x, y FROM pandals ORDER BY id"),
      query<PandalTagRow>("SELECT pandal_id, tag FROM pandal_tags ORDER BY pandal_id, position"),
      query<StartRow>("SELECT name, x, y FROM starts ORDER BY position"),
      query<FoodRow>("SELECT id, icon, name, kind, area, price FROM foods ORDER BY position"),
      query<VibeRow>("SELECT id, icon, label FROM vibes ORDER BY position"),
      query<TimeRow>("SELECT hours, count FROM time_options ORDER BY hours"),
      query<ModeRow>("SELECT id, icon, label FROM travel_modes ORDER BY position"),
      query<AreaRow>("SELECT label, x, y FROM map_areas ORDER BY position"),
      query<SettingRow>("SELECT name, value FROM settings"),
    ]);

  const tagsByPandal = new Map<number, string[]>();
  for (const row of tagRows) {
    const tags = tagsByPandal.get(row.pandal_id) ?? [];
    tags.push(row.tag);
    tagsByPandal.set(row.pandal_id, tags);
  }

  const settings: Record<string, unknown> = {};
  for (const row of settingRows) {
    settings[row.name] = row.value;
  }

  return {
    site: setting<SiteConfig>(settings, "site"),
    defaultPrefs: setting<Prefs>(settings, "defaultPrefs"),
    home: setting<PandalPassData["home"]>(settings, "home"),
    pandalGlyphs: setting<string[]>(settings, "pandalGlyphs"),
    crowdLabels: setting<Record<Crowd, string>>(settings, "crowdLabels"),
    tagLabels: setting<Record<string, string>>(settings, "tagLabels"),
    pandals: pandalRows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      area: row.area,
      tagline: row.tagline,
      tags: tagsByPandal.get(row.id) ?? [],
      crowd: row.crowd,
      x: Number(row.x),
      y: Number(row.y),
    })),
    starts: startRows.map((row) => ({ name: row.name, x: Number(row.x), y: Number(row.y) })),
    foods: foodRows.map((row) => ({
      id: row.id,
      icon: row.icon,
      name: row.name,
      kind: row.kind,
      area: row.area,
      price: Number(row.price),
    })),
    vibes: vibeRows.map((row) => ({ id: row.id, icon: row.icon, label: row.label })),
    times: timeRows.map((row) => ({ hours: Number(row.hours), count: Number(row.count) })),
    modes: modeRows.map((row) => ({ id: row.id, icon: row.icon, label: row.label })),
    engine: setting<EngineConfig>(settings, "engine"),
    mapAreas: areaRows.map((row) => ({ label: row.label, x: Number(row.x), y: Number(row.y) })),
  } satisfies PandalPassData;
}

async function load(): Promise<PandalPassData> {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "Aiven MySQL is not configured. Set AIVEN_MYSQL_HOST, AIVEN_MYSQL_DATABASE, AIVEN_MYSQL_USER and AIVEN_MYSQL_PASSWORD.",
    );
  }
  try {
    return await readFromDatabase();
  } catch (error) {
    if (!warned) {
      warned = true;
      console.error(`[pandalpass] Aiven MySQL read failed: ${(error as Error).message}`);
    }
    throw error;
  }
}

export async function getProductData(): Promise<PandalPassData> {
  if (cache && cache.expires > Date.now()) {
    return cache.data;
  }
  if (!pending) {
    pending = load()
      .then((data) => {
        cache = { data, expires: Date.now() + CACHE_MS };
        return data;
      })
      .finally(() => {
        pending = null;
      });
  }
  // Fallback to minimal demo data when database is not configured
  if (!isDatabaseConfigured()) {
    return {
      site: {
        name: "PandalPass",
        festival: "Durga Pujo",
        planningNote: "",
        storage: { prefs: "prefs", pass: "pass" },
      },
      defaultPrefs: { start: "", vibes: [], hours: 3, mode: "walk", food: false },
      home: { pickIds: [], foodCount: 0 },
      pandalGlyphs: [],
      crowdLabels: { low: "Low", moderate: "Moderate", heavy: "Heavy" },
      tagLabels: {},
      pandals: [],
      starts: [{ name: "Start", x: 0, y: 0 }],
      foods: [],
      vibes: [],
      times: [{ hours: 1, count: 4 }],
      modes: [{ id: "walk", icon: "walk", label: "Walk" }],
      engine: {
        distanceScale: 0.01,
        startClock: 0,
        stayBase: 0,
        stayStep: 5,
        waitStep: 5,
        minLegMins: 0,
        foodOffset: 0,
        foodWalkMins: 5,
        foodWalkKm: 0.1,
        foodStayMins: 5,
        crowdBase: { low: 0, moderate: 5, heavy: 10 },
        travel: {
          walk: { label: "Walk", icon: "walk", baseMins: 0, minsPerKm: 0 },
          auto: { label: "Auto", icon: "car", baseMins: 0, minsPerKm: 0, maxKm: 1000 },
          metro: { label: "Metro", icon: "metro", baseMins: 0, minsPerKm: 0, walkKm: 0 },
          cab: { label: "Cab", icon: "taxi", baseMins: 0, minsPerKm: 0, cost: 0 },
        },
      },
      mapAreas: [],
    } satisfies PandalPassData;
  }
  return pending;
}

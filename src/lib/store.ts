// ============================================================================
//  Rathod Foundation — data store.
//  Primary backend: Supabase (when configured via .env). If Supabase is not
//  configured or a call fails, every function transparently falls back to
//  localStorage so the app keeps working offline / before the SQL is run.
//  All read/write functions are async.
// ============================================================================

import { supabase, supabaseEnabled } from "./supabase";

export type Lang = "en" | "te" | "hi";

/** Verification workflow stages (the 7-step flow, shown as 5 visible stages). */
export const STAGES = [
  { key: "received", en: "Application received", te: "దరఖాస్తు అందింది", hi: "आवेदन प्राप्त हुआ" },
  { key: "assigned", en: "Volunteer assigned", te: "వాలంటీర్ కేటాయించబడ్డారు", hi: "वॉलंटियर नियुक्त" },
  { key: "verified", en: "Field verified", te: "క్షేత్రస్థాయి ధృవీకరణ", hi: "मौके पर सत्यापित" },
  { key: "review", en: "Under review", te: "సమీక్షలో ఉంది", hi: "समीक्षाधीन" },
  { key: "resolved", en: "Resolved", te: "పరిష్కరించబడింది", hi: "हल किया गया" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];
export type CaseType = "help" | "civic";
export type TimelineEntry = { stage: StageKey; at: string; note?: string };

export type Case = {
  id: string;
  type: CaseType;
  category: string;
  name: string;
  phone: string;
  location: string;
  details: string;
  lang: Lang;
  stageIndex: number;
  outcome?: "resolved" | "guided";
  createdAt: string;
  timeline: TimelineEntry[];
};

export type Volunteer = {
  id: string;
  name: string;
  phone: string;
  area: string;
  skills: string;
  createdAt: string;
};

export type Suggestion = {
  id: string;
  kind: "issue" | "campaign";
  text: string;
  area: string;
  createdAt: string;
};

// ---- localStorage fallback keys --------------------------------------------
const K_CASES = "rf_cases_v2";
const K_VOL = "rf_volunteers_v1";
const K_SUG = "rf_suggestions_v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage full / disabled — ignore */
  }
}

// ---- tracking id ------------------------------------------------------------
export function makeTrackingId(prefix = "RF"): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${seq}-${rand}`;
}

// ---- row <-> Case mapping (Supabase uses snake_case) -----------------------
type CaseRow = {
  id: string;
  type: CaseType;
  category: string;
  name: string;
  phone: string;
  location: string;
  details: string;
  lang: Lang;
  stage_index: number;
  outcome: "resolved" | "guided" | null;
  timeline: TimelineEntry[] | null;
  created_at: string;
};

function rowToCase(r: CaseRow): Case {
  return {
    id: r.id,
    type: r.type,
    category: r.category,
    name: r.name ?? "",
    phone: r.phone ?? "",
    location: r.location ?? "",
    details: r.details ?? "",
    lang: (r.lang as Lang) ?? "en",
    stageIndex: r.stage_index ?? 0,
    outcome: r.outcome ?? undefined,
    createdAt: r.created_at,
    timeline: Array.isArray(r.timeline) ? r.timeline : [],
  };
}

// ---- localStorage seed (only used when Supabase is unavailable) ------------
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function seed(type: CaseType, category: string, name: string, location: string, stageIndex: number, ago: number, outcome?: "resolved" | "guided"): Case {
  const timeline: TimelineEntry[] = [];
  for (let i = 0; i <= stageIndex; i++) {
    timeline.push({ stage: STAGES[i].key, at: daysAgo(ago - i * 2 > 0 ? ago - i * 2 : 0) });
  }
  return {
    id: makeTrackingId(),
    type, category, name, phone: "", location, details: "", lang: "en",
    stageIndex,
    outcome: stageIndex >= 4 ? outcome ?? "resolved" : undefined,
    createdAt: daysAgo(ago),
    timeline,
  };
}
const SEED: Case[] = [
  seed("help", "medical", "Lakshmi B.", "Road No. 12", 4, 18),
  seed("help", "pension", "Ramulu N.", "N.B. Nagar", 4, 12, "guided"),
  seed("help", "ration", "Saroja K.", "Journalist Colony", 3, 9),
  seed("help", "education", "Imran S.", "Road No. 10", 4, 25),
  seed("help", "senior", "Anasuya R.", "MLA Colony", 2, 3),
  seed("help", "scheme", "Venkatesh P.", "Shri Nagar Colony", 4, 30, "guided"),
  seed("civic", "Water supply", "Resident", "Road No. 14", 4, 14),
  seed("civic", "Street lighting", "Resident", "N.B. Nagar", 3, 6),
  seed("help", "electricity", "Sunitha M.", "Road No. 12", 1, 1),
  seed("help", "family", "Kumar D.", "Road No. 10", 4, 21),
  seed("help", "medical", "Fatima A.", "MLA Colony", 4, 40),
  seed("civic", "Drainage & sewage", "Resident", "Journalist Colony", 4, 33),
];

// ============================================================================
//  CASES
// ============================================================================
export async function listCases(): Promise<Case[]> {
  if (supabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as CaseRow[]).map(rowToCase);
    } catch (e) {
      console.warn("[store] listCases falling back to localStorage:", e);
    }
  }
  return [...read<Case[]>(K_CASES, []), ...SEED];
}

export async function getCase(id: string): Promise<Case | undefined> {
  const norm = id.trim().toUpperCase();
  if (supabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase.from("cases").select("*");
      if (error) throw error;
      return (data as CaseRow[]).map(rowToCase).find((c) => c.id.toUpperCase() === norm);
    } catch (e) {
      console.warn("[store] getCase falling back to localStorage:", e);
    }
  }
  return [...read<Case[]>(K_CASES, []), ...SEED].find((c) => c.id.toUpperCase() === norm);
}

export async function createCase(
  input: Omit<Case, "id" | "stageIndex" | "createdAt" | "timeline">
): Promise<Case> {
  const now = new Date().toISOString();
  const c: Case = {
    ...input,
    id: makeTrackingId(),
    stageIndex: 0,
    createdAt: now,
    timeline: [{ stage: "received", at: now, note: "Submitted online" }],
  };

  if (supabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("cases").insert({
        id: c.id,
        type: c.type,
        category: c.category,
        name: c.name,
        phone: c.phone,
        location: c.location,
        details: c.details,
        lang: c.lang,
        stage_index: c.stageIndex,
        outcome: c.outcome ?? null,
        timeline: c.timeline,
        created_at: c.createdAt,
      });
      if (error) throw error;
      return c;
    } catch (e) {
      console.warn("[store] createCase falling back to localStorage:", e);
    }
  }

  const user = read<Case[]>(K_CASES, []);
  user.unshift(c);
  write(K_CASES, user);
  return c;
}

export async function updateCaseStage(id: string, stageIndex: number, note?: string): Promise<boolean> {
  const clamped = Math.min(Math.max(stageIndex, 0), STAGES.length - 1);

  if (supabaseEnabled && supabase) {
    try {
      const { data: existing, error: readErr } = await supabase
        .from("cases")
        .select("timeline")
        .eq("id", id)
        .single();
      if (readErr) throw readErr;
      const timeline: TimelineEntry[] = Array.isArray((existing as { timeline?: TimelineEntry[] })?.timeline)
        ? (existing as { timeline: TimelineEntry[] }).timeline
        : [];
      timeline.push({ stage: STAGES[clamped].key, at: new Date().toISOString(), note: note || "Updated by admin" });
      const { error } = await supabase
        .from("cases")
        .update({
          stage_index: clamped,
          timeline,
          outcome: clamped >= 4 ? "resolved" : null,
        })
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn("[store] updateCaseStage falling back to localStorage:", e);
    }
  }

  const all = read<Case[]>(K_CASES, []);
  const idx = all.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) return false;
  const c = { ...all[idx] };
  c.stageIndex = clamped;
  c.timeline = [...c.timeline, { stage: STAGES[clamped].key, at: new Date().toISOString(), note: note || "Updated by admin" }];
  if (c.stageIndex >= 4) c.outcome = c.outcome ?? "resolved";
  all[idx] = c;
  write(K_CASES, all);
  return true;
}

// ============================================================================
//  VOLUNTEERS & SUGGESTIONS
// ============================================================================
export async function saveVolunteer(input: Omit<Volunteer, "id" | "createdAt">): Promise<Volunteer> {
  const v: Volunteer = { ...input, id: makeTrackingId("VOL"), createdAt: new Date().toISOString() };
  if (supabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("volunteers").insert({
        id: v.id, name: v.name, phone: v.phone, area: v.area, skills: v.skills, created_at: v.createdAt,
      });
      if (error) throw error;
      return v;
    } catch (e) {
      console.warn("[store] saveVolunteer falling back to localStorage:", e);
    }
  }
  const all = read<Volunteer[]>(K_VOL, []);
  all.unshift(v);
  write(K_VOL, all);
  return v;
}

export async function listVolunteers(): Promise<Volunteer[]> {
  if (supabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Array<Volunteer & { created_at: string }>).map((r) => ({
        id: r.id, name: r.name, phone: r.phone, area: r.area, skills: r.skills, createdAt: r.created_at,
      }));
    } catch (e) {
      console.warn("[store] listVolunteers falling back to localStorage:", e);
    }
  }
  return read<Volunteer[]>(K_VOL, []);
}

export async function saveSuggestion(input: Omit<Suggestion, "id" | "createdAt">): Promise<Suggestion> {
  const s: Suggestion = { ...input, id: makeTrackingId("SUG"), createdAt: new Date().toISOString() };
  if (supabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("suggestions").insert({
        id: s.id, kind: s.kind, text: s.text, area: s.area, created_at: s.createdAt,
      });
      if (error) throw error;
      return s;
    } catch (e) {
      console.warn("[store] saveSuggestion falling back to localStorage:", e);
    }
  }
  const all = read<Suggestion[]>(K_SUG, []);
  all.unshift(s);
  write(K_SUG, all);
  return s;
}

// ============================================================================
//  AGGREGATE STATS (dashboard)
// ============================================================================
const BASE_VOLUNTEERS = 48; // standing volunteer network
const BASE_WARDS = 7;

export type Stats = {
  received: number;
  verified: number;
  resolved: number;
  volunteers: number;
  wards: number;
  byCategory: { category: string; count: number }[];
};

export async function getStats(): Promise<Stats> {
  const [cases, volunteers] = await Promise.all([listCases(), listVolunteers()]);
  const verified = cases.filter((c) => c.stageIndex >= 2).length;
  const resolved = cases.filter((c) => c.stageIndex >= 4).length;
  const byMap = new Map<string, number>();
  const wardSet = new Set<string>();
  for (const c of cases) {
    byMap.set(c.category, (byMap.get(c.category) ?? 0) + 1);
    if (c.location) wardSet.add(c.location);
  }
  const byCategory = [...byMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  return {
    received: cases.length,
    verified,
    resolved,
    volunteers: BASE_VOLUNTEERS + volunteers.length,
    wards: Math.max(BASE_WARDS, wardSet.size),
    byCategory,
  };
}

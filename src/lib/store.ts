// ============================================================================
//  Rathod Foundation — data store (Supabase only, no localStorage fallback).
// ============================================================================

import { supabase } from "./supabase";

export type Lang = "en" | "te" | "hi";

export const STAGES = [
  { key: "received", en: "Application received",       te: "దరఖాస్తు అందింది",                hi: "आवेदन प्राप्त हुआ" },
  { key: "assigned", en: "Volunteer assigned",          te: "వాలంటీర్ కేటాయించబడ్డారు",      hi: "वॉलंटियर नियुक्त" },
  { key: "verified", en: "Field verified",              te: "క్షేత్రస్థాయి ధృవీకరణ",          hi: "मौके पर सत्यापित" },
  { key: "review",   en: "Under review",                te: "సమీక్షలో ఉంది",                   hi: "समीक्षाधीन" },
  { key: "resolved", en: "Resolved",                    te: "పరిష్కరించబడింది",                 hi: "हल किया गया" },
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

// ── Tracking ID ───────────────────────────────────────────────────────────────
export function makeTrackingId(prefix = "RF"): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${seq}-${rand}`;
}

// ── Row → Case mapping ────────────────────────────────────────────────────────
type CaseRow = {
  id: string; type: CaseType; category: string; name: string; phone: string;
  location: string; details: string; lang: Lang; stage_index: number;
  outcome: "resolved" | "guided" | null; timeline: TimelineEntry[] | null; created_at: string;
};

function rowToCase(r: CaseRow): Case {
  return {
    id: r.id, type: r.type, category: r.category,
    name: r.name ?? "", phone: r.phone ?? "", location: r.location ?? "",
    details: r.details ?? "", lang: (r.lang as Lang) ?? "en",
    stageIndex: r.stage_index ?? 0,
    outcome: r.outcome ?? undefined,
    createdAt: r.created_at,
    timeline: Array.isArray(r.timeline) ? r.timeline : [],
  };
}

// ── Cases ─────────────────────────────────────────────────────────────────────
export async function listCases(): Promise<Case[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("[store] listCases:", error); return []; }
  return (data as CaseRow[]).map(rowToCase);
}

export async function getCase(id: string): Promise<Case | undefined> {
  if (!supabase) return undefined;
  const norm = id.trim().toUpperCase();
  const { data, error } = await supabase.from("cases").select("*");
  if (error) { console.error("[store] getCase:", error); return undefined; }
  return (data as CaseRow[]).map(rowToCase).find((c) => c.id.toUpperCase() === norm);
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
  if (!supabase) return c;
  const { error } = await supabase.from("cases").insert({
    id: c.id, type: c.type, category: c.category, name: c.name,
    phone: c.phone, location: c.location, details: c.details, lang: c.lang,
    stage_index: c.stageIndex, outcome: c.outcome ?? null,
    timeline: c.timeline, created_at: c.createdAt,
  });
  if (error) console.error("[store] createCase:", error);
  return c;
}

export async function updateCaseStage(id: string, stageIndex: number, note?: string): Promise<boolean> {
  if (!supabase) return false;
  const clamped = Math.min(Math.max(stageIndex, 0), STAGES.length - 1);
  const { data: existing, error: readErr } = await supabase
    .from("cases").select("timeline").eq("id", id).single();
  if (readErr) { console.error("[store] updateCaseStage read:", readErr); return false; }
  const timeline: TimelineEntry[] = Array.isArray((existing as { timeline?: TimelineEntry[] })?.timeline)
    ? (existing as { timeline: TimelineEntry[] }).timeline : [];
  timeline.push({ stage: STAGES[clamped].key, at: new Date().toISOString(), note: note || "Updated by admin" });
  const { error } = await supabase.from("cases").update({
    stage_index: clamped, timeline, outcome: clamped >= 4 ? "resolved" : null,
  }).eq("id", id);
  if (error) { console.error("[store] updateCaseStage update:", error); return false; }
  return true;
}

// ── Volunteers ────────────────────────────────────────────────────────────────
export async function saveVolunteer(input: Omit<Volunteer, "id" | "createdAt">): Promise<Volunteer> {
  const v: Volunteer = { ...input, id: makeTrackingId("VOL"), createdAt: new Date().toISOString() };
  if (!supabase) return v;
  const { error } = await supabase.from("volunteers").insert({
    id: v.id, name: v.name, phone: v.phone, area: v.area, skills: v.skills, created_at: v.createdAt,
  });
  if (error) console.error("[store] saveVolunteer:", error);
  return v;
}

export async function listVolunteers(): Promise<Volunteer[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("volunteers").select("*").order("created_at", { ascending: false });
  if (error) { console.error("[store] listVolunteers:", error); return []; }
  return (data as Array<{ id: string; name: string; phone: string; area: string; skills: string; created_at: string }>)
    .map((r) => ({ id: r.id, name: r.name, phone: r.phone, area: r.area, skills: r.skills, createdAt: r.created_at }));
}

// ── Suggestions ───────────────────────────────────────────────────────────────
export async function saveSuggestion(input: Omit<Suggestion, "id" | "createdAt">): Promise<Suggestion> {
  const s: Suggestion = { ...input, id: makeTrackingId("SUG"), createdAt: new Date().toISOString() };
  if (!supabase) return s;
  const { error } = await supabase.from("suggestions").insert({
    id: s.id, kind: s.kind, text: s.text, area: s.area, created_at: s.createdAt,
  });
  if (error) console.error("[store] saveSuggestion:", error);
  return s;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const BASE_VOLUNTEERS = 48;
const BASE_WARDS = 7;

export type Stats = {
  received: number; verified: number; resolved: number;
  volunteers: number; wards: number;
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
    received: cases.length, verified, resolved,
    volunteers: BASE_VOLUNTEERS + volunteers.length,
    wards: Math.max(BASE_WARDS, wardSet.size),
    byCategory,
  };
}

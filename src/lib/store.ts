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

// Public lookup — goes through the track_case() RPC so anonymous visitors
// only ever get back the non-sensitive columns (never name/phone/details).
export async function getCase(id: string): Promise<Case | undefined> {
  if (!supabase) return undefined;
  const norm = id.trim().toUpperCase();
  if (!norm) return undefined;
  const { data, error } = await supabase.rpc("track_case", { p_id: norm });
  if (error) { console.error("[store] getCase:", error); return undefined; }
  const row = (data as Partial<CaseRow>[] | null)?.[0];
  if (!row) return undefined;
  return rowToCase({ name: "", phone: "", details: "", lang: "en", ...row } as CaseRow);
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
  if (!supabase) throw new Error("Not connected — can't submit right now.");
  const { error } = await supabase.from("cases").insert({
    id: c.id, type: c.type, category: c.category, name: c.name,
    phone: c.phone, location: c.location, details: c.details, lang: c.lang,
    stage_index: c.stageIndex, outcome: c.outcome ?? null,
    timeline: c.timeline, created_at: c.createdAt,
  });
  if (error) { console.error("[store] createCase:", error); throw error; }
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
  if (!supabase) throw new Error("Not connected — can't submit right now.");
  const { error } = await supabase.from("volunteers").insert({
    id: v.id, name: v.name, phone: v.phone, area: v.area, skills: v.skills, created_at: v.createdAt,
  });
  if (error) { console.error("[store] saveVolunteer:", error); throw error; }
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
  if (!supabase) throw new Error("Not connected — can't submit right now.");
  const { error } = await supabase.from("suggestions").insert({
    id: s.id, kind: s.kind, text: s.text, area: s.area, created_at: s.createdAt,
  });
  if (error) { console.error("[store] saveSuggestion:", error); throw error; }
  return s;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
// Public-facing (Dashboard page): both go through SECURITY DEFINER RPCs, so
// anonymous visitors get aggregate counts / limited fields only — never the
// raw cases/volunteers tables (name, phone, issue details).

export type Stats = {
  received: number; verified: number; resolved: number;
  volunteers: number; wards: number;
  byCategory: { category: string; count: number }[];
};

export const EMPTY_STATS: Stats = { received: 0, verified: 0, resolved: 0, volunteers: 0, wards: 0, byCategory: [] };

export async function getStats(): Promise<Stats> {
  if (!supabase) return EMPTY_STATS;
  const { data, error } = await supabase.rpc("public_stats").single();
  if (error) { console.error("[store] getStats:", error); return EMPTY_STATS; }
  const row = data as { received: number; verified: number; resolved: number; volunteers: number; wards: number; by_category: { category: string; count: number }[] };
  return {
    received: row.received, verified: row.verified, resolved: row.resolved,
    volunteers: row.volunteers, wards: row.wards,
    byCategory: row.by_category ?? [],
  };
}

export type RecentActivity = { id: string; type: CaseType; category: string; location: string; stageIndex: number; createdAt: string };

export async function getRecentActivity(limit = 6): Promise<RecentActivity[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("recent_activity", { p_limit: limit });
  if (error) { console.error("[store] getRecentActivity:", error); return []; }
  return (data as { id: string; type: CaseType; category: string; location: string; stage_index: number; created_at: string }[]).map((r) => ({
    id: r.id, type: r.type, category: r.category, location: r.location, stageIndex: r.stage_index, createdAt: r.created_at,
  }));
}

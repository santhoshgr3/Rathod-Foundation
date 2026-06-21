// ============================================================================
//  Rathod Foundation — client-side data store.
//  Everything persists to localStorage so the platform fully works with no
//  backend. To go live, swap the read/write helpers for Supabase calls — the
//  shapes below map 1:1 to database tables.
// ============================================================================

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
  category: string; // category id (see data/help.ts) or civic category
  name: string;
  phone: string;
  location: string;
  details: string;
  lang: Lang;
  stageIndex: number; // 0..4 into STAGES
  outcome?: "resolved" | "guided"; // resolved directly, or guided to a govt office
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

// ---- seed data (so the dashboard & map feel alive on first visit) ----------
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
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

function seed(type: CaseType, category: string, name: string, location: string, stageIndex: number, ago: number, outcome?: "resolved" | "guided"): Case {
  const id = makeTrackingId(type === "civic" ? "RF" : "RF");
  const timeline: TimelineEntry[] = [];
  for (let i = 0; i <= stageIndex; i++) {
    timeline.push({ stage: STAGES[i].key, at: daysAgo(ago - i * 2 > 0 ? ago - i * 2 : 0) });
  }
  return {
    id,
    type,
    category,
    name,
    phone: "",
    location,
    details: "",
    lang: "en",
    stageIndex,
    outcome: stageIndex >= 4 ? outcome ?? "resolved" : undefined,
    createdAt: daysAgo(ago),
    timeline,
  };
}

// ---- cases ------------------------------------------------------------------
export function listCases(): Case[] {
  const user = read<Case[]>(K_CASES, []);
  return [...user, ...SEED];
}

export function getCase(id: string): Case | undefined {
  const norm = id.trim().toUpperCase();
  return listCases().find((c) => c.id.toUpperCase() === norm);
}

export function createCase(input: Omit<Case, "id" | "stageIndex" | "createdAt" | "timeline">): Case {
  const now = new Date().toISOString();
  const c: Case = {
    ...input,
    id: makeTrackingId(),
    stageIndex: 0,
    createdAt: now,
    timeline: [{ stage: "received", at: now, note: "Submitted online" }],
  };
  const user = read<Case[]>(K_CASES, []);
  user.unshift(c);
  write(K_CASES, user);
  return c;
}

// ---- volunteers & suggestions ----------------------------------------------
export function saveVolunteer(input: Omit<Volunteer, "id" | "createdAt">): Volunteer {
  const v: Volunteer = { ...input, id: makeTrackingId("VOL"), createdAt: new Date().toISOString() };
  const all = read<Volunteer[]>(K_VOL, []);
  all.unshift(v);
  write(K_VOL, all);
  return v;
}
export function listVolunteers(): Volunteer[] {
  return read<Volunteer[]>(K_VOL, []);
}

export function saveSuggestion(input: Omit<Suggestion, "id" | "createdAt">): Suggestion {
  const s: Suggestion = { ...input, id: makeTrackingId("SUG"), createdAt: new Date().toISOString() };
  const all = read<Suggestion[]>(K_SUG, []);
  all.unshift(s);
  write(K_SUG, all);
  return s;
}

// ---- admin case management --------------------------------------------------
export function updateCaseStage(id: string, stageIndex: number, note?: string): boolean {
  const all = read<Case[]>(K_CASES, []);
  const idx = all.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) return false; // seed cases are not in K_CASES — can't update
  const c = { ...all[idx] };
  c.stageIndex = Math.min(Math.max(stageIndex, 0), STAGES.length - 1);
  c.timeline = [
    ...c.timeline,
    { stage: STAGES[c.stageIndex].key, at: new Date().toISOString(), note: note || "Updated by admin" },
  ];
  if (c.stageIndex >= 4) c.outcome = c.outcome ?? "resolved";
  all[idx] = c;
  write(K_CASES, all);
  return true;
}

export function deleteCase(id: string): boolean {
  const all = read<Case[]>(K_CASES, []);
  const filtered = all.filter((c) => c.id.toUpperCase() !== id.toUpperCase());
  if (filtered.length === all.length) return false;
  write(K_CASES, filtered);
  return true;
}

// ---- aggregate stats for the dashboard -------------------------------------
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

export function getStats(): Stats {
  const cases = listCases();
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
    volunteers: BASE_VOLUNTEERS + listVolunteers().length,
    wards: Math.max(BASE_WARDS, wardSet.size),
    byCategory,
  };
}

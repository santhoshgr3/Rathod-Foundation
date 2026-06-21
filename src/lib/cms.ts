// ============================================================================
//  Rathod Foundation — CMS data layer.
//  All site content lives here (localStorage), seeded from content.ts defaults.
//  Components read from CMSContext; admin panel writes here via updateCMS().
// ============================================================================

import {
  leader as dLeader,
  bio as dBio,
  stats as dStats,
  promises as dPromises,
  wards as dWards,
  cases as dCases,
  steps as dSteps,
} from "../data/content";
import type { WorkCase } from "../data/content";

// ── Exported types ────────────────────────────────────────────────────────────

export type CMSLeader = typeof dLeader;
export type CMSBioEntry = { year: string; title: string; detail: string };
export type CMSValue = { icon: string; title: string; text: string };
export type CMSBio = { intro: string; journey: CMSBioEntry[]; values: CMSValue[] };
export type CMSStat = { value: number; suffix: string; label: string };
export type CMSStep = { n: string; title: string; text: string };
export type CMSWard = { name: string; count: number };
export type CMSWorkCase = WorkCase;

export type CMSGalleryPhoto = {
  id: string;
  src: string;
  caption: string;
  tag: "leader" | "events" | "work";
};

export type CMSTimelineEntry = {
  id: string;
  year: string;
  title: string;
  detail: string;
  color: "saffron" | "green";
  icon: string;
};

export type CMSContent = {
  leader: CMSLeader;
  bio: CMSBio;
  stats: CMSStat[];
  steps: CMSStep[];
  promises: string[];
  wards: CMSWard[];
  gallery: CMSGalleryPhoto[];
  timeline: CMSTimelineEntry[];
  workCases: CMSWorkCase[];
  adminPassword: string;
};

// ── Built-in gallery photos ───────────────────────────────────────────────────
const DEFAULT_GALLERY: CMSGalleryPhoto[] = [
  { id: "hero-red", src: "/img/namaste-red.jpeg", caption: "R. Dhanraj Rathod at a community gathering", tag: "leader" },
  { id: "hero-tricolor", src: "/img/namaste-tricolor.jpeg", caption: "R. Dhanraj Rathod — Independence Day event", tag: "events" },
  { id: "candid", src: "/img/candid.jpeg", caption: "On the ground in Banjara Hills", tag: "events" },
  { id: "with-cm", src: "/img/with-cm.jpeg", caption: "Working hand-in-hand with officials and the community", tag: "events" },
  { id: "biodata", src: "/img/biodata.jpeg", caption: "R. Dhanraj Rathod — Official photograph", tag: "leader" },
];

// ── Default timeline ──────────────────────────────────────────────────────────
const DEFAULT_TIMELINE: CMSTimelineEntry[] = [
  { id: "t1", year: "1976", title: "Born in S.T. (Lambadi) community", detail: "R. Dhanraj Rathod was born on 14 September 1976 in the Lambadi (Scheduled Tribe) community — a heritage that would define his lifelong commitment to tribal welfare.", color: "saffron", icon: "🌱" },
  { id: "t2", year: "2000", title: "City-wide community organiser — Hyderabad", detail: "Began coordinating ward-level grievance drives across the old city and Banjara Hills, building the grassroots networks that persist today.", color: "green", icon: "🤝" },
  { id: "t3", year: "2003", title: "Ward grievance drives — 40+ localities", detail: "Expanded reach to more than 40 localities, setting up weekly listening camps that became a model for civic responsiveness.", color: "saffron", icon: "📋" },
  { id: "t4", year: "2006", title: "Citywide civic coordinator", detail: "Scaled up rapid-response campaigns on water supply, roads and sanitation — first to introduce a same-week resolution commitment.", color: "green", icon: "🏙️" },
  { id: "t5", year: "2012", title: "Youth Welfare Association — President", detail: "Founded and led the association to mobilise young volunteers for on-ground civic work, creating a pipeline of trained community responders.", color: "saffron", icon: "🧑‍🤝‍🧑" },
  { id: "t6", year: "2020", title: "COVID-19 community relief drive", detail: "Organised food kits, medicine distribution and oxygen support for 500+ families across Banjara Hills during the pandemic peak.", color: "green", icon: "🫁" },
  { id: "t7", year: "2024", title: "Rathod Foundation — digital platform launch", detail: "Launched Banjara Hills' first digital community support platform — online issue reporting with live tracking numbers and a 24-hour response promise.", color: "saffron", icon: "💻" },
  { id: "t8", year: "Present", title: "Convenor — Community & Tribal Welfare", detail: "Champions tribal and Lambadi welfare while running a 24-hour civic help desk, volunteer verification system and interactive public dashboard.", color: "green", icon: "🏆" },
];

// ── Defaults factory ──────────────────────────────────────────────────────────
function defaults(): CMSContent {
  return {
    leader: { ...dLeader, phones: [...dLeader.phones], languages: [...dLeader.languages], photos: { ...dLeader.photos } },
    bio: {
      intro: dBio.intro,
      journey: dBio.journey.map((j) => ({ ...j })),
      values: dBio.values.map((v) => ({ ...v })),
    },
    stats: dStats.map((s) => ({ ...s })),
    steps: dSteps.map((s) => ({ ...s })),
    promises: [...dPromises],
    wards: dWards.map((w) => ({ ...w })),
    gallery: DEFAULT_GALLERY.map((p) => ({ ...p })),
    timeline: DEFAULT_TIMELINE.map((t) => ({ ...t })),
    workCases: dCases.map((c) => ({ ...c })),
    adminPassword: "RF@2024",
  };
}

// ── Storage helpers ───────────────────────────────────────────────────────────
const KEY = "rf_cms_v1";

export function loadCMS(): CMSContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<CMSContent>;
      const def = defaults();
      return {
        leader: stored.leader ?? def.leader,
        bio: stored.bio ?? def.bio,
        stats: stored.stats ?? def.stats,
        steps: stored.steps ?? def.steps,
        promises: stored.promises ?? def.promises,
        wards: stored.wards ?? def.wards,
        gallery: stored.gallery ?? def.gallery,
        timeline: stored.timeline ?? def.timeline,
        workCases: stored.workCases ?? def.workCases,
        adminPassword: stored.adminPassword ?? def.adminPassword,
      };
    }
  } catch {/* ignore */}
  return defaults();
}

export function saveCMS(content: CMSContent): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(content));
  } catch {/* ignore */}
}

export function resetCMS(): void {
  localStorage.removeItem(KEY);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

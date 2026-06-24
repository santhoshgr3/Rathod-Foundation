// ============================================================================
//  Rathod Foundation — CMS data layer.
//  All site content is stored in Supabase (cms_content table, single row id=1).
//  Components read from CMSContext; admin panel writes via updateCMS().
// ============================================================================

import { supabase } from "./supabase";
import {
  leader as dLeader,
  bio as dBio,
  stats as dStats,
  promises as dPromises,
  wards as dWards,
  cases as dCases,
  steps as dSteps,
  chairman as dChairman,
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

export type CMSChairman = {
  name: string;
  role: string;
  affiliation: string;
  bio: string;
  highlights: string[];
  photo: string;
};

export type CMSPageHeader = { eyebrow: string; title: string; subtitle: string };

export type CMSHome = {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  visionText: string;
};

export type CMSPages = {
  work: CMSPageHeader;
  impact: CMSPageHeader;
  process: CMSPageHeader;
  report: CMSPageHeader;
  volunteer: CMSPageHeader;
  gallery: CMSPageHeader;
  dashboard: CMSPageHeader;
  track: CMSPageHeader;
  about: CMSPageHeader;
  seekHelp: CMSPageHeader;
};

export type CMSContent = {
  leader: CMSLeader;
  bio: CMSBio;
  chairman: CMSChairman;
  home: CMSHome;
  pages: CMSPages;
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
export function defaults(): CMSContent {
  return {
    leader: { ...dLeader, phones: [...dLeader.phones], languages: [...dLeader.languages], photos: { ...dLeader.photos } },
    bio: {
      intro: dBio.intro,
      journey: dBio.journey.map((j) => ({ ...j })),
      values: dBio.values.map((v) => ({ ...v })),
    },
    chairman: {
      name: dChairman.name,
      role: dChairman.role,
      affiliation: dChairman.affiliation,
      bio: dChairman.bio,
      highlights: [...dChairman.highlights],
      photo: "/img/chairman.jpeg.jpeg",
    },
    home: {
      badge: "24-hour response · Banjara Hills",
      heroTitle: "Banjara Hills' First Digital Community Support Platform.",
      heroSubtitle: "Apply online, we reach your doorstep.",
      heroBody: "Connecting needs with solutions across Banjara Hills.",
      visionText: "No family should be left unheard. Rathod Foundation connects people in need with volunteers who verify concerns, guide beneficiaries, and help resolve issues with dignity and transparency.",
    },
    pages: {
      work:      { eyebrow: "Work done",         title: "Before & after, on the record",       subtitle: "Drag the slider on each card to see the change. Every case is dated, located in Banjara Hills, and resolved on the ground." },
      impact:    { eyebrow: "Impact",             title: "The footprint across Banjara Hills",  subtitle: "Where the issues come from, how many are resolved, and exactly where on the map the work is happening." },
      process:   { eyebrow: "How it works",       title: "From request to resolution",          subtitle: "No runaround, no lost paperwork. Every request is verified on the ground and tracked end to end — with dignity and transparency." },
      report:    { eyebrow: "Report an issue",    title: "Report an issue",                     subtitle: "Tell us what's wrong and get a live tracking number in seconds. We respond within 24 hours." },
      volunteer: { eyebrow: "Get involved",       title: "Be the change in your ward",          subtitle: "The foundation runs on neighbours helping neighbours. Join as a volunteer, flag an issue, or take part in a campaign." },
      gallery:   { eyebrow: "Gallery",            title: "Our work in pictures",                subtitle: "Photos from the ground — events, before & after, and the people making it happen." },
      dashboard: { eyebrow: "Dashboard",          title: "Impact at a glance",                  subtitle: "Live numbers from the field. Every case, every ward, every volunteer — counted and tracked." },
      track:     { eyebrow: "Track your case",    title: "Track your case",                     subtitle: "Enter your case ID to see exactly where your request stands — updated in real time." },
      about:     { eyebrow: "About",              title: "Meet Dhanraj Rathod",                 subtitle: "A grassroots leader from Banjara Hills who measures success in problems solved — not promises made." },
      seekHelp:  { eyebrow: "Seek help",          title: "How can we help you?",                subtitle: "Tell us what you need — a volunteer will reach out within 24 hours." },
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

// ── Supabase CMS helpers ──────────────────────────────────────────────────────

export async function loadCMS(): Promise<CMSContent> {
  if (!supabase) return defaults();
  try {
    const { data, error } = await supabase
      .from("cms_content")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    if (data?.data) {
      const stored = data.data as Partial<CMSContent>;
      const def = defaults();
      return {
        leader:        stored.leader        ?? def.leader,
        bio:           stored.bio           ?? def.bio,
        chairman:      stored.chairman      ?? def.chairman,
        home:          stored.home          ?? def.home,
        pages:         stored.pages         ?? def.pages,
        stats:         stored.stats         ?? def.stats,
        steps:         stored.steps         ?? def.steps,
        promises:      stored.promises      ?? def.promises,
        wards:         stored.wards         ?? def.wards,
        gallery:       stored.gallery       ?? def.gallery,
        timeline:      stored.timeline      ?? def.timeline,
        workCases:     stored.workCases     ?? def.workCases,
        adminPassword: stored.adminPassword ?? def.adminPassword,
      };
    }
    // No row yet — seed with defaults
    const def = defaults();
    await saveCMS(def);
    return def;
  } catch (e) {
    console.error("[cms] loadCMS error:", e);
    return defaults();
  }
}

export async function saveCMS(content: CMSContent): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("cms_content")
      .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (e) {
    console.error("[cms] saveCMS error:", e);
  }
}

export async function resetCMS(): Promise<void> {
  await saveCMS(defaults());
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

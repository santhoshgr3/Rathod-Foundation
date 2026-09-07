// ============================================================================
//  Rathod Foundation — CMS data layer.
//  Content is stored across 11 separate Supabase tables (one per domain).
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
  categories as dReportCategories,
} from "../data/content";
import type { WorkCase } from "../data/content";
import { helpCategories as dHelpCategories, campaigns as dCampaigns } from "../data/help";

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

export type CMSHelpCategory = {
  id: string;
  icon: string;
  en: string;
  te: string;
  hi: string;
  descEn: string;
};

export type CMSCampaign = {
  id: string;
  title: string;
  date: string;
  area: string;
};

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
  activities: CMSPageHeader;
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
  helpCategories: CMSHelpCategory[];
  campaigns: CMSCampaign[];
  /** Issue types shown in the "Report an issue" form dropdown. */
  reportCategories: string[];
};

// ── Built-in gallery defaults ─────────────────────────────────────────────────
const DEFAULT_GALLERY: CMSGalleryPhoto[] = [
  { id: "hero-red",      src: "/img/namaste-red.jpeg",      caption: "R. Dhanraj Rathod at a community gathering",        tag: "leader" },
  { id: "hero-tricolor", src: "/img/namaste-tricolor.jpeg", caption: "R. Dhanraj Rathod — Independence Day event",         tag: "events" },
  { id: "candid",        src: "/img/candid.jpeg",           caption: "On the ground in Banjara Hills",                     tag: "events" },
  { id: "with-cm",       src: "/img/with-cm.jpeg",          caption: "Working hand-in-hand with officials and community",   tag: "events" },
  { id: "biodata",       src: "/img/biodata.jpeg",          caption: "R. Dhanraj Rathod — Official photograph",             tag: "leader" },
];

// ── Built-in timeline defaults ────────────────────────────────────────────────
const DEFAULT_TIMELINE: CMSTimelineEntry[] = [
  { id: "t1", year: "1976",    title: "Born in S.T. (Lambadi) community",         detail: "R. Dhanraj Rathod was born on 14 September 1976 in the Lambadi (Scheduled Tribe) community — a heritage that would define his lifelong commitment to tribal welfare.",                                                                                color: "saffron", icon: "🌱" },
  { id: "t2", year: "2000",    title: "City-wide community organiser — Hyderabad", detail: "Began coordinating ward-level grievance drives across the old city and Banjara Hills, building the grassroots networks that persist today.",                                                                                                           color: "green",   icon: "🤝" },
  { id: "t3", year: "2003",    title: "Ward grievance drives — 40+ localities",    detail: "Expanded reach to more than 40 localities, setting up weekly listening camps that became a model for civic responsiveness.",                                                                                                                            color: "saffron", icon: "📋" },
  { id: "t4", year: "2006",    title: "Citywide civic coordinator",                detail: "Scaled up rapid-response campaigns on water supply, roads and sanitation — first to introduce a same-week resolution commitment.",                                                                                                                       color: "green",   icon: "🏙️" },
  { id: "t5", year: "2012",    title: "Youth Welfare Association — President",     detail: "Founded and led the association to mobilise young volunteers for on-ground civic work, creating a pipeline of trained community responders.",                                                                                                           color: "saffron", icon: "🧑‍🤝‍🧑" },
  { id: "t6", year: "2020",    title: "COVID-19 community relief drive",           detail: "Organised food kits, medicine distribution and oxygen support for 500+ families across Banjara Hills during the pandemic peak.",                                                                                                                        color: "green",   icon: "🫁" },
  { id: "t7", year: "2024",    title: "Rathod Foundation — digital platform",      detail: "Launched Banjara Hills' first digital community support platform — online issue reporting with live tracking numbers and a 24-hour response promise.",                                                                                                  color: "saffron", icon: "💻" },
  { id: "t8", year: "Present", title: "Convenor — Community & Tribal Welfare",     detail: "Champions tribal and Lambadi welfare while running a 24-hour civic help desk, volunteer verification system and interactive public dashboard.",                                                                                                        color: "green",   icon: "🏆" },
];

// ── Defaults factory ──────────────────────────────────────────────────────────
export function defaults(): CMSContent {
  return {
    leader:   { ...dLeader, phones: [...dLeader.phones], languages: [...dLeader.languages], photos: { ...dLeader.photos } },
    bio: {
      intro:   dBio.intro,
      journey: dBio.journey.map((j) => ({ ...j })),
      values:  dBio.values.map((v) => ({ ...v })),
    },
    chairman: {
      name: dChairman.name, role: dChairman.role, affiliation: dChairman.affiliation,
      bio: dChairman.bio, highlights: [...dChairman.highlights], photo: "/img/chairman.jpeg",
    },
    home: {
      badge:        "24-hour response · Banjara Hills",
      heroTitle:    "Banjara Hills' First Digital Community Support Platform.",
      heroSubtitle: "Apply online, we reach your doorstep.",
      heroBody:     "Connecting needs with solutions across Banjara Hills.",
      visionText:   "No family should be left unheard. Rathod Foundation connects people in need with volunteers who verify concerns, guide beneficiaries, and help resolve issues with dignity and transparency.",
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
      activities:{ eyebrow: "Activities",         title: "On the ground, every week",           subtitle: "A live record of Dhanraj Rathod's work — resolved cases, community events, and upcoming campaigns across Banjara Hills." },
    },
    stats:         dStats.map((s) => ({ ...s })),
    steps:         dSteps.map((s) => ({ ...s })),
    promises:      [...dPromises],
    wards:         dWards.map((w) => ({ ...w })),
    gallery:        DEFAULT_GALLERY.map((p) => ({ ...p })),
    timeline:       DEFAULT_TIMELINE.map((t) => ({ ...t })),
    workCases:      dCases.map((c) => ({ ...c })),
    helpCategories: dHelpCategories.map((h) => ({ id: h.id, icon: h.icon, en: h.en, te: h.te, hi: h.hi, descEn: h.descEn })),
    campaigns:      dCampaigns.map((c) => ({ ...c })),
    reportCategories: [...dReportCategories],
  };
}

// ── Internal: diff helper ─────────────────────────────────────────────────────
function changed<T>(a: T, b: T): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

// Drop rows sharing an identity key, keeping the first. Guards the UI against a
// DB that accumulated duplicate rows (older seeds wrote null sort_order, which
// the delete-then-insert save path used to skip). The next admin save rewrites
// the table cleanly.
function dedupeBy<T>(rows: T[], key: (row: T) => string): T[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const k = key(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ── Internal: per-domain save functions ───────────────────────────────────────

async function saveSite(c: CMSContent): Promise<void> {
  const { error } = await supabase!.from("cms_site").upsert({
    id: 1,
    name: c.leader.name,
    short_name: c.leader.shortName,
    org: c.leader.org,
    role: c.leader.role,
    tagline: c.leader.tagline,
    dob: c.leader.dob,
    community: c.leader.community,
    location: c.leader.location,
    email: c.leader.email,
    whatsapp: c.leader.whatsapp,
    phones: c.leader.phones,
    languages: c.leader.languages,
    photos: c.leader.photos,
    site_url: c.leader.siteUrl,
    facebook: c.leader.facebook,
    instagram: c.leader.instagram,
    youtube: c.leader.youtube,
    twitter: c.leader.twitter,
    updated_at: new Date().toISOString(),
  });
  if (error) { console.error("[cms] saveSite:", error); throw error; }
}

async function saveHelpCategories(c: CMSContent): Promise<void> {
  await supabase!.from("cms_help_categories").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.helpCategories.length) return;
  const { error } = await supabase!.from("cms_help_categories").insert(
    c.helpCategories.map((h, i) => ({ id: h.id, icon: h.icon, en: h.en, te: h.te, hi: h.hi, desc_en: h.descEn, sort_order: i }))
  );
  if (error) { console.error("[cms] saveHelpCategories:", error); throw error; }
}

async function saveCampaigns(c: CMSContent): Promise<void> {
  await supabase!.from("cms_campaigns").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.campaigns.length) return;
  const { error } = await supabase!.from("cms_campaigns").insert(
    c.campaigns.map((cam, i) => ({ id: cam.id, title: cam.title, date: cam.date, area: cam.area, sort_order: i }))
  );
  if (error) { console.error("[cms] saveCampaigns:", error); throw error; }
}

async function saveReportCategories(c: CMSContent): Promise<void> {
  await supabase!.from("cms_report_categories").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.reportCategories.length) return;
  const { error } = await supabase!.from("cms_report_categories").insert(
    c.reportCategories.map((label, i) => ({ label, sort_order: i }))
  );
  if (error) { console.error("[cms] saveReportCategories:", error); throw error; }
}

async function saveHome(c: CMSContent): Promise<void> {
  const { error } = await supabase!.from("cms_home").upsert({
    id: 1,
    badge: c.home.badge,
    hero_title: c.home.heroTitle,
    hero_subtitle: c.home.heroSubtitle,
    hero_body: c.home.heroBody,
    vision_text: c.home.visionText,
    promises: c.promises,
    updated_at: new Date().toISOString(),
  });
  if (error) { console.error("[cms] saveHome:", error); throw error; }
}

async function savePages(c: CMSContent): Promise<void> {
  const rows = (Object.entries(c.pages) as [string, CMSPageHeader][]).map(
    ([page_key, h]) => ({
      page_key,
      eyebrow: h.eyebrow,
      title: h.title,
      subtitle: h.subtitle,
      updated_at: new Date().toISOString(),
    })
  );
  const { error } = await supabase!.from("cms_pages").upsert(rows);
  if (error) { console.error("[cms] savePages:", error); throw error; }
}

async function saveChairman(c: CMSContent): Promise<void> {
  const { error } = await supabase!.from("cms_chairman").upsert({
    id: 1,
    name: c.chairman.name,
    role: c.chairman.role,
    affiliation: c.chairman.affiliation,
    bio: c.chairman.bio,
    highlights: c.chairman.highlights,
    photo: c.chairman.photo,
    updated_at: new Date().toISOString(),
  });
  if (error) { console.error("[cms] saveChairman:", error); throw error; }
}

async function saveBio(c: CMSContent): Promise<void> {
  const { error } = await supabase!.from("cms_bio").upsert({
    id: 1,
    intro: c.bio.intro,
    journey: c.bio.journey,
    values: c.bio.values,
    updated_at: new Date().toISOString(),
  });
  if (error) { console.error("[cms] saveBio:", error); throw error; }
}

// For array tables: delete all existing rows then insert the full current set.
// The filter "sort_order >= 0 OR sort_order IS NULL" matches every row (Supabase
// requires a filter on delete) — including legacy rows written without a
// sort_order, which an earlier "gte 0" filter skipped and so left as duplicates.

async function saveGallery(c: CMSContent): Promise<void> {
  await supabase!.from("cms_gallery").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.gallery.length) return;
  const { error } = await supabase!.from("cms_gallery").insert(
    c.gallery.map((p, i) => ({ id: p.id, src: p.src, caption: p.caption, tag: p.tag, sort_order: i }))
  );
  if (error) { console.error("[cms] saveGallery:", error); throw error; }
}

async function saveTimeline(c: CMSContent): Promise<void> {
  await supabase!.from("cms_timeline").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.timeline.length) return;
  const { error } = await supabase!.from("cms_timeline").insert(
    c.timeline.map((t, i) => ({ id: t.id, year: t.year, title: t.title, detail: t.detail, color: t.color, icon: t.icon, sort_order: i }))
  );
  if (error) { console.error("[cms] saveTimeline:", error); throw error; }
}

async function saveWorkCases(c: CMSContent): Promise<void> {
  await supabase!.from("cms_work_cases").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.workCases.length) return;
  const { error } = await supabase!.from("cms_work_cases").insert(
    c.workCases.map((w, i) => ({
      id: w.id, title: w.title, date: w.date, location: w.location,
      category: w.category, days: w.days,
      before_media: w.before, after_media: w.after,
      summary: w.summary, sort_order: i,
    }))
  );
  if (error) { console.error("[cms] saveWorkCases:", error); throw error; }
}

async function saveStats(c: CMSContent): Promise<void> {
  await supabase!.from("cms_stats").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.stats.length) return;
  const { error } = await supabase!.from("cms_stats").insert(
    c.stats.map((s, i) => ({ value: s.value, suffix: s.suffix, label: s.label, sort_order: i }))
  );
  if (error) { console.error("[cms] saveStats:", error); throw error; }
}

async function saveWards(c: CMSContent): Promise<void> {
  await supabase!.from("cms_wards").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.wards.length) return;
  const { error } = await supabase!.from("cms_wards").insert(
    c.wards.map((w, i) => ({ name: w.name, count: w.count, sort_order: i }))
  );
  if (error) { console.error("[cms] saveWards:", error); throw error; }
}

async function saveSteps(c: CMSContent): Promise<void> {
  await supabase!.from("cms_steps").delete().or("sort_order.gte.0,sort_order.is.null");
  if (!c.steps.length) return;
  const { error } = await supabase!.from("cms_steps").insert(
    c.steps.map((s, i) => ({ n: s.n, title: s.title, text: s.text, sort_order: i }))
  );
  if (error) { console.error("[cms] saveSteps:", error); throw error; }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function loadCMS(): Promise<CMSContent> {
  if (!supabase) return defaults();
  try {
    const [
      { data: siteRow, error: siteError },
      { data: homeRow },
      { data: pageRows },
      { data: chairmanRow },
      { data: bioRow },
      { data: galleryRows },
      { data: timelineRows },
      { data: workRows },
      { data: statRows },
      { data: wardRows },
      { data: stepRows },
      { data: helpCatRows },
      { data: campaignRows },
      { data: reportCatRows },
    ] = await Promise.all([
      supabase.from("cms_site").select("*").eq("id", 1).maybeSingle(),
      supabase.from("cms_home").select("*").eq("id", 1).maybeSingle(),
      supabase.from("cms_pages").select("*"),
      supabase.from("cms_chairman").select("*").eq("id", 1).maybeSingle(),
      supabase.from("cms_bio").select("*").eq("id", 1).maybeSingle(),
      supabase.from("cms_gallery").select("*").order("sort_order"),
      supabase.from("cms_timeline").select("*").order("sort_order"),
      supabase.from("cms_work_cases").select("*").order("sort_order"),
      supabase.from("cms_stats").select("*").order("sort_order"),
      supabase.from("cms_wards").select("*").order("sort_order"),
      supabase.from("cms_steps").select("*").order("sort_order"),
      supabase.from("cms_help_categories").select("*").order("sort_order"),
      supabase.from("cms_campaigns").select("*").order("sort_order"),
      supabase.from("cms_report_categories").select("*").order("sort_order"),
    ]);

    // DB error (e.g. tables not created yet) — return defaults without seeding
    if (siteError) return defaults();

    // Tables exist but no row yet — first-time setup: seed everything
    if (!siteRow) {
      const def = defaults();
      await saveCMS(def);
      return def;
    }

    const def = defaults();

    return {
      leader: {
        name:      siteRow.name,
        shortName: siteRow.short_name,
        org:       siteRow.org,
        role:      siteRow.role,
        tagline:   siteRow.tagline,
        dob:       siteRow.dob,
        community: siteRow.community,
        location:  siteRow.location,
        email:     siteRow.email,
        whatsapp:  siteRow.whatsapp,
        phones:    (siteRow.phones as string[]) ?? [],
        languages: (siteRow.languages as string[]) ?? [],
        photos:    (siteRow.photos as CMSLeader["photos"]) ?? def.leader.photos,
        siteUrl:   (siteRow as Record<string, unknown>).site_url as string ?? def.leader.siteUrl,
        facebook:  (siteRow as Record<string, unknown>).facebook as string ?? "",
        instagram: (siteRow as Record<string, unknown>).instagram as string ?? "",
        youtube:   (siteRow as Record<string, unknown>).youtube as string ?? "",
        twitter:   (siteRow as Record<string, unknown>).twitter as string ?? "",
      },

      home: homeRow ? {
        badge:        homeRow.badge,
        heroTitle:    homeRow.hero_title,
        heroSubtitle: homeRow.hero_subtitle,
        heroBody:     homeRow.hero_body,
        visionText:   homeRow.vision_text,
      } : def.home,

      promises: (homeRow?.promises as string[]) ?? def.promises,

      pages: (() => {
        if (!pageRows?.length) return def.pages;
        const map = Object.fromEntries(
          (pageRows as { page_key: string; eyebrow: string; title: string; subtitle: string }[])
            .map((r) => [r.page_key, { eyebrow: r.eyebrow, title: r.title, subtitle: r.subtitle }])
        );
        return { ...def.pages, ...map } as CMSPages;
      })(),

      chairman: chairmanRow ? {
        name:        chairmanRow.name,
        role:        chairmanRow.role,
        affiliation: chairmanRow.affiliation,
        bio:         chairmanRow.bio,
        highlights:  (chairmanRow.highlights as string[]) ?? [],
        photo:       chairmanRow.photo,
      } : def.chairman,

      bio: bioRow ? {
        intro:   bioRow.intro,
        journey: (bioRow.journey as CMSBioEntry[]) ?? [],
        values:  (bioRow.values as CMSValue[]) ?? [],
      } : def.bio,

      gallery: galleryRows?.length
        ? dedupeBy(
            (galleryRows as { id: string; src: string; caption: string; tag: string }[]).map((r) => ({
              id: r.id, src: r.src, caption: r.caption, tag: r.tag as CMSGalleryPhoto["tag"],
            })),
            (p) => p.id,
          )
        : def.gallery,

      timeline: timelineRows?.length
        ? dedupeBy(
            (timelineRows as { id: string; year: string; title: string; detail: string; color: string; icon: string }[]).map((r) => ({
              id: r.id, year: r.year, title: r.title, detail: r.detail,
              color: r.color as CMSTimelineEntry["color"], icon: r.icon,
            })),
            (t) => t.id,
          )
        : def.timeline,

      workCases: workRows?.length
        ? dedupeBy(
            (workRows as { id: string; title: string; date: string; location: string; category: string; days: number; before_media: string; after_media: string; summary: string }[]).map((r) => ({
              id: r.id, title: r.title, date: r.date, location: r.location,
              category: r.category, days: r.days,
              before: r.before_media, after: r.after_media,
              summary: r.summary,
            })),
            (w) => w.id,
          )
        : def.workCases,

      stats: statRows?.length
        ? dedupeBy(
            (statRows as { value: number; suffix: string; label: string }[]).map((r) => ({
              value: r.value, suffix: r.suffix, label: r.label,
            })),
            (s) => s.label,
          )
        : def.stats,

      wards: wardRows?.length
        ? dedupeBy(
            (wardRows as { name: string; count: number }[]).map((r) => ({ name: r.name, count: r.count })),
            (w) => w.name,
          )
        : def.wards,

      steps: stepRows?.length
        ? dedupeBy(
            (stepRows as { n: string; title: string; text: string }[]).map((r) => ({ n: r.n, title: r.title, text: r.text })),
            (s) => s.n,
          )
        : def.steps,

      helpCategories: helpCatRows?.length
        ? dedupeBy(
            (helpCatRows as { id: string; icon: string; en: string; te: string; hi: string; desc_en: string }[]).map((r) => ({
              id: r.id, icon: r.icon, en: r.en, te: r.te, hi: r.hi, descEn: r.desc_en,
            })),
            (h) => h.id,
          )
        : def.helpCategories,

      campaigns: campaignRows?.length
        ? dedupeBy(
            (campaignRows as { id: string; title: string; date: string; area: string }[]).map((r) => ({
              id: r.id, title: r.title, date: r.date, area: r.area,
            })),
            (c) => c.id,
          )
        : def.campaigns,

      reportCategories: reportCatRows?.length
        ? dedupeBy((reportCatRows as { label: string }[]).map((r) => r.label), (l) => l)
        : def.reportCategories,
    };
  } catch (e) {
    console.error("[cms] loadCMS error:", e);
    return defaults();
  }
}

/**
 * Save CMS content to Supabase.
 * When `prev` is provided, only domains whose content changed are written.
 * When `prev` is omitted (first-time seed or reset), all domains are written.
 */
export async function saveCMS(next: CMSContent, prev?: CMSContent): Promise<void> {
  if (!supabase) return;
  try {
    const all = !prev;
    await Promise.all([
      (all || changed(next.leader, prev!.leader))
        ? saveSite(next) : Promise.resolve(),
      (all || changed(next.home, prev!.home) || changed(next.promises, prev!.promises))
        ? saveHome(next) : Promise.resolve(),
      (all || changed(next.pages, prev!.pages))
        ? savePages(next) : Promise.resolve(),
      (all || changed(next.chairman, prev!.chairman))
        ? saveChairman(next) : Promise.resolve(),
      (all || changed(next.bio, prev!.bio))
        ? saveBio(next) : Promise.resolve(),
      (all || changed(next.gallery, prev!.gallery))
        ? saveGallery(next) : Promise.resolve(),
      (all || changed(next.timeline, prev!.timeline))
        ? saveTimeline(next) : Promise.resolve(),
      (all || changed(next.workCases, prev!.workCases))
        ? saveWorkCases(next) : Promise.resolve(),
      (all || changed(next.stats, prev!.stats))
        ? saveStats(next) : Promise.resolve(),
      (all || changed(next.wards, prev!.wards))
        ? saveWards(next) : Promise.resolve(),
      (all || changed(next.steps, prev!.steps))
        ? saveSteps(next) : Promise.resolve(),
      (all || changed(next.helpCategories, prev!.helpCategories))
        ? saveHelpCategories(next) : Promise.resolve(),
      (all || changed(next.campaigns, prev!.campaigns))
        ? saveCampaigns(next) : Promise.resolve(),
      (all || changed(next.reportCategories, prev!.reportCategories))
        ? saveReportCategories(next) : Promise.resolve(),
    ]);
  } catch (e) {
    console.error("[cms] saveCMS error:", e);
    throw e; // let the caller (CMSContext) know the save actually failed
  }
}

export async function resetCMS(): Promise<void> {
  await saveCMS(defaults()); // no prev = overwrite all tables with defaults
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

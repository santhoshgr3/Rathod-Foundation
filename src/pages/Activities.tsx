import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Icon, Reveal } from "../components/ui";
import { useCMS } from "../contexts/CMSContext";

// ── Feed item model ───────────────────────────────────────────────────────────
type FeedItem =
  | { kind: "work"; id: string; title: string; date: string; location: string; category: string; days: number; summary: string; photo: string }
  | { kind: "event"; id: string; title: string; photo: string }
  | { kind: "campaign"; id: string; title: string; date: string; area: string };

type Filter = "all" | "work" | "event" | "campaign";

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: "all",      label: "Everything",  icon: "✦" },
  { key: "work",     label: "Work done",   icon: "🔨" },
  { key: "event",    label: "Events",      icon: "📸" },
  { key: "campaign", label: "Upcoming",    icon: "📣" },
];

export default function Activities() {
  const { cms: { pages, workCases, gallery, campaigns } } = useCMS();
  const p = pages.activities;
  const [filter, setFilter] = useState<Filter>("all");

  const items: FeedItem[] = useMemo(() => {
    const work: FeedItem[] = workCases.map((c) => ({
      kind: "work", id: c.id, title: c.title, date: c.date, location: c.location,
      category: c.category, days: c.days, summary: c.summary,
      photo: c.after && !c.after.startsWith("linear") ? c.after : "",
    }));
    const events: FeedItem[] = gallery
      .filter((g) => g.tag === "events")
      .map((g) => ({ kind: "event", id: g.id, title: g.caption, photo: g.src }));
    const camps: FeedItem[] = campaigns.map((c) => ({
      kind: "campaign", id: c.id, title: c.title, date: c.date, area: c.area,
    }));
    // Interleave: campaigns first (upcoming), then alternate work + events
    const feed: FeedItem[] = [...camps];
    const maxLen = Math.max(work.length, events.length);
    for (let i = 0; i < maxLen; i++) {
      if (work[i]) feed.push(work[i]);
      if (events[i]) feed.push(events[i]);
    }
    return feed;
  }, [workCases, gallery, campaigns]);

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  const counts = useMemo(() => ({
    work: items.filter((i) => i.kind === "work").length,
    event: items.filter((i) => i.kind === "event").length,
    campaign: items.filter((i) => i.kind === "campaign").length,
  }), [items]);

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

      {/* Summary ribbon */}
      <section className="bg-white pb-4">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal>
            <div className="grid grid-cols-3 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-line)" }}>
              <RibbonStat value={counts.work} label="Cases resolved" tint="saffron" />
              <RibbonStat value={counts.event} label="Community events" tint="ink" />
              <RibbonStat value={counts.campaign} label="Upcoming campaigns" tint="green" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filter chips */}
      <section className="bg-white sticky top-16 z-30 py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="mx-auto max-w-4xl px-5 sm:px-8 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all"
              style={filter === f.key
                ? { background: "var(--color-ink)", color: "#fff" }
                : { background: "#f4f5f7", color: "var(--color-muted)" }}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tricolor spine feed */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="relative">
            {/* the spine */}
            <div
              className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full"
              style={{ background: "linear-gradient(to bottom, var(--color-saffron), #fff 50%, var(--color-green))" }}
            />
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => (
                <motion.div
                  key={item.kind + item.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                  className={[
                    "relative pl-12 sm:pl-0 pb-8 sm:w-1/2",
                    i % 2 === 0 ? "sm:pr-10 sm:text-left" : "sm:ml-auto sm:pl-10",
                  ].join(" ")}
                >
                  {/* node dot */}
                  <span
                    className={[
                      "absolute top-6 w-4 h-4 rounded-full border-4 border-white shadow",
                      "left-2.5 sm:left-auto",
                      i % 2 === 0 ? "sm:-right-2" : "sm:-left-2",
                    ].join(" ")}
                    style={{ background: item.kind === "campaign" ? "var(--color-green)" : item.kind === "event" ? "var(--color-ink)" : "var(--color-saffron)" }}
                  />
                  <FeedCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
            {visible.length === 0 && (
              <div className="text-center py-16 text-sm" style={{ color: "var(--color-muted)" }}>
                Nothing here yet — check back soon.
              </div>
            )}
          </div>

          {/* CTA */}
          <Reveal>
            <div className="mt-6 rounded-3xl p-6 sm:p-8 text-center" style={{ background: "var(--color-saffron-tint)" }}>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl" style={{ color: "var(--color-ink)" }}>
                Want this kind of change in your street?
              </h3>
              <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--color-muted)" }}>
                Report a civic issue with a photo, or join as a volunteer — every activity above started with one message.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link to="/report" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white text-sm" style={{ background: "var(--color-saffron)" }}>
                  Report an issue <Icon.arrow className="w-4 h-4" />
                </Link>
                <Link to="/volunteer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm" style={{ border: "1.5px solid var(--color-green)", color: "var(--color-green-text)" }}>
                  Volunteer with us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function RibbonStat({ value, label, tint }: { value: number; label: string; tint: "saffron" | "green" | "ink" }) {
  const color = tint === "saffron" ? "var(--color-saffron-text)" : tint === "green" ? "var(--color-green-text)" : "var(--color-ink)";
  const bg = tint === "saffron" ? "var(--color-saffron-tint)" : tint === "green" ? "var(--color-green-tint)" : "#f4f5f7";
  return (
    <div className="text-center py-4 px-2" style={{ background: bg }}>
      <div className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color }}>{value}</div>
      <div className="text-[11px] sm:text-xs mt-0.5 leading-tight" style={{ color: "var(--color-muted)" }}>{label}</div>
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  if (item.kind === "campaign") {
    return (
      <div className="rounded-2xl p-5 border-2 border-dashed" style={{ borderColor: "var(--color-green)", background: "var(--color-green-tint)" }}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-green-text)" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full opacity-75" style={{ background: "var(--color-green)" }} />
            <span className="relative rounded-full h-2 w-2" style={{ background: "var(--color-green)" }} />
          </span>
          Upcoming campaign
        </div>
        <h3 className="font-display font-bold text-lg mt-2" style={{ color: "var(--color-ink)" }}>{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: "var(--color-muted)" }}>
          <span className="inline-flex items-center gap-1">📅 {item.date}</span>
          <span className="inline-flex items-center gap-1"><Icon.pin className="w-3.5 h-3.5" /> {item.area}</span>
        </div>
        <Link to="/volunteer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--color-green-text)" }}>
          Join this campaign <Icon.arrow className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (item.kind === "event") {
    return (
      <div className="rounded-2xl overflow-hidden card">
        {item.photo && !item.photo.startsWith("linear") ? (
          <img src={item.photo} alt={item.title} loading="lazy" className="w-full h-48 sm:h-52 object-cover" />
        ) : (
          <div className="w-full h-32 grid place-items-center text-xs" style={{ background: "#f4f5f7", color: "var(--color-muted)" }}>📷 Photo coming soon</div>
        )}
        <div className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>Community event</div>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--color-ink)" }}>{item.title}</p>
        </div>
      </div>
    );
  }

  // work case
  return (
    <div className="rounded-2xl p-5 card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>
          {item.category}
        </span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)" }}>
          ✓ Fixed in {item.days} {item.days === 1 ? "day" : "days"}
        </span>
      </div>
      <h3 className="font-display font-bold text-lg mt-2.5 leading-snug" style={{ color: "var(--color-ink)" }}>{item.title}</h3>
      <p className="text-sm mt-1.5" style={{ color: "var(--color-muted)" }}>{item.summary}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
        <span className="inline-flex items-center gap-1"><Icon.pin className="w-3.5 h-3.5" /> {item.location}</span>
        <span>📅 {item.date}</span>
      </div>
      <Link to="/work" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--color-saffron-text)" }}>
        See before & after <Icon.arrow className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

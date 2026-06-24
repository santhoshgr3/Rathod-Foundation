import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { CountUp, Icon, Reveal } from "../components/ui";
import { categoryLabel } from "../data/help";
import { useT } from "../lib/i18n";
import { getStats, listCases, STAGES, type Case, type Stats } from "../lib/store";
import { useCMS } from "../contexts/CMSContext";

const EMPTY_STATS: Stats = { received: 0, verified: 0, resolved: 0, volunteers: 0, wards: 0, byCategory: [] };

export default function Dashboard() {
  const { t, lang } = useT();
  const { cms: { pages } } = useCMS();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [recent, setRecent] = useState<Case[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, cases] = await Promise.all([getStats(), listCases()]);
      if (!alive) return;
      setStats(s);
      setRecent(cases.slice(0, 6));
    })();
    return () => { alive = false; };
  }, []);

  const maxCat = Math.max(...stats.byCategory.map((c) => c.count), 1);

  const cards = [
    { icon: Icon.doc, label: t("db.received"), value: stats.received, color: "saffron" },
    { icon: Icon.search, label: t("db.verified"), value: stats.verified, color: "green" },
    { icon: Icon.check, label: t("db.resolved"), value: stats.resolved, color: "green" },
    { icon: Icon.hand, label: t("db.volunteers"), value: stats.volunteers, color: "saffron" },
    { icon: Icon.pin, label: t("db.wards"), value: stats.wards, color: "saffron" },
  ];

  return (
    <>
      <PageHeader eyebrow={pages.dashboard.eyebrow} title={pages.dashboard.title} subtitle={pages.dashboard.subtitle} />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c, i) => {
              const green = c.color === "green";
              const I = c.icon;
              return (
                <Reveal key={c.label} delay={i * 0.06}>
                  <div className="rounded-2xl p-5 h-full card">
                    <div className="grid place-items-center w-11 h-11 rounded-xl mb-3" style={{ background: green ? "var(--color-green-tint)" : "var(--color-saffron-tint)", color: green ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                      <I className="w-6 h-6" />
                    </div>
                    <div className="font-display text-3xl font-extrabold" style={{ color: green ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                      <CountUp to={c.value} />
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{c.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_1fr] gap-6">
            {/* by category */}
            <Reveal>
              <div className="rounded-3xl p-6 card h-full">
                <h3 className="font-display font-bold text-lg mb-5">{t("db.byCategory")}</h3>
                <div className="space-y-3.5">
                  {stats.byCategory.map((c, i) => (
                    <div key={c.category} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3">
                      <span className="text-sm truncate">{categoryLabel(c.category, lang)}</span>
                      <div className="h-7 rounded-full overflow-hidden" style={{ background: "var(--color-saffron-tint)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: i % 2 ? "var(--color-green)" : "var(--color-saffron)" }} initial={{ width: 0 }} whileInView={{ width: `${(c.count / maxCat) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.05 }} />
                      </div>
                      <span className="text-right text-sm font-semibold tabular-nums">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* recent activity */}
            <Reveal delay={0.08}>
              <div className="rounded-3xl p-6 card h-full">
                <h3 className="font-display font-bold text-lg mb-5">Recent activity</h3>
                <ul className="space-y-3">
                  {recent.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid var(--color-line)" }}>
                      <span className="grid place-items-center w-9 h-9 rounded-lg shrink-0" style={{ background: c.stageIndex >= 4 ? "var(--color-green-tint)" : "var(--color-saffron-tint)", color: c.stageIndex >= 4 ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                        {c.stageIndex >= 4 ? <Icon.check className="w-4 h-4" /> : <Icon.clock className="w-4 h-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{c.type === "help" ? categoryLabel(c.category, lang) : c.category}</div>
                        <div className="text-xs" style={{ color: "var(--color-muted)" }}>{c.location} · {STAGES[c.stageIndex][lang]}</div>
                      </div>
                      <span className="text-xs font-mono shrink-0" style={{ color: "var(--color-muted)" }}>{c.id.slice(-4)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <p className="text-xs mt-6" style={{ color: "var(--color-muted)" }}>
            Figures include live submissions on this device plus the foundation's ongoing case log. Names are withheld for privacy.
          </p>
        </div>
      </section>
    </>
  );
}

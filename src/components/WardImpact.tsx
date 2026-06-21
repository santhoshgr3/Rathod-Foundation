import { motion } from "framer-motion";
import { useCMS } from "../contexts/CMSContext";
import { Reveal, SectionHead } from "./ui";

export default function WardImpact() {
  const { cms: { wards } } = useCMS();
  const max = Math.max(...wards.map((w) => w.count));
  const total = wards.reduce((s, w) => s + w.count, 0);

  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-end">
          <SectionHead
            eyebrow="Across Banjara Hills"
            title={<>Where the issues <span style={{ color: "var(--color-saffron-text)" }}>come from</span>.</>}
            intro="Each bar fills as you scroll — showing resolved cases by locality. The work follows the need, lane by lane."
          />
          <Reveal>
            <div className="text-right">
              <div className="font-display text-5xl font-extrabold" style={{ color: "var(--color-saffron-text)" }}>{total}</div>
              <div className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>cases resolved across {wards.length} localities</div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 space-y-5">
          {wards.map((w, i) => {
            const pct = Math.round((w.count / max) * 100);
            return (
              <div key={w.name} className="grid grid-cols-[8.5rem_1fr_3rem] sm:grid-cols-[12rem_1fr_4rem] items-center gap-3 sm:gap-5">
                <div className="text-sm font-medium truncate">{w.name}</div>
                <div className="relative h-9 rounded-full overflow-hidden" style={{ background: "var(--color-saffron-tint)" }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--color-saffron), #ffb347)" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1.1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="text-xs font-semibold text-white drop-shadow">Banjara Hills · {w.name}</span>
                  </div>
                </div>
                <div className="text-right font-display font-bold tabular-nums" style={{ color: "var(--color-green-text)" }}>{w.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

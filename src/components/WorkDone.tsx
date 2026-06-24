import { useRef, useState } from "react";
import { useCMS } from "../contexts/CMSContext";
import type { WorkCase } from "../data/content";
import { Icon, Reveal, SectionHead } from "./ui";

export default function WorkDone({ withHead = true }: { withHead?: boolean }) {
  const { cms: { workCases: cases } } = useCMS();
  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {withHead && (
          <SectionHead
            eyebrow="Work done"
            title={<>Before &amp; after, <span style={{ color: "var(--color-saffron-text)" }}>on the record</span>.</>}
            intro="Drag the slider on each card to see the change. Every case is dated, located in Banjara Hills, and resolved on the ground."
          />
        )}

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${withHead ? "mt-14" : ""}`}>
          {cases.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.08}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ c }: { c: WorkCase }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="group rounded-3xl overflow-hidden card transition-transform duration-300 hover:-translate-y-1.5">
      <div
        ref={ref}
        className="relative h-56 overflow-hidden cursor-ew-resize select-none touch-none"
        onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
        onMouseMove={(e) => dragging.current && update(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => update(e.touches[0].clientX)}
        onTouchMove={(e) => update(e.touches[0].clientX)}
      >
        <PlaceholderImg src={c.after} kind="after" category={c.category} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <PlaceholderImg src={c.before} kind="before" category={c.category} />
        </div>

        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md text-white" style={{ background: "rgba(0,0,0,0.55)" }}>Before</span>
        <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md text-white" style={{ background: "var(--color-green)" }}>After</span>

        <div className="absolute inset-y-0 pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-white" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-items-center shadow-lg bg-white" style={{ color: "var(--color-saffron-text)" }}>
            <Icon.arrow className="w-4 h-4" sw={2.4} />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)" }}>{c.category}</span>
          <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>Fixed in {c.days} days</span>
        </div>
        <h3 className="font-display font-bold text-lg leading-snug">{c.title}</h3>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--color-muted)" }}>{c.summary}</p>
        <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
          <span className="inline-flex items-center gap-1"><Icon.pin className="w-3.5 h-3.5" /> {c.location}</span>
          <span>{c.date}</span>
        </div>
      </div>
    </div>
  );
}

function PlaceholderImg({ src, kind, category }: { src: string; kind: "before" | "after"; category: string }) {
  const [failed, setFailed] = useState(false);
  const isDataUri = src.startsWith("data:");
  const resolvedSrc = isDataUri ? src : `/img/${src}`;
  const isVideo = src.startsWith("data:video") || /\.(mp4|webm|mov|avi)$/i.test(src);

  if (!failed) {
    if (isVideo) {
      return (
        <video
          src={resolvedSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      );
    }
    return (
      <img
        src={resolvedSrc}
        alt={`${kind} — ${category}`}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setFailed(true)}
        draggable={false}
      />
    );
  }
  const after = kind === "after";
  return (
    <div
      className="absolute inset-0 w-full h-full grid place-items-center"
      style={{ background: after ? "linear-gradient(150deg, #e9f6e7, #cfead0)" : "linear-gradient(150deg, #efe9e2, #ddd2c6)" }}
    >
      <div className="text-center px-4" style={{ color: after ? "var(--color-green-text)" : "#8a7b6a" }}>
        <div className="text-3xl mb-1">{after ? "✓" : "⚠"}</div>
        <div className="text-xs font-semibold uppercase tracking-wider">{after ? "After" : "Before"}</div>
        <div className="text-[10px] opacity-70 mt-1">{category} · add photo</div>
      </div>
    </div>
  );
}

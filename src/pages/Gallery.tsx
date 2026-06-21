import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import type { CMSGalleryPhoto } from "../lib/cms";

// Build before/after photo entries from CMS work cases
function buildBAPhotos(workCases: { id: string; title: string; location: string; before: string; after: string; days: number }[]): CMSGalleryPhoto[] {
  return workCases.flatMap((c) => [
    { id: `${c.id}-before`, src: `/img/${c.before}`, caption: `Before — ${c.title} (${c.location})`, tag: "work" as const },
    { id: `${c.id}-after`, src: `/img/${c.after}`, caption: `After — ${c.title} · Resolved in ${c.days} days`, tag: "work" as const },
  ]);
}

const TAG_LABELS: Record<string, string> = {
  leader: "Portrait",
  events: "Event",
  work: "Work",
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose, onPrev, onNext }: { photo: CMSGalleryPhoto; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const { t } = useT();
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.88)" }}
        onClick={onClose}
      >
        <motion.div
          key="box"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-semibold">
            {t("gallery.close")}
          </button>
          <img
            src={photo.src}
            alt={photo.caption}
            className="w-full max-h-[75vh] object-contain rounded-2xl"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const p = el.parentElement;
              if (p && !p.querySelector(".lb-ph")) {
                const d = document.createElement("div");
                d.className = "lb-ph flex items-center justify-center h-64 rounded-2xl text-white/40 text-sm";
                d.style.background = "rgba(255,255,255,0.07)";
                d.textContent = t("gallery.comingSoon");
                p.appendChild(d);
              }
            }}
          />
          <p className="mt-3 text-center text-white/80 text-sm">{photo.caption}</p>
          <button onClick={onPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 text-white/60 hover:text-white text-3xl font-bold">‹</button>
          <button onClick={onNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 text-white/60 hover:text-white text-3xl font-bold">›</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard({ photo, index, onClick }: { photo: CMSGalleryPhoto; index: number; onClick: () => void }) {
  const { t } = useT();
  const [imgOk, setImgOk] = useState(true);
  const accentColor = photo.tag === "leader" ? "var(--color-saffron)" : photo.tag === "work" ? "var(--color-green)" : "rgba(0,0,0,0.45)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer rounded-2xl overflow-hidden card"
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {imgOk ? (
          <img
            src={photo.src}
            alt={photo.caption}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-xs font-semibold" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>
            <span className="text-3xl">📷</span>
            <span>{t("gallery.comingSoon")}</span>
          </div>
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }}>
          <p className="text-white text-xs font-medium leading-snug">{photo.caption}</p>
        </div>
        <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>
          {TAG_LABELS[photo.tag] ?? photo.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: "var(--color-muted)" }}>{photo.caption}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useT();
  const { cms: { gallery, timeline, workCases } } = useCMS();
  const [activeTag, setActiveTag] = useState<string>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Merge gallery CMS photos + before/after from work cases
  const baPhotos = buildBAPhotos(workCases);
  const allPhotos: CMSGalleryPhoto[] = [...gallery, ...baPhotos];
  const filtered = activeTag === "all" ? allPhotos : allPhotos.filter((p) => p.tag === activeTag);

  const TABS = [
    { key: "all", label: t("gallery.allPhotos") },
    { key: "leader", label: t("gallery.leader") },
    { key: "events", label: t("gallery.events") },
    { key: "work", label: t("gallery.work") },
  ];

  const closeLB = () => setLightboxIdx(null);
  const prevLB = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const nextLB = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));

  return (
    <>
      <PageHeader
        eyebrow={t("nav.gallery")}
        title={t("gallery.pageTitle")}
        subtitle={t("gallery.pageSub")}
      />

      {/* Gallery */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTag(tab.key)}
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                style={activeTag === tab.key
                  ? { background: "var(--color-saffron)", color: "#fff", boxShadow: "0 2px 12px rgba(255,153,51,0.35)" }
                  : { background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}
              >
                {tab.label}
              </button>
            ))}
            <span className="ml-auto text-xs self-center font-medium" style={{ color: "var(--color-muted)" }}>
              {filtered.length} {t("gallery.allPhotos").toLowerCase()}
            </span>
          </div>

          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhotoCard photo={photo} index={i} onClick={() => setLightboxIdx(i)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center py-20 text-sm" style={{ color: "var(--color-muted)" }}>No photos in this category yet.</p>
          )}
        </div>
      </section>

      {lightboxIdx !== null && (
        <Lightbox photo={filtered[lightboxIdx]} onClose={closeLB} onPrev={prevLB} onNext={nextLB} />
      )}

      <div className="tricolor-rule mx-auto max-w-7xl" style={{ height: 4, borderRadius: 4 }} />

      {/* Timeline */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full" style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)" }}>
              {t("gallery.journey")}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl" style={{ color: "var(--color-ink)" }}>
              {t("gallery.timelineTitle").split("—")[0]}—{" "}
              <span style={{ color: "var(--color-saffron-text)" }}>{t("gallery.timelineTitle").split("—")[1]}</span>
            </h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: "var(--color-muted)" }}>{t("gallery.timelineSub")}</p>
          </motion.div>

          <div className="relative">
            {/* spine: left rail on mobile, centered on md+ */}
            <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5" style={{ background: "var(--color-line)" }} />
            <div className="space-y-7 md:space-y-10">
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                const accentColor = item.color === "saffron" ? "var(--color-saffron)" : "var(--color-green)";
                const accentText = item.color === "saffron" ? "var(--color-saffron-text)" : "var(--color-green-text)";
                const accentTint = item.color === "saffron" ? "var(--color-saffron-tint)" : "var(--color-green-tint)";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, delay: 0.05 }}
                    className={`relative flex items-start md:gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`w-full pl-14 md:pl-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:text-right md:pr-4" : "md:text-left md:pl-4"}`}>
                      <div className="relative overflow-hidden inline-block rounded-2xl p-5 card text-left w-full">
                        {/* accent bar — spine side: left on mobile, flips on md for left-column cards */}
                        <span className={`absolute inset-y-0 left-0 w-[3px] ${isLeft ? "md:left-auto md:right-0" : ""}`} style={{ background: accentColor }} />
                        <div className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: accentTint, color: accentText }}>{item.year}</div>
                        <h3 className="font-display font-bold text-base mb-1.5" style={{ color: "var(--color-ink)" }}>{item.title}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>{item.detail}</p>
                      </div>
                    </div>
                    <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full text-base z-10 shadow-md" style={{ background: accentColor, color: "#fff", top: "0.5rem" }}>
                      {item.icon}
                    </div>
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </motion.div>
                );
              })}
            </div>

            <div className="relative mt-10 h-12">
              <div className="absolute left-5 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10" style={{ background: "var(--color-green)" }}>★</div>
            </div>
            <p className="text-left pl-14 md:pl-0 md:text-center text-xs mt-3" style={{ color: "var(--color-green-text)" }}>{t("gallery.continues")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "var(--color-saffron-tint)", borderTop: "1.5px solid var(--color-saffron)" }}>
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl mb-4" style={{ color: "var(--color-saffron-text)" }}>{t("gallery.bePartTitle")}</h3>
          <p className="text-sm mb-7" style={{ color: "var(--color-muted)" }}>{t("gallery.bePartSub")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/volunteer" className="rounded-full px-6 py-3 font-semibold text-sm text-white transition-transform hover:scale-[1.03]" style={{ background: "var(--color-saffron)" }}>
              {t("nav.involved")} →
            </a>
            <a href="/report" className="rounded-full px-6 py-3 font-semibold text-sm transition-transform hover:scale-[1.03]" style={{ border: "1.5px solid var(--color-green)", color: "var(--color-green-text)", background: "var(--color-green-tint)" }}>
              {t("nav.report")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

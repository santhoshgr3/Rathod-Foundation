import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import PromiseStrip from "../components/PromiseStrip";
import { CountUp, Icon, Reveal, SectionHead, SpotlightCard } from "../components/ui";
import { helpCategories } from "../data/help";
import { useT } from "../lib/i18n";
import { getStats } from "../lib/store";

const vision = {
  en: "No family should be left unheard. Rathod Foundation connects people in need with volunteers who verify concerns, guide beneficiaries, and help resolve issues with dignity and transparency.",
  te: "ఏ కుటుంబం కూడా వినబడకుండా ఉండకూడదు. అవసరంలో ఉన్నవారిని వాలంటీర్లతో కలిపి, సమస్యలను ధృవీకరించి, గౌరవంగా, పారదర్శకంగా పరిష్కరించడమే రాథోడ్ ఫౌండేషన్ లక్ష్యం.",
  hi: "कोई भी परिवार अनसुना न रहे। राठोड फाउंडेशन ज़रूरतमंदों को वॉलंटियर्स से जोड़ता है जो समस्याओं को सत्यापित करते हैं और सम्मान व पारदर्शिता के साथ समाधान में मदद करते हैं।",
};

const exploreCards = [
  { to: "/seek-help", icon: Icon.hand, key: "nav.seekHelp", text: "Medical, pension, ration, schemes & more — get help in minutes.", green: false },
  { to: "/track", icon: Icon.search, key: "nav.track", text: "Follow your request through every verification stage.", green: true },
  { to: "/dashboard", icon: Icon.grid, key: "nav.dashboard", text: "See cases received, verified and resolved — live.", green: false },
  { to: "/volunteer", icon: Icon.users, key: "nav.involved", text: "Volunteer, suggest issues, or join a campaign.", green: true },
] as const;

export default function Home() {
  const { t, lang } = useT();
  const stats = getStats();

  return (
    <>
      <Hero />
      <PromiseStrip />

      {/* Vision */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <Reveal><span className="eyebrow" style={{ color: "var(--color-saffron-text)" }}>Our vision</span></Reveal>
          <Reveal delay={0.06}>
            <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-snug mt-4">
              <span style={{ color: "var(--color-saffron-text)" }}>“</span>
              {vision[lang]}
              <span style={{ color: "var(--color-saffron-text)" }}>”</span>
            </p>
          </Reveal>
          <Reveal delay={0.12}><div className="tricolor-rule w-28 mx-auto mt-7" /></Reveal>
        </div>
      </section>

      {/* What we help with */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead center eyebrow="Seek help" title={t("sh.choose")} intro="Pick what you need — a volunteer verifies it and guides you to a resolution." />
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {helpCategories.map((c, i) => {
              const I = (Icon as Record<string, (p: { className?: string }) => JSX.Element>)[c.icon] ?? Icon.hand;
              return (
                <Reveal key={c.id} delay={(i % 4) * 0.05}>
                  <SpotlightCard as={Link} to="/seek-help" glow={i % 2 ? "green" : "saffron"} className="group block rounded-2xl p-5 h-full card transition-transform hover:-translate-y-1">
                    <div className="grid place-items-center w-11 h-11 rounded-xl mb-3 transition-transform group-hover:scale-110 group-hover:-rotate-3" style={{ background: i % 2 ? "var(--color-green-tint)" : "var(--color-saffron-tint)", color: i % 2 ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                      <I className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-sm leading-snug">{c[lang]}</div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link to="/seek-help" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white" style={{ background: "var(--color-saffron)" }}>
              {t("nav.seekHelp")} <Icon.arrow className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live dashboard teaser */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-[2rem] p-8 sm:p-10" style={{ background: "var(--color-saffron-tint)", border: "1px solid color-mix(in srgb, var(--color-saffron) 25%, transparent)" }}>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <SectionHead eyebrow="Transparency" title={<>Our impact, in the open</>} />
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 font-semibold text-sm" style={{ color: "var(--color-saffron-text)" }}>Open dashboard <Icon.arrow className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { v: stats.received, l: t("db.received") },
                { v: stats.resolved, l: t("db.resolved") },
                { v: stats.volunteers, l: t("db.volunteers") },
                { v: stats.wards, l: t("db.wards") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl font-extrabold" style={{ color: "var(--color-saffron-text)" }}><CountUp to={s.v} /></div>
                  <div className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* explore */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exploreCards.map((c, i) => {
              const I = c.icon;
              return (
                <Reveal key={c.to} delay={i * 0.07}>
                  <SpotlightCard as={Link} to={c.to} glow={c.green ? "green" : "saffron"} className="group block rounded-3xl p-6 h-full card transition-transform hover:-translate-y-1.5">
                    <div className="grid place-items-center w-12 h-12 rounded-2xl mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-3" style={{ background: c.green ? "var(--color-green-tint)" : "var(--color-saffron-tint)", color: c.green ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                      <I className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg flex items-center gap-1.5">{t(c.key)}<Icon.arrow className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-60 group-hover:translate-x-0" /></h3>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--color-muted)" }}>{c.text}</p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-[2rem] px-7 sm:px-12 py-12 text-center" style={{ background: "var(--color-saffron)" }}>
            <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
            <div className="relative">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl" style={{ color: "#1b1b1b" }}>{t("em.title")}</h2>
              <p className="mt-3 max-w-xl mx-auto" style={{ color: "#3d1d00" }}>You don't need to know anyone or fill long forms. Tell us once — we take it from there.</p>
              <div className="mt-7 flex flex-wrap gap-3 justify-center">
                <Link to="/seek-help" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03]" style={{ background: "#1b1b1b" }}>
                  {t("nav.seekHelp")} <Icon.arrow className="w-4 h-4" />
                </Link>
                <Link to="/volunteer" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold" style={{ background: "#fff", color: "#1b1b1b" }}>
                  {t("nav.involved")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

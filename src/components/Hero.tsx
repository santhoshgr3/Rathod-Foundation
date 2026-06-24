import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import { CountUp, Icon, TiltCard } from "./ui";

export default function Hero() {
  const { cms: { leader, stats } } = useCMS();
  const { lang } = useT();
  return (
    <section className="relative overflow-hidden bg-white pt-24 sm:pt-28 pb-16">
      {/* animated mesh + soft saffron / green washes — background stays white */}
      <div className="mesh-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="aurora absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, var(--color-saffron), transparent 60%)" }} />
        <div className="aurora absolute -bottom-40 -left-24 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, var(--color-green), transparent 60%)", animationDelay: "-6s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-6 glass"
            style={{ color: "var(--color-saffron-text)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full opacity-75" style={{ background: "var(--color-saffron)" }} />
              <span className="relative rounded-full h-2 w-2" style={{ background: "var(--color-saffron)" }} />
            </span>
            24-hour response · Banjara Hills
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fluid-display font-display font-extrabold text-balance"
            style={{ color: "var(--color-ink)" }}
          >
            Banjara Hills’ First{" "}
            <span className="text-shimmer">Digital Community Support Platform.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-display font-bold text-xl sm:text-2xl max-w-xl leading-snug text-balance"
            style={{ color: "var(--color-ink)" }}
          >
            Apply online, we reach your <span style={{ color: "var(--color-green-text)" }}>doorstep</span>.
            <span className="block mt-2 text-base sm:text-lg font-medium" style={{ color: "var(--color-muted)" }}>
              Connecting needs with solutions across Banjara Hills.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/report" className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-transform hover:scale-[1.03] active:scale-95" style={{ background: "var(--color-saffron)", color: "#fff", boxShadow: "var(--elev-saffron)" }}>
              Report an issue
              <Icon.arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/work" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-all hover:scale-[1.03] active:scale-95 hover:bg-[color:var(--color-green-tint)]" style={{ border: "1.5px solid var(--color-green)", color: "var(--color-green-text)" }}>
              See the work
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Rathod Foundation — free community help in Banjara Hills. Report issues, get help, track your case: https://rathodfoundation.in")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-all hover:scale-[1.03] active:scale-95"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2C6.477 2 2 6.477 2 12.003c0 1.77.46 3.432 1.267 4.876L2 22l5.273-1.237A9.947 9.947 0 0 0 12.003 22C17.523 22 22 17.523 22 12.003S17.523 2 12.003 2zm0 18.117a8.1 8.1 0 0 1-4.136-1.13l-.296-.177-3.13.734.771-3.033-.193-.312A8.095 8.095 0 0 1 3.883 12c0-4.483 3.64-8.117 8.12-8.117 4.48 0 8.117 3.634 8.117 8.117 0 4.48-3.637 8.117-8.117 8.117z"/></svg>
              Share with neighbours
            </a>
          </motion.div>

          {/* Voice CTA — prominent for non-literate / elderly users */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="mt-4"
          >
            <Link
              to="/seek-help?mode=voice"
              className="inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-95"
              style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)", border: "1.5px solid var(--color-green)" }}
            >
              <span className="grid place-items-center w-9 h-9 rounded-xl shrink-0" style={{ background: "var(--color-green)", color: "#fff" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" />
                </svg>
              </span>
              <span>
                {lang === "te"
                  ? "🎤 మీ సమస్య చెప్పండి — typing అక్కరలేదు"
                  : lang === "hi"
                  ? "🎤 अपनी समस्या बोलें — टाइपिंग की ज़रूरत नहीं"
                  : "🎤 Speak your problem — no typing needed"}
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-extrabold" style={{ color: "var(--color-saffron-text)" }}>
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs mt-1 leading-tight" style={{ color: "var(--color-muted)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* portrait — 3D tilt with tricolor frame + floating trust chip (spatial) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <TiltCard className="relative" max={8}>
            <div className="absolute -top-4 left-6 right-6 h-3 rounded-t-2xl" style={{ background: "var(--color-saffron)" }} />
            <div className="absolute -bottom-4 left-6 right-6 h-3 rounded-b-2xl" style={{ background: "var(--color-green)" }} />
            <div className="relative rounded-[1.6rem] overflow-hidden card">
              <img src={leader.photos.heroPrimary} alt={leader.name} className="w-full h-[26rem] sm:h-[34rem] object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)" }}>
                <div className="font-display font-bold text-xl text-white">{leader.name}</div>
                <div className="text-sm text-white/85">{leader.role}</div>
              </div>
            </div>

            {/* floating spatial chip */}
            <div className="float-slow absolute -left-3 sm:-left-6 top-10 glass rounded-2xl px-3.5 py-2.5 shadow-lg" style={{ boxShadow: "var(--elev-2)" }}>
              <div className="flex items-center gap-2">
                <span className="grid place-items-center w-8 h-8 rounded-xl" style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)" }}>
                  <Icon.check className="w-4 h-4" sw={2.6} />
                </span>
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-sm" style={{ color: "var(--color-green-text)" }}>
                    <CountUp to={stats[0]?.value ?? 380} suffix={stats[0]?.suffix ?? "+"} />
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--color-muted)" }}>issues resolved</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

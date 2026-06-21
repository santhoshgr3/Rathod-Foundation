import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { CountUp, Icon, TiltCard } from "./ui";

export default function Hero() {
  const { cms: { leader, stats } } = useCMS();
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

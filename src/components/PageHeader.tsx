import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

/** Saffron page-identity band shown at the top of every inner page. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="relative pt-28 pb-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #ffb35c 0%, var(--color-saffron) 55%, #f5851f 100%)" }}>
      {/* subtle dotted texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* soft depth glows */}
      <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #ffffff, transparent 65%)" }} />
      <div className="absolute -bottom-24 left-10 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: "radial-gradient(circle, var(--color-green), transparent 65%)" }} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-semibold mb-4"
          style={{ color: "#7a3a00" }}
        >
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: "#3d1d00" }}>{eyebrow}</span>
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fluid-display font-display font-extrabold text-balance"
          style={{ color: "#1b1b1b" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: "#3d1d00" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {/* green base line of the tricolor */}
      <div className="absolute bottom-0 inset-x-0 h-1.5" style={{ background: "var(--color-green)" }} />
    </header>
  );
}

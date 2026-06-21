import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { Icon } from "./ui";

export default function Nav() {
  const { t } = useT();
  const { cms: { leader } } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/seek-help", label: t("nav.seekHelp") },
    { to: "/track", label: t("nav.track") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/volunteer", label: t("nav.involved") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/about", label: t("nav.about") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
        boxShadow: scrolled ? "0 6px 24px rgba(16,24,40,0.06)" : "none",
      }}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <span className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-sm" style={{ background: "var(--color-saffron)", color: "#fff" }}>RF</span>
          <span className="font-display font-bold tracking-tight leading-none" style={{ color: "var(--color-ink)" }}>{leader.org}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="px-3 py-2 rounded-full transition-colors whitespace-nowrap"
              style={({ isActive }) => ({
                color: isActive ? "var(--color-saffron-text)" : "var(--color-ink)",
                background: isActive ? "var(--color-saffron-tint)" : "transparent",
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* full switcher on large screens only — keeps the mobile bar uncluttered */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <NavLink to="/seek-help" className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: "var(--color-saffron)", color: "#fff", boxShadow: "var(--elev-saffron)" }}>
            {t("nav.seekHelp")}
          </NavLink>
          <button
            className="lg:hidden grid place-items-center w-10 h-10 rounded-xl transition-colors"
            style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.div animate={open ? "open" : "closed"} className="relative w-5 h-4">
              <motion.span className="absolute left-0 top-0 block w-5 h-0.5 bg-current rounded-full" variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }} transition={{ duration: 0.3 }} />
              <motion.span className="absolute left-0 top-[7px] block w-5 h-0.5 bg-current rounded-full" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} transition={{ duration: 0.2 }} />
              <motion.span className="absolute left-0 top-[14px] block w-5 h-0.5 bg-current rounded-full" variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }} transition={{ duration: 0.3 }} />
            </motion.div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t"
            style={{ borderColor: "var(--color-line)" }}
          >
            <div className="px-5 pb-5 pt-2 space-y-0.5">
              {[...links, { to: "/work", label: t("nav.work"), end: false }, { to: "/report", label: t("nav.report"), end: false }].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.035 }}
                >
                  <NavLink
                    to={l.to}
                    end={(l as { end?: boolean }).end}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 text-base font-semibold border-b"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--color-saffron-text)" : "var(--color-ink)",
                      borderColor: "var(--color-line)",
                    })}
                  >
                    {l.label}
                    <Icon.arrow className="w-4 h-4 opacity-40" />
                  </NavLink>
                </motion.div>
              ))}
              {/* language switcher lives inside the menu on mobile */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Language</span>
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="tricolor-rule" style={{ borderRadius: 0, height: 3 }} />
    </header>
  );
}

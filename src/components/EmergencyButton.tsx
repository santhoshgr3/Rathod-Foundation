import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import { Icon } from "./ui";

/** Floating emergency action button, present on every page. */
export default function EmergencyButton() {
  const { t } = useT();
  const { cms: { leader } } = useCMS();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 bottom-5 right-5 inline-flex items-center gap-2 rounded-full pl-4 pr-5 py-3 font-semibold shadow-xl"
        style={{ background: "#d92020", color: "#fff", boxShadow: "0 10px 30px rgba(217,32,32,0.45)" }}
        aria-label={t("em.button")}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <Icon.bell className="w-5 h-5" />
        <span className="hidden sm:inline">{t("em.button")}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-5"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-7 w-full max-w-sm text-center"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto grid place-items-center w-14 h-14 rounded-full mb-4" style={{ background: "#fdecec", color: "#d92020" }}>
                <Icon.bell className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-2xl">{t("em.title")}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>{t("em.sub")}</p>

              <div className="mt-6 space-y-3">
                <a href={`tel:${leader.phones[0].replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white" style={{ background: "#d92020" }}>
                  <Icon.phone className="w-5 h-5" /> {t("em.call")} · {leader.phones[0]}
                </a>
                <a href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent("EMERGENCY — I need urgent help in Banjara Hills.")}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white" style={{ background: "var(--color-green)" }}>
                  <Icon.chat className="w-5 h-5" /> {t("em.whatsapp")}
                </a>
                <Link to="/seek-help" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold" style={{ border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron-text)" }}>
                  <Icon.hand className="w-5 h-5" /> {t("nav.seekHelp")}
                </Link>
              </div>

              <button onClick={() => setOpen(false)} className="mt-5 text-sm font-medium" style={{ color: "var(--color-muted)" }}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

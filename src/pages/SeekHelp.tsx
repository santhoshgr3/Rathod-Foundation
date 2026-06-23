import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Icon, Reveal } from "../components/ui";
import { categoryLabel, helpCategories } from "../data/help";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import { createCase, STAGES, type Case } from "../lib/store";

export default function SeekHelp() {
  const { t, lang } = useT();
  const { cms: { leader } } = useCMS();
  const navigate = useNavigate();
  const [cat, setCat] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "", details: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [ticket, setTicket] = useState<Case | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json() as { display_name?: string; address?: { road?: string; suburb?: string; city?: string; state?: string } };
          const addr = data.address;
          const readable = [addr?.road, addr?.suburb, addr?.city].filter(Boolean).join(", ") || data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
          setForm((f) => ({ ...f, location: readable }));
        } catch {
          setForm((f) => ({ ...f, location: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` }));
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cat || submitting) return;
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errs.phone = true;
    if (!form.location.trim()) errs.location = true;
    if (!form.details.trim()) errs.details = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const c = await createCase({ type: "help", category: cat, name: form.name.trim(), phone: form.phone.trim(), location: form.location.trim(), details: form.details.trim(), lang });
      setTicket(c);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const copy = () => {
    if (!ticket) return;
    navigator.clipboard?.writeText(ticket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ---- success ----
  if (ticket) {
    return (
      <>
        <PageHeader eyebrow={t("nav.seekHelp")} title={t("sh.received")} />
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl p-7 sm:p-9 card text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="mx-auto grid place-items-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--color-green)", color: "#fff" }}>
                <Icon.check className="w-8 h-8" sw={2.6} />
              </motion.div>
              <h2 className="font-display font-extrabold text-2xl">{t("sh.received")}</h2>
              <p className="mt-2" style={{ color: "var(--color-muted)" }}>{t("sh.receivedMsg")}</p>

              <div className="mt-6 rounded-2xl p-5 inline-block" style={{ background: "var(--color-saffron-tint)", border: "1px dashed var(--color-saffron)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{t("sh.yourNumber")}</div>
                <div className="font-display font-extrabold text-2xl tracking-wide mt-1" style={{ color: "var(--color-saffron-text)" }}>{ticket.id}</div>
                <button onClick={copy} className="mt-3 text-sm font-semibold inline-flex items-center gap-1.5" style={{ color: "var(--color-green-text)" }}>
                  {copied ? <><Icon.check className="w-4 h-4" /> {t("sh.copied")}</> : t("sh.copy")}
                </button>
              </div>

              {/* what happens next — the verification workflow */}
              <div className="mt-7 text-left rounded-2xl p-5" style={{ background: "var(--color-green-tint)" }}>
                <div className="font-semibold mb-3">What happens next</div>
                <ol className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
                  {STAGES.map((s, i) => (
                    <li key={s.key} className="flex gap-2.5">
                      <span className="grid place-items-center w-5 h-5 rounded-full text-[11px] font-bold text-white shrink-0" style={{ background: i === 0 ? "var(--color-saffron)" : "var(--color-green)" }}>{i + 1}</span>
                      {s[lang]}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 justify-center">
                <button onClick={() => navigate(`/track?id=${ticket.id}`)} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm text-white" style={{ background: "var(--color-saffron)" }}>
                  <Icon.search className="w-4 h-4" /> {t("sh.trackNow")}
                </button>
                <a href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent(`Help request ${ticket.id}: ${categoryLabel(ticket.category, "en")} at ${ticket.location}. ${ticket.details}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm text-white" style={{ background: "var(--color-green)" }}>
                  <Icon.chat className="w-4 h-4" /> {t("sh.whatsapp")}
                </a>
                <button onClick={() => { setTicket(null); setCat(null); setForm({ name: "", phone: "", location: "", details: "" }); }} className="rounded-xl px-5 py-3 font-semibold text-sm" style={{ border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron-text)" }}>
                  {t("sh.another")}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // ---- category + form ----
  return (
    <>
      <PageHeader eyebrow={t("nav.seekHelp")} title={t("sh.choose")} subtitle={t("sh.chooseSub")} />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* category grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpCategories.map((c, i) => {
              const I = (Icon as Record<string, (p: { className?: string }) => JSX.Element>)[c.icon] ?? Icon.hand;
              const active = cat === c.id;
              return (
                <Reveal key={c.id} delay={(i % 4) * 0.05}>
                  <button
                    onClick={() => { setCat(c.id); document.getElementById("need-form")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                    className="w-full text-left rounded-2xl p-5 h-full transition-transform hover:-translate-y-1"
                    style={{
                      background: active ? "var(--color-saffron)" : "#fff",
                      border: active ? "1px solid var(--color-saffron)" : "1px solid var(--color-line)",
                      color: active ? "#fff" : "var(--color-ink)",
                      boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)",
                    }}
                  >
                    <div className="grid place-items-center w-11 h-11 rounded-xl mb-3" style={{ background: active ? "rgba(255,255,255,0.22)" : "var(--color-saffron-tint)", color: active ? "#fff" : "var(--color-saffron-text)" }}>
                      <I className="w-6 h-6" />
                    </div>
                    <div className="font-semibold leading-snug">{c[lang]}</div>
                    <div className="text-xs mt-1 leading-relaxed" style={{ color: active ? "rgba(255,255,255,0.85)" : "var(--color-muted)" }}>{c.descEn}</div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* form */}
          <div id="need-form" className="mt-12 max-w-2xl mx-auto">
            <AnimatePresence>
              {cat && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 sm:p-8 card">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: "var(--color-saffron-text)" }}>
                    <Icon.hand className="w-4 h-4" /> {categoryLabel(cat, lang)}
                  </div>
                  <h2 className="font-display font-bold text-xl">{t("sh.formTitle")}</h2>
                  <form onSubmit={submit} className="mt-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={t("f.name")} error={errors.name} hint={t("f.required")}>
                        <input className={inputCls(errors.name)} value={form.name} onChange={set("name")} />
                      </Field>
                      <Field label={t("f.phone")} error={errors.phone} hint={t("f.validPhone")}>
                        <input className={inputCls(errors.phone)} value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 9xxxxxxxxx" />
                      </Field>
                    </div>
                    <Field label={t("f.location")} error={errors.location} hint={t("f.required")}>
                      <div className="flex gap-2">
                        <input className={inputCls(errors.location) + " flex-1"} value={form.location} onChange={set("location")} placeholder="Road No. 12, Banjara Hills" />
                        <button
                          type="button"
                          onClick={getLocation}
                          disabled={locating}
                          title="Use my current location"
                          className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
                          style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)", border: "1px solid var(--color-green)" }}
                        >
                          {locating ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/><circle cx="12" cy="12" r="9" strokeOpacity=".3"/></svg>
                          )}
                          <span className="hidden sm:inline">{locating ? "Locating…" : "Use GPS"}</span>
                        </button>
                      </div>
                    </Field>
                    <Field label={t("f.details")} error={errors.details} hint={t("f.required")}>
                      <textarea rows={4} className={inputCls(errors.details) + " resize-none"} value={form.details} onChange={set("details")} />
                    </Field>

                    {/* Photo upload */}
                    <div>
                      <span className="text-sm font-semibold block mb-1.5">📷 {lang === "te" ? "ఫోటో జోడించండి" : lang === "hi" ? "फोटो जोड़ें" : "Add a photo"} <span className="font-normal text-xs" style={{ color: "var(--color-muted)" }}>({lang === "te" ? "ఐచ్ఛికం" : lang === "hi" ? "वैकल्पिक" : "optional"})</span></span>
                      {photo ? (
                        <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-line)" }}>
                          <img src={photo} alt="Uploaded" className="w-full max-h-48 object-cover" />
                          <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold">✕</button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer py-6 transition-colors hover:bg-[var(--color-saffron-tint)]" style={{ borderColor: "var(--color-line)" }}>
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-muted)" }}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                          <span className="text-sm font-semibold" style={{ color: "var(--color-muted)" }}>{lang === "te" ? "ఇక్కడ నొక్కి ఫోటో తీయండి" : lang === "hi" ? "यहाँ टैप करें और फ़ोटो लें" : "Tap to take a photo or upload"}</span>
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setPhoto(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      )}
                    </div>
                    <button type="submit" disabled={submitting} className="group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60" style={{ background: "var(--color-saffron)" }}>
                      {submitting ? "Submitting…" : t("sh.getNumber")}
                      {!submitting && <Icon.arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            {!cat && (
              <p className="text-center text-sm" style={{ color: "var(--color-muted)" }}>
                Already submitted? <Link to="/track" className="font-semibold" style={{ color: "var(--color-saffron-text)" }}>Track your application →</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && hint && <span className="text-xs text-red-600 mt-1 block">{hint}</span>}
    </label>
  );
}
function inputCls(error?: boolean) {
  return [
    "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-shadow bg-white",
    error ? "border-2 border-red-400" : "border border-[var(--color-line)]",
    "focus:border-[var(--color-saffron)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-saffron)_30%,transparent)]",
  ].join(" ");
}

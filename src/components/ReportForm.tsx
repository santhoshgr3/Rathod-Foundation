import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCMS } from "../contexts/CMSContext";
import { categories } from "../data/content";
import { Icon, Reveal, SectionHead } from "./ui";
import { createCase, getCase, STAGES, type Case } from "../lib/store";

export default function ReportForm() {
  const { cms: { leader } } = useCMS();
  const [form, setForm] = useState({ name: "", phone: "", category: categories[0], location: "", details: "" });
  const [ticket, setTicket] = useState<Case | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<Case | "none" | null>(null);
  const [looking, setLooking] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errs.phone = true;
    if (!form.location.trim()) errs.location = true;
    if (!form.details.trim()) errs.details = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const c = await createCase({
        type: "civic",
        category: form.category,
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        details: form.details.trim(),
        lang: "en",
      });
      setTicket(c);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ name: "", phone: "", category: categories[0], location: "", details: "" });
    setTicket(null);
    setCopied(false);
    setErrors({});
  };

  const copyId = () => {
    if (!ticket) return;
    navigator.clipboard?.writeText(ticket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const runLookup = async () => {
    const id = lookupId.trim().toUpperCase();
    if (!id) return;
    setLooking(true);
    try {
      const c = await getCase(id);
      setLookupResult(c ?? "none");
    } finally {
      setLooking(false);
    }
  };

  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Report an issue"
          title={<>Tell us what's wrong. <span style={{ color: "var(--color-green-text)" }}>Get a tracking number.</span></>}
          intro="Fill this in and you'll instantly receive a reference ID you can use to follow your case."
        />

        <div className="mt-12 grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
          <Reveal>
            <div className="rounded-3xl p-6 sm:p-8 card">
              <AnimatePresence mode="wait">
                {!ticket ? (
                  <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Your name" error={errors.name}>
                        <input className={inputCls(errors.name)} value={form.name} onChange={set("name")} placeholder="e.g. Anitha R." />
                      </Field>
                      <Field label="Phone / WhatsApp" error={errors.phone} hint={errors.phone ? "Enter a valid number" : undefined}>
                        <input className={inputCls(errors.phone)} value={form.phone} onChange={set("phone")} placeholder="+91 9xxxxxxxxx" inputMode="tel" />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Type of issue">
                        <select className={inputCls(false)} value={form.category} onChange={set("category")}>
                          {categories.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Location in Banjara Hills" error={errors.location}>
                        <input className={inputCls(errors.location)} value={form.location} onChange={set("location")} placeholder="e.g. Road No. 12, near park" />
                      </Field>
                    </div>
                    <Field label="What's the problem?" error={errors.details}>
                      <textarea rows={4} className={inputCls(errors.details) + " resize-none"} value={form.details} onChange={set("details")} placeholder="Describe the issue, how long it's been there, and who it affects." />
                    </Field>
                    <button type="submit" disabled={submitting} className="group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60" style={{ background: "var(--color-saffron)", color: "#fff" }}>
                      {submitting ? "Submitting…" : <>Submit &amp; get tracking number <Icon.arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>}
                    </button>
                    <p className="text-xs text-center" style={{ color: "var(--color-muted)" }}>By submitting you agree to be contacted about this issue.</p>
                  </motion.form>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="mx-auto grid place-items-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--color-green)", color: "#fff" }}>
                      <Icon.check className="w-8 h-8" sw={2.6} />
                    </motion.div>
                    <h3 className="font-display font-extrabold text-2xl">Report received</h3>
                    <p className="mt-2 max-w-md mx-auto" style={{ color: "var(--color-muted)" }}>Thank you, {ticket.name.split(" ")[0]}. Your issue is logged and a volunteer will be assigned within 24 hours.</p>

                    <div className="mt-6 rounded-2xl p-5 inline-block" style={{ background: "var(--color-saffron-tint)", border: "1px dashed var(--color-saffron)" }}>
                      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Your tracking number</div>
                      <div className="font-display font-extrabold text-2xl tracking-wide mt-1" style={{ color: "var(--color-saffron-text)" }}>{ticket.id}</div>
                      <button onClick={copyId} className="mt-3 text-sm font-semibold inline-flex items-center gap-1.5" style={{ color: "var(--color-green-text)" }}>
                        {copied ? <><Icon.check className="w-4 h-4" /> Copied</> : "Copy number"}
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-sm">
                      <Summary k="Issue" v={ticket.category} />
                      <Summary k="Status" v={STAGES[ticket.stageIndex]?.en ?? "Received"} />
                      <Summary k="Location" v={ticket.location} />
                      <Summary k="Logged" v={new Date(ticket.createdAt).toLocaleString()} />
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3 justify-center">
                      <a href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent(`Tracking ${ticket.id}: ${ticket.category} at ${ticket.location}, Banjara Hills. ${ticket.details}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm" style={{ background: "var(--color-green)", color: "#fff" }}>
                        <Icon.chat className="w-4 h-4" /> Send on WhatsApp too
                      </a>
                      <button onClick={reset} className="rounded-xl px-5 py-3 font-semibold text-sm" style={{ border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron-text)" }}>
                        Report another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5">
              <div className="rounded-3xl p-6" style={{ background: "var(--color-saffron-tint)", border: "1px solid color-mix(in srgb, var(--color-saffron) 30%, transparent)" }}>
                <h3 className="font-display font-bold text-lg">Track an existing report</h3>
                <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>Enter a tracking number you received earlier.</p>
                <div className="mt-4 flex gap-2">
                  <input
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runLookup()}
                    placeholder="RF-2026-...."
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                    style={{ border: "1px solid var(--color-line)" }}
                  />
                  <button onClick={runLookup} disabled={looking} className="rounded-xl px-4 font-semibold text-sm disabled:opacity-60" style={{ background: "var(--color-saffron)", color: "#fff" }}>
                    {looking ? "…" : "Track"}
                  </button>
                </div>
                {lookupResult && lookupResult !== "none" && (
                  <div className="mt-4 rounded-xl p-4 text-sm bg-white" style={{ border: "1px solid var(--color-line)" }}>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-green-text)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-green)" }} />
                      {STAGES[lookupResult.stageIndex]?.en ?? "Received"}
                    </div>
                    <div className="font-semibold mt-1">{lookupResult.category}</div>
                    <div style={{ color: "var(--color-muted)" }}>{lookupResult.location} · logged {new Date(lookupResult.createdAt).toLocaleDateString()}</div>
                  </div>
                )}
                {lookupResult === "none" && <div className="mt-4 text-sm" style={{ color: "var(--color-muted)" }}>No report found for that number.</div>}
              </div>

              <div className="rounded-3xl p-6 card">
                <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--color-green-text)" }}>
                  <Icon.shield className="w-5 h-5" /> Our promise to you
                </div>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {["First response within 24 hours", "A real person assigned to your case", "Updates by call or WhatsApp", "Added to the public work log once fixed"].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Icon.check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-green-text)" }} />
                      <span style={{ color: "var(--color-muted)" }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{label}</span>
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

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--color-green-tint)" }}>
      <div className="text-xs" style={{ color: "var(--color-muted)" }}>{k}</div>
      <div className="font-medium truncate">{v}</div>
    </div>
  );
}

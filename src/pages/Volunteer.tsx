import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Icon, Reveal } from "../components/ui";
import { campaigns } from "../data/help";
import { useT } from "../lib/i18n";
import { saveSuggestion, saveVolunteer } from "../lib/store";

export default function Volunteer() {
  const { t } = useT();
  return (
    <>
      <PageHeader eyebrow={t("nav.involved")} title="Be the change in your ward" subtitle="The foundation runs on neighbours helping neighbours. Join as a volunteer, flag an issue, or take part in a campaign." />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <Reveal><VolunteerForm /></Reveal>

          <div className="space-y-6">
            <Reveal delay={0.06}><SuggestForm /></Reveal>
            <Reveal delay={0.12}><Campaigns /></Reveal>
            <Reveal delay={0.18}>
              <div className="rounded-3xl p-6" style={{ background: "var(--color-green-tint)" }}>
                <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--color-green-text)" }}>
                  <Icon.pin className="w-5 h-5" /> Report a civic problem
                </div>
                <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>Pothole, garbage, broken light or drain? Log it with a photo and get a tracking number.</p>
                <Link to="/report" className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-sm text-white" style={{ background: "var(--color-green)" }}>
                  {t("nav.report")} <Icon.arrow className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function VolunteerForm() {
  const [form, setForm] = useState({ name: "", phone: "", area: "", skills: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errs.phone = true;
    if (!form.area.trim()) errs.area = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    saveVolunteer({ name: form.name.trim(), phone: form.phone.trim(), area: form.area.trim(), skills: form.skills.trim() });
    setDone(true);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl p-8 card text-center">
        <div className="mx-auto grid place-items-center w-14 h-14 rounded-full mb-4" style={{ background: "var(--color-green)", color: "#fff" }}><Icon.check className="w-7 h-7" sw={2.6} /></div>
        <h2 className="font-display font-extrabold text-2xl">Welcome to the team!</h2>
        <p className="mt-2" style={{ color: "var(--color-muted)" }}>Thank you, {form.name.split(" ")[0]}. A coordinator from your area will call you to get started.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", phone: "", area: "", skills: "" }); }} className="mt-5 text-sm font-semibold" style={{ color: "var(--color-saffron-text)" }}>Register another volunteer</button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 card">
      <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: "var(--color-saffron-text)" }}><Icon.hand className="w-4 h-4" /> Become a volunteer</div>
      <h2 className="font-display font-bold text-xl">Give a few hours where it counts</h2>
      <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>Volunteers verify requests on the ground, guide families, and run camps. No experience needed — just your neighbourhood and some time.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your name" error={errors.name}><input className={inputCls(errors.name)} value={form.name} onChange={set("name")} /></Field>
          <Field label="Phone / WhatsApp" error={errors.phone} hint="Enter a valid number"><input className={inputCls(errors.phone)} value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 9xxxxxxxxx" /></Field>
        </div>
        <Field label="Your area / ward" error={errors.area}><input className={inputCls(errors.area)} value={form.area} onChange={set("area")} placeholder="e.g. Road No. 12, Banjara Hills" /></Field>
        <Field label="How would you like to help? (optional)"><textarea rows={3} className={inputCls(false) + " resize-none"} value={form.skills} onChange={set("skills")} placeholder="e.g. field visits, paperwork help, medical, teaching, driving…" /></Field>
        <button type="submit" className="group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.01]" style={{ background: "var(--color-saffron)" }}>
          Join as a volunteer <Icon.arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
}

function SuggestForm() {
  const [text, setText] = useState("");
  const [area, setArea] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    saveSuggestion({ kind: "issue", text: text.trim(), area: area.trim() });
    setDone(true);
    setText(""); setArea("");
    setTimeout(() => setDone(false), 2600);
  };
  return (
    <div className="rounded-3xl p-6 card">
      <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--color-saffron-text)" }}><Icon.megaphone className="w-5 h-5" /> Suggest a community issue</div>
      <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>See something that affects many families? Tell us where to look next.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area (optional)" className={inputCls(false)} />
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="What should the foundation look into?" className={inputCls(false) + " resize-none"} />
        <button type="submit" className="rounded-xl px-5 py-2.5 font-semibold text-sm text-white w-full" style={{ background: "var(--color-saffron)" }}>{done ? "Thank you! ✓" : "Send suggestion"}</button>
      </form>
    </div>
  );
}

function Campaigns() {
  return (
    <div className="rounded-3xl p-6 card">
      <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--color-green-text)" }}><Icon.users className="w-5 h-5" /> Join an awareness campaign</div>
      <ul className="mt-4 space-y-3">
        {campaigns.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 pb-3" style={{ borderBottom: "1px solid var(--color-line)" }}>
            <div>
              <div className="font-medium text-sm">{c.title}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{c.date} · {c.area}</div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background: "var(--color-green-tint)", color: "var(--color-green-text)" }}>Open</span>
          </li>
        ))}
      </ul>
    </div>
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

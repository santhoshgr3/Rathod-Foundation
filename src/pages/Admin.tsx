import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { uid, type CMSGalleryPhoto, type CMSTimelineEntry, type CMSWard, type CMSStat, type CMSWorkCase, type CMSChairman, type CMSStep, type CMSPageHeader, type CMSHome, type CMSHelpCategory, type CMSCampaign } from "../lib/cms";
import { listCases, listVolunteers, updateCaseStage, STAGES, type Case as CaseT, type Volunteer as VolunteerT } from "../lib/store";

// ── Auth gate ─────────────────────────────────────────────────────────────────
function LoginGate({ password, onLogin }: { password: string; onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === password) { onLogin(); setErr(false); }
    else { setErr(true); setPw(""); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f8f7f5" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 text-white relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: "var(--color-saffron)" }} />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-10" style={{ background: "var(--color-green)" }} />
        {/* Tricolor stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1" style={{ background: "var(--color-saffron)" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: "var(--color-green)" }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="grid place-items-center w-11 h-11 rounded-2xl font-display font-extrabold text-lg text-white" style={{ background: "var(--color-saffron)" }}>RF</div>
            <div>
              <div className="font-display font-bold text-base leading-tight">Rathod Foundation</div>
              <div className="text-xs opacity-60">Banjara Hills, Hyderabad</div>
            </div>
          </div>
          <h2 className="font-display font-extrabold text-3xl leading-tight mb-4">Content<br />Management<br />System</h2>
          <p className="text-sm opacity-70 leading-relaxed max-w-xs">Manage all website content, gallery photos, work cases, ward data, and incoming civic requests from one place.</p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { icon: "📊", text: "Live case dashboard" },
            { icon: "🖼️", text: "Gallery & timeline editor" },
            { icon: "🗺️", text: "Ward impact data" },
            { icon: "⚙️", text: "Full site content control" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 text-sm opacity-80">
              <span className="text-base">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="grid place-items-center w-12 h-12 rounded-2xl font-display font-extrabold text-lg text-white" style={{ background: "var(--color-saffron)" }}>RF</div>
          <div>
            <div className="font-display font-bold text-base leading-tight" style={{ color: "var(--color-ink)" }}>Rathod Foundation</div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>Admin Panel</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: "var(--color-ink)" }}>Welcome back</h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>Sign in to manage your website content</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-ink)" }}>Admin Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setErr(false); }}
                  placeholder="Enter your password"
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none pr-12 transition-all"
                  style={{
                    border: `2px solid ${err ? "#ef4444" : pw ? "var(--color-saffron)" : "var(--color-line)"}`,
                    background: "#fff",
                    boxShadow: err ? "0 0 0 3px rgba(239,68,68,0.1)" : pw ? "0 0 0 3px rgba(255,153,51,0.12)" : "none",
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-lg"
                  style={{ color: "var(--color-muted)" }}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {err && (
                <p className="mt-2 text-xs font-medium flex items-center gap-1.5 text-red-600">
                  <span>⚠️</span> Incorrect password — please try again
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3.5 font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "var(--color-saffron)", boxShadow: "0 4px 14px rgba(255,153,51,0.35)" }}
            >
              Sign in to Admin Panel →
            </button>
          </form>

          <p className="text-xs text-center mt-8" style={{ color: "var(--color-muted)" }}>
            <Link to="/" className="font-medium hover:underline" style={{ color: "var(--color-saffron-text)" }}>← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1" style={{ color: "var(--color-muted)" }}>{label}</span>
      {children}
    </label>
  );
}

const inp = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[--color-saffron] focus:ring-2 focus:ring-orange-100 transition-colors";
const btn = (variant: "saffron" | "green" | "red" | "ghost" = "saffron") => {
  const styles = {
    saffron: "bg-[--color-saffron] text-white shadow-sm",
    green: "bg-[--color-green] text-white shadow-sm",
    red: "bg-red-600 text-white shadow-sm",
    ghost: "border bg-white text-[--color-ink]",
  };
  return `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-85 active:scale-95 ${styles[variant]}`;
};

function SaveBanner({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg" style={{ background: "var(--color-green)" }}>
      ✓ Saved successfully
    </div>
  );
}

function SaveErrorBanner() {
  const { saveError, clearSaveError } = useCMS();
  if (!saveError) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl" style={{ background: "#d92020", maxWidth: "90vw" }}>
      ⚠️ {saveError}
      <button onClick={clearSaveError} className="ml-2 text-white/70 hover:text-white text-lg leading-none">×</button>
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [cases, setCases] = useState<CaseT[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerT[]>([]);
  const [loading, setLoading] = useState(true);
  const { cms } = useCMS();

  useEffect(() => {
    let alive = true;
    Promise.all([listCases(), listVolunteers()]).then(([c, v]) => {
      if (!alive) return;
      setCases(c);
      setVolunteers(v);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const resolved = cases.filter((c) => c.stageIndex >= 4).length;
  const pending = cases.filter((c) => c.stageIndex < 4).length;
  const resolutionRate = cases.length ? Math.round((resolved / cases.length) * 100) : 0;
  const recent = cases.slice(0, 5);

  const STAGE_COLORS = ["#f97316","#eab308","#3b82f6","#8b5cf6","#22c55e","#10b981"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-extrabold" style={{ color: "var(--color-ink)" }}>Dashboard Overview</h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          Welcome back — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total cases", value: loading ? "—" : cases.length, icon: "📬", color: "var(--color-saffron)", bg: "var(--color-saffron-tint)", text: "var(--color-saffron-text)" },
          { label: "Resolved", value: loading ? "—" : resolved, icon: "✅", color: "var(--color-green)", bg: "var(--color-green-tint)", text: "var(--color-green-text)" },
          { label: "Pending", value: loading ? "—" : pending, icon: "⏳", color: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
          { label: "Volunteers", value: loading ? "—" : volunteers.length, icon: "🙋", color: "#6366f1", bg: "#eef2ff", text: "#3730a3" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl p-5 bg-white border" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="grid place-items-center w-10 h-10 rounded-xl text-lg" style={{ background: c.bg }}>{c.icon}</div>
            </div>
            <div className="text-3xl font-display font-extrabold leading-none" style={{ color: c.text }}>{c.value}</div>
            <div className="text-xs font-semibold mt-1.5" style={{ color: "var(--color-muted)" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Resolution rate + recent activity */}
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">

        {/* Resolution rate card */}
        <div className="rounded-2xl p-6 bg-white border space-y-5" style={{ borderColor: "var(--color-line)" }}>
          <h3 className="font-display font-bold text-base" style={{ color: "var(--color-ink)" }}>Resolution Rate</h3>
          <div className="flex items-end gap-3">
            <div className="text-5xl font-display font-extrabold" style={{ color: resolutionRate >= 70 ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>{resolutionRate}%</div>
            <div className="text-sm mb-1.5" style={{ color: "var(--color-muted)" }}>cases resolved</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold" style={{ color: "var(--color-muted)" }}>
              <span>0%</span><span>100%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--color-line)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${resolutionRate}%`, background: resolutionRate >= 70 ? "var(--color-green)" : "var(--color-saffron)" }}
              />
            </div>
          </div>
          {/* Stage breakdown */}
          {!loading && cases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-muted)" }}>By stage</p>
              {STAGES.map((s, i) => {
                const count = cases.filter((c) => c.stageIndex === i).length;
                const pct = cases.length ? Math.round((count / cases.length) * 100) : 0;
                return (
                  <div key={s.key} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STAGE_COLORS[i] ?? "#999" }} />
                    <span className="flex-1 truncate" style={{ color: "var(--color-muted)" }}>{s.en}</span>
                    <span className="font-bold w-6 text-right" style={{ color: "var(--color-ink)" }}>{count}</span>
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-line)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: STAGE_COLORS[i] ?? "#999" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent cases */}
        <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: "var(--color-line)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-base" style={{ color: "var(--color-ink)" }}>Recent Submissions</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>Last 5</span>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
            ))}</div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--color-muted)" }}>No submissions yet</p>
          ) : (
            <div className="space-y-2">
              {recent.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.stageIndex >= 4 ? "var(--color-green)" : "var(--color-saffron)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--color-ink)" }}>{c.name || "Anonymous"}</div>
                    <div className="text-xs truncate" style={{ color: "var(--color-muted)" }}>{c.category} · {c.location}</div>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-lg shrink-0" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>#{c.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="font-display font-bold text-sm mb-4" style={{ color: "var(--color-muted)" }}>QUICK ACTIONS</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: "🏠", label: "Edit Home Page", tab: "home" },
            { icon: "🖼️", label: "Manage Gallery", tab: "gallery" },
            { icon: "🔨", label: "Work Cases", tab: "works" },
            { icon: "📬", label: "View Submissions", tab: "submissions" },
            { icon: "🗺️", label: "Ward Data", tab: "wards" },
            { icon: "⚙️", label: "Site Settings", tab: "site" },
          ].map((q) => (
            <button
              key={q.tab}
              onClick={() => {
                const e = new CustomEvent("rf-admin-tab", { detail: q.tab });
                window.dispatchEvent(e);
              }}
              className="flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all hover:scale-[1.03] active:scale-95 bg-white border"
              style={{ borderColor: "var(--color-line)" }}
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Site stats from CMS */}
      <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: "var(--color-line)" }}>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: "var(--color-ink)" }}>Public Site Stats (CMS)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cms.stats.map((s, i) => (
            <div key={i} className="text-center p-3 rounded-xl" style={{ background: "var(--color-saffron-tint)" }}>
              <div className="font-display font-extrabold text-2xl" style={{ color: "var(--color-saffron-text)" }}>{s.value}{s.suffix}</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--color-muted)" }}>Edit these numbers in Stats & Ticker tab.</p>
      </div>
    </div>
  );
}

// ── Tab: Site Info ────────────────────────────────────────────────────────────
function SiteInfoTab() {
  const { cms, updateCMS } = useCMS();
  const [local, setLocal] = useState(() => ({
    name: cms.leader.name,
    shortName: cms.leader.shortName,
    org: cms.leader.org,
    role: cms.leader.role,
    tagline: cms.leader.tagline,
    dob: cms.leader.dob,
    community: cms.leader.community,
    location: cms.leader.location,
    email: cms.leader.email,
    whatsapp: cms.leader.whatsapp,
    phone0: cms.leader.phones[0] ?? "",
    phone1: cms.leader.phones[1] ?? "",
    siteUrl: cms.leader.siteUrl ?? "",
    facebook: cms.leader.facebook ?? "",
    instagram: cms.leader.instagram ?? "",
    youtube: cms.leader.youtube ?? "",
    twitter: cms.leader.twitter ?? "",
    bioIntro: cms.bio.intro,
    newPassword: "",
  }));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateCMS((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        name: local.name,
        shortName: local.shortName,
        org: local.org,
        role: local.role,
        tagline: local.tagline,
        dob: local.dob,
        community: local.community,
        location: local.location,
        email: local.email,
        whatsapp: local.whatsapp,
        phones: [local.phone0, local.phone1].filter(Boolean),
        siteUrl: local.siteUrl,
        facebook: local.facebook,
        instagram: local.instagram,
        youtube: local.youtube,
        twitter: local.twitter,
      },
      bio: { ...prev.bio, intro: local.bioIntro },
      adminPassword: local.newPassword || prev.adminPassword,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof typeof local) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLocal((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="max-w-2xl">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-6">Site Information</h2>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name"><input className={inp} value={local.name} onChange={set("name")} /></Field>
          <Field label="Short name"><input className={inp} value={local.shortName} onChange={set("shortName")} /></Field>
        </div>
        <Field label="Organisation name"><input className={inp} value={local.org} onChange={set("org")} /></Field>
        <Field label="Role / designation"><input className={inp} value={local.role} onChange={set("role")} /></Field>
        <Field label="Tagline (footer + hero)"><input className={inp} value={local.tagline} onChange={set("tagline")} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Date of birth"><input className={inp} value={local.dob} onChange={set("dob")} /></Field>
          <Field label="Community"><input className={inp} value={local.community} onChange={set("community")} /></Field>
        </div>
        <Field label="Office address"><input className={inp} value={local.location} onChange={set("location")} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone 1"><input className={inp} value={local.phone0} onChange={set("phone0")} /></Field>
          <Field label="Phone 2"><input className={inp} value={local.phone1} onChange={set("phone1")} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email"><input className={inp} value={local.email} onChange={set("email")} /></Field>
          <Field label="WhatsApp number (digits only)"><input className={inp} value={local.whatsapp} onChange={set("whatsapp")} /></Field>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
          <h3 className="font-semibold mb-3 text-sm">Website & Social Media</h3>
          <div className="space-y-3">
            <Field label="Website URL (used in QR code)">
              <input className={inp} value={local.siteUrl} onChange={set("siteUrl")} placeholder="https://rathodfoundation.in" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Facebook URL"><input className={inp} value={local.facebook} onChange={set("facebook")} placeholder="https://facebook.com/…" /></Field>
              <Field label="Instagram URL"><input className={inp} value={local.instagram} onChange={set("instagram")} placeholder="https://instagram.com/…" /></Field>
              <Field label="YouTube URL"><input className={inp} value={local.youtube} onChange={set("youtube")} placeholder="https://youtube.com/@…" /></Field>
              <Field label="Twitter/X URL"><input className={inp} value={local.twitter} onChange={set("twitter")} placeholder="https://x.com/…" /></Field>
            </div>
          </div>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
          <h3 className="font-semibold mb-3 text-sm">Bio introduction paragraph</h3>
          <Field label="Bio intro">
            <textarea className={inp + " h-24 resize-none"} value={local.bioIntro} onChange={set("bioIntro")} />
          </Field>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
          <h3 className="font-semibold mb-3 text-sm">Change admin password</h3>
          <Field label="New password (leave blank to keep current)">
            <input type="password" className={inp} value={local.newPassword} onChange={set("newPassword")} placeholder="••••••••" />
          </Field>
        </div>

        <button onClick={save} className={btn("saffron") + " px-5 py-2.5 text-sm"}>Save changes</button>
      </div>
    </div>
  );
}

// ── Tab: Chairman ─────────────────────────────────────────────────────────────
function ChairmanTab() {
  const { cms, updateCMS } = useCMS();
  const [local, setLocal] = useState<CMSChairman>(() => ({ ...cms.chairman, highlights: [...cms.chairman.highlights] }));
  const [saved, setSaved] = useState(false);
  const photoUpload = useImageUpload((base64) => setLocal((p) => ({ ...p, photo: base64 })));

  const save = () => {
    updateCMS((prev) => ({ ...prev, chairman: { ...local } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof CMSChairman) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLocal((p) => ({ ...p, [k]: e.target.value }));

  const updateHighlight = (i: number, val: string) =>
    setLocal((p) => { const h = [...p.highlights]; h[i] = val; return { ...p, highlights: h }; });

  const removeHighlight = (i: number) =>
    setLocal((p) => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) }));

  const addHighlight = () =>
    setLocal((p) => ({ ...p, highlights: [...p.highlights, "New highlight"] }));

  return (
    <div className="max-w-2xl">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-6">Chairman — Jeevan Raj Rathod</h2>
      {photoUpload.input}
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--color-line)" }}>
            <img src={local.photo} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="flex-1 space-y-2">
            <button onClick={photoUpload.trigger} disabled={photoUpload.uploading} className={btn("ghost") + " text-xs"}>
              {photoUpload.uploading ? "Uploading…" : "📤 Change photo"}
            </button>
            <Field label="Or paste photo URL/path">
              <input className={inp} value={local.photo.startsWith("data:") ? "(uploaded image)" : local.photo} onChange={set("photo")} placeholder="/img/chairman.jpeg" />
            </Field>
            {photoUpload.sizeWarn && <p className="text-xs text-red-600">{photoUpload.sizeWarn}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name"><input className={inp} value={local.name} onChange={set("name")} /></Field>
          <Field label="Role / title"><input className={inp} value={local.role} onChange={set("role")} /></Field>
        </div>
        <Field label="Affiliation"><input className={inp} value={local.affiliation} onChange={set("affiliation")} /></Field>
        <Field label="Bio paragraph">
          <textarea className={inp + " h-28 resize-none"} value={local.bio} onChange={set("bio")} />
        </Field>

        <div>
          <h3 className="font-semibold text-sm mb-2">Highlights (bullet points)</h3>
          <div className="space-y-2 mb-2">
            {local.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input className={inp + " flex-1"} value={h} onChange={(e) => updateHighlight(i, e.target.value)} />
                <button onClick={() => removeHighlight(i)} className={btn("red")}>✕</button>
              </div>
            ))}
          </div>
          <button onClick={addHighlight} className={btn("ghost")}>+ Add highlight</button>
        </div>

        <button onClick={save} className={btn("saffron") + " px-5 py-2.5 text-sm"}>Save changes</button>
      </div>
    </div>
  );
}

// ── Tab: Process Steps ────────────────────────────────────────────────────────
function ProcessStepsTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateStep = (i: number, field: keyof CMSStep, value: string) =>
    updateCMS((p) => { const steps = [...p.steps]; steps[i] = { ...steps[i], [field]: value }; return { ...p, steps }; });

  const removeStep = (i: number) => { updateCMS((p) => ({ ...p, steps: p.steps.filter((_, idx) => idx !== i) })); flash(); };

  const addStep = () => {
    const n = (cms.steps.length + 1).toString().padStart(2, "0");
    updateCMS((p) => ({ ...p, steps: [...p.steps, { n, title: "New step", text: "Description here." }] }));
    flash();
  };

  return (
    <div className="max-w-2xl">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Process Steps</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>These appear on the How It Works / Process page (steps 01–04).</p>
      <div className="space-y-3 mb-5">
        {cms.steps.map((s, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2" style={{ borderColor: "var(--color-line)", borderLeft: "4px solid var(--color-saffron)" }}>
            <div className="flex gap-2">
              <Field label="Step #"><input className={inp + " w-16"} value={s.n} onChange={(e) => updateStep(i, "n", e.target.value)} /></Field>
              <div className="flex-1"><Field label="Title"><input className={inp} value={s.title} onChange={(e) => updateStep(i, "title", e.target.value)} /></Field></div>
              <button onClick={() => removeStep(i)} className={btn("red") + " mt-5"}>Remove</button>
            </div>
            <Field label="Description">
              <textarea className={inp + " h-16 resize-none"} value={s.text} onChange={(e) => updateStep(i, "text", e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
      <button onClick={addStep} className={btn("saffron")}>+ Add step</button>
    </div>
  );
}

// ── Tab: Gallery ──────────────────────────────────────────────────────────────
function useMediaUpload(onResult: (base64: string) => void, accept = "image/*,video/*") {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [sizeWarn, setSizeWarn] = useState<string | null>(null);

  const trigger = () => ref.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mb = file.size / (1024 * 1024);
    const isVideo = file.type.startsWith("video/");
    const limit = isVideo ? 20 : 4;
    if (mb > limit) {
      setSizeWarn(`File is ${mb.toFixed(1)} MB — max ${limit} MB for ${isVideo ? "video" : "image"}. For large videos use a hosted URL instead.`);
      return;
    }
    setSizeWarn(null);
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { onResult(ev.target?.result as string); setUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const input = <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />;
  return { trigger, uploading, sizeWarn, input };
}

function useImageUpload(onResult: (base64: string) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [sizeWarn, setSizeWarn] = useState<string | null>(null);

  const trigger = () => ref.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mb = file.size / (1024 * 1024);
    if (mb > 4) { setSizeWarn(`File is ${mb.toFixed(1)} MB — please use an image under 4 MB.`); return; }
    setSizeWarn(null);
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      onResult(ev.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const input = (
    <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
  );

  return { trigger, uploading, sizeWarn, input };
}

function GalleryTab() {
  const { cms, updateCMS } = useCMS();
  const [newPhoto, setNewPhoto] = useState<Omit<CMSGalleryPhoto, "id">>({ src: "", caption: "", tag: "leader" });
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  /* ── new media upload hook ── */
  const newUpload = useMediaUpload((base64) => setNewPhoto((p) => ({ ...p, src: base64 })));

  const addPhoto = () => {
    if (!newPhoto.src.trim()) return;
    updateCMS((p) => ({ ...p, gallery: [...p.gallery, { ...newPhoto, id: uid() }] }));
    setNewPhoto({ src: "", caption: "", tag: "leader" });
    flash();
  };

  const removePhoto = (id: string) =>
    updateCMS((p) => ({ ...p, gallery: p.gallery.filter((ph) => ph.id !== id) }));

  const updateField = (id: string, field: keyof CMSGalleryPhoto, val: string) =>
    updateCMS((p) => ({ ...p, gallery: p.gallery.map((ph) => ph.id === id ? { ...ph, [field]: val } : ph) }));

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Gallery Photos</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        {cms.gallery.length} photos · Upload from your device or paste a URL/path. Changes save instantly.
      </p>

      {/* ── Existing photos list ── */}
      <div className="space-y-3 mb-8">
        {cms.gallery.map((ph) => (
          <ExistingPhotoRow
            key={ph.id}
            photo={ph}
            onUpdateField={updateField}
            onRemove={removePhoto}
          />
        ))}
      </div>

      {/* ── Add new photo form ── */}
      <div className="rounded-2xl p-5 border-2 border-dashed space-y-4" style={{ borderColor: "var(--color-saffron)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Add photo or video</h3>
          <div className="flex rounded-lg overflow-hidden border text-xs font-semibold" style={{ borderColor: "var(--color-line)" }}>
            {(["upload", "url"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setInputMode(m); setNewPhoto((p) => ({ ...p, src: "" })); }}
                className="px-3 py-1.5 transition-colors"
                style={inputMode === m
                  ? { background: "var(--color-saffron)", color: "#fff" }
                  : { background: "#fff", color: "var(--color-muted)" }}
              >
                {m === "upload" ? "📤 Upload file" : "🔗 URL / path"}
              </button>
            ))}
          </div>
        </div>

        {inputMode === "upload" ? (
          <div>
            {newUpload.input}
            {newPhoto.src.startsWith("data:") ? (
              <div className="relative inline-block w-full">
                {newPhoto.src.startsWith("data:video") ? (
                  <video src={newPhoto.src} controls className="w-full max-h-48 rounded-xl bg-black" />
                ) : (
                  <img src={newPhoto.src} alt="preview" className="w-full h-40 rounded-xl object-cover border" style={{ borderColor: "var(--color-line)" }} />
                )}
                <button
                  onClick={() => setNewPhoto((p) => ({ ...p, src: "" }))}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                >✕</button>
              </div>
            ) : (
              <button
                onClick={newUpload.trigger}
                disabled={newUpload.uploading}
                className="w-full border-2 border-dashed rounded-xl py-10 flex flex-col items-center gap-2 transition-colors hover:border-[--color-saffron]"
                style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
              >
                <span className="text-3xl">{newUpload.uploading ? "⏳" : "🎬"}</span>
                <span className="text-sm font-medium">{newUpload.uploading ? "Reading file…" : "Click to choose image or video"}</span>
                <span className="text-xs">JPG · PNG · WEBP (max 4 MB) &nbsp;·&nbsp; MP4 · MOV · WEBM (max 20 MB)</span>
              </button>
            )}
            {newUpload.sizeWarn && <p className="text-xs text-red-600 mt-1">{newUpload.sizeWarn}</p>}
          </div>
        ) : (
          <Field label="Image or video URL / path">
            <input
              className={inp}
              value={newPhoto.src}
              onChange={(e) => setNewPhoto((p) => ({ ...p, src: e.target.value }))}
              placeholder="/img/my-photo.jpg  or  https://example.com/video.mp4"
            />
            {newPhoto.src && !newPhoto.src.startsWith("data:") && (
              /\.(mp4|webm|mov|avi)$/i.test(newPhoto.src)
                ? <video src={newPhoto.src} controls className="mt-2 w-full max-h-36 rounded-lg bg-black" />
                : <img src={newPhoto.src} alt="" className="mt-2 h-28 rounded-lg object-cover w-full" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            )}
          </Field>
        )}

        <Field label="Caption">
          <input
            className={inp}
            value={newPhoto.caption}
            onChange={(e) => setNewPhoto((p) => ({ ...p, caption: e.target.value }))}
            placeholder="Describe the photo"
          />
        </Field>

        <Field label="Category">
          <select
            className={inp}
            value={newPhoto.tag}
            onChange={(e) => setNewPhoto((p) => ({ ...p, tag: e.target.value as CMSGalleryPhoto["tag"] }))}
          >
            <option value="leader">Leader portrait</option>
            <option value="events">Event / community</option>
            <option value="work">Before & after work</option>
          </select>
        </Field>

        <button
          onClick={addPhoto}
          disabled={!newPhoto.src.trim()}
          className={btn("saffron") + " px-5 py-2 disabled:opacity-40"}
        >
          Add to gallery
        </button>
      </div>
    </div>
  );
}

/* Separate component so each row has its own upload hook */
function ExistingPhotoRow({
  photo,
  onUpdateField,
  onRemove,
}: {
  photo: CMSGalleryPhoto;
  onUpdateField: (id: string, field: keyof CMSGalleryPhoto, val: string) => void;
  onRemove: (id: string) => void;
}) {
  const replaceUpload = useMediaUpload((base64) => onUpdateField(photo.id, "src", base64));
  const isVideo = photo.src.startsWith("data:video") || /\.(mp4|webm|mov|avi)$/i.test(photo.src);
  const srcLabel = photo.src.startsWith("data:") ? (isVideo ? "📎 Uploaded video" : "📎 Uploaded image") : photo.src;

  return (
    <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: "var(--color-line)" }}>
      {replaceUpload.input}
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-xl" style={{ background: "var(--color-saffron-tint)" }}>
          {isVideo
            ? <video src={photo.src} className="w-full h-full object-cover" muted playsInline />
            : <img src={photo.src} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <input
            className={inp + " mb-1.5"}
            value={photo.caption}
            onChange={(e) => onUpdateField(photo.id, "caption", e.target.value)}
            placeholder="Caption"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="text-xs border rounded-lg px-2 py-1 outline-none"
              style={{ borderColor: "var(--color-line)" }}
              value={photo.tag}
              onChange={(e) => onUpdateField(photo.id, "tag", e.target.value)}
            >
              <option value="leader">Portrait</option>
              <option value="events">Event</option>
              <option value="work">Work</option>
            </select>
            <span className="text-xs truncate max-w-[200px]" style={{ color: "var(--color-muted)" }}>{srcLabel}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={replaceUpload.trigger}
            className={btn("ghost") + " whitespace-nowrap"}
            title="Replace with a new image or video"
          >
            {replaceUpload.uploading ? "⏳" : "🔄 Replace"}
          </button>
          <button onClick={() => onRemove(photo.id)} className={btn("red")}>Remove</button>
        </div>
      </div>
      {replaceUpload.sizeWarn && (
        <p className="text-xs text-red-600">{replaceUpload.sizeWarn}</p>
      )}
    </div>
  );
}

// ── Tab: Timeline ─────────────────────────────────────────────────────────────
function TimelineTab() {
  const { cms, updateCMS } = useCMS();
  const [newEntry, setNewEntry] = useState<Omit<CMSTimelineEntry, "id">>({ year: "", title: "", detail: "", color: "saffron", icon: "📌" });
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addEntry = () => {
    if (!newEntry.year.trim() || !newEntry.title.trim()) return;
    updateCMS((p) => ({ ...p, timeline: [...p.timeline, { ...newEntry, id: uid() }] }));
    setNewEntry({ year: "", title: "", detail: "", color: "saffron", icon: "📌" });
    flash();
  };

  const removeEntry = (id: string) => updateCMS((p) => ({ ...p, timeline: p.timeline.filter((t) => t.id !== id) }));

  const updateField = (id: string, field: keyof CMSTimelineEntry, value: string) =>
    updateCMS((p) => ({ ...p, timeline: p.timeline.map((t) => t.id === id ? { ...t, [field]: value } : t) }));

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Timeline / Milestones</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>These appear on the Gallery page in chronological order.</p>

      <div className="space-y-3 mb-8">
        {cms.timeline.map((t) => (
          <div key={t.id} className="rounded-xl p-4 border space-y-2" style={{ borderColor: "var(--color-line)", borderLeft: `4px solid var(--color-${t.color})` }}>
            <div className="flex gap-2 flex-wrap">
              <input className={inp + " w-24"} value={t.year} onChange={(e) => updateField(t.id, "year", e.target.value)} placeholder="Year" />
              <input className={inp + " flex-1"} value={t.title} onChange={(e) => updateField(t.id, "title", e.target.value)} placeholder="Milestone title" />
              <input className={inp + " w-14"} value={t.icon} onChange={(e) => updateField(t.id, "icon", e.target.value)} placeholder="🏆" />
              <select className={inp + " w-28"} value={t.color} onChange={(e) => updateField(t.id, "color", e.target.value)}>
                <option value="saffron">Saffron</option>
                <option value="green">Green</option>
              </select>
              <button onClick={() => removeEntry(t.id)} className={btn("red")}>Remove</button>
            </div>
            <textarea className={inp + " h-16 resize-none"} value={t.detail} onChange={(e) => updateField(t.id, "detail", e.target.value)} placeholder="Detail paragraph" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 border-2 border-dashed space-y-3" style={{ borderColor: "var(--color-green)" }}>
        <h3 className="font-semibold text-sm">Add milestone</h3>
        <div className="flex gap-2 flex-wrap">
          <Field label="Year"><input className={inp + " w-24"} value={newEntry.year} onChange={(e) => setNewEntry((p) => ({ ...p, year: e.target.value }))} placeholder="2025" /></Field>
          <div className="flex-1"><Field label="Title"><input className={inp} value={newEntry.title} onChange={(e) => setNewEntry((p) => ({ ...p, title: e.target.value }))} placeholder="Milestone title" /></Field></div>
          <Field label="Icon"><input className={inp + " w-16"} value={newEntry.icon} onChange={(e) => setNewEntry((p) => ({ ...p, icon: e.target.value }))} placeholder="🏆" /></Field>
          <Field label="Colour">
            <select className={inp + " w-28"} value={newEntry.color} onChange={(e) => setNewEntry((p) => ({ ...p, color: e.target.value as "saffron" | "green" }))}>
              <option value="saffron">Saffron</option>
              <option value="green">Green</option>
            </select>
          </Field>
        </div>
        <Field label="Detail">
          <textarea className={inp + " h-20 resize-none"} value={newEntry.detail} onChange={(e) => setNewEntry((p) => ({ ...p, detail: e.target.value }))} placeholder="Describe what happened..." />
        </Field>
        <button onClick={addEntry} className={btn("green")}>Add milestone</button>
      </div>
    </div>
  );
}

// ── Media field (upload or URL) used inside WorkCaseRow ──────────────────────
function WorkCaseMediaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const isData = value.startsWith("data:");
  const isVideo = isData
    ? value.startsWith("data:video")
    : /\.(mp4|webm|mov|avi|mkv)$/i.test(value);
  const [mode, setMode] = useState<"upload" | "url">(isData ? "upload" : "url");
  const upload = useMediaUpload((b64) => { onChange(b64); setMode("upload"); });

  return (
    <div className="space-y-2">
      {upload.input}
      <span className="block text-xs font-semibold" style={{ color: "var(--color-muted)" }}>{label}</span>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border text-xs font-semibold" style={{ borderColor: "var(--color-line)" }}>
        {(["upload", "url"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="flex-1 py-2 transition-colors"
            style={mode === m
              ? { background: "var(--color-saffron)", color: "#fff" }
              : { background: "#fff", color: "var(--color-muted)" }}
          >
            {m === "upload" ? "📤 Upload" : "🔗 URL / Path"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <div>
          {value && isData ? (
            /* preview */
            <div className="relative inline-block w-full">
              {isVideo ? (
                <video src={value} controls className="w-full max-h-40 rounded-xl object-cover bg-black" />
              ) : (
                <img src={value} alt={label} className="w-full h-32 rounded-xl object-cover" />
              )}
              <button
                onClick={() => onChange("")}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow-md"
              >✕</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={upload.trigger}
              disabled={upload.uploading}
              className="w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-1.5 transition-colors hover:border-[--color-saffron]"
              style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
            >
              <span className="text-2xl">{upload.uploading ? "⏳" : "🖼️"}</span>
              <span className="text-xs font-medium">{upload.uploading ? "Reading file…" : "Click to upload image or video"}</span>
              <span className="text-[10px]">JPG · PNG · MP4 · MOV · max 20 MB</span>
            </button>
          )}
          {upload.sizeWarn && <p className="text-xs text-red-600">{upload.sizeWarn}</p>}
        </div>
      ) : (
        <div>
          <input
            className={inp}
            value={isData ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="before-after/drain-before.jpg  or  https://…"
          />
          {value && !isData && (
            isVideo
              ? <video src={value} controls className="mt-2 w-full max-h-32 rounded-xl bg-black" />
              : <img src={value} alt="" className="mt-2 h-24 rounded-xl object-cover w-full" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          )}
        </div>
      )}
    </div>
  );
}

/* Isolated row so each case has its own upload hooks */
function WorkCaseRow({
  c,
  onUpdate,
  onRemove,
}: {
  c: CMSWorkCase;
  onUpdate: (field: keyof CMSWorkCase, value: string | number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-line)" }}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <Field label="Case title">
            <input className={inp} value={c.title} onChange={(e) => onUpdate("title", e.target.value)} />
          </Field>
        </div>
        <button onClick={onRemove} className={btn("red") + " mt-6 shrink-0"}>Remove</button>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Date">
          <input className={inp} value={c.date} onChange={(e) => onUpdate("date", e.target.value)} />
        </Field>
        <Field label="Location">
          <input className={inp} value={c.location} onChange={(e) => onUpdate("location", e.target.value)} />
        </Field>
        <Field label="Category">
          <input className={inp} value={c.category} onChange={(e) => onUpdate("category", e.target.value)} />
        </Field>
        <Field label="Days to resolve">
          <input type="number" className={inp} value={c.days} onChange={(e) => onUpdate("days", Number(e.target.value))} />
        </Field>
      </div>

      {/* Before / After media */}
      <div className="grid sm:grid-cols-2 gap-4">
        <WorkCaseMediaField
          label="Before (image or video)"
          value={c.before}
          onChange={(v) => onUpdate("before", v)}
        />
        <WorkCaseMediaField
          label="After (image or video)"
          value={c.after}
          onChange={(v) => onUpdate("after", v)}
        />
      </div>

      <Field label="Summary">
        <textarea className={inp + " h-16 resize-none"} value={c.summary} onChange={(e) => onUpdate("summary", e.target.value)} />
      </Field>
    </div>
  );
}

// ── Tab: Work Cases ───────────────────────────────────────────────────────────
function WorkCasesTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateCase = (id: string, field: keyof CMSWorkCase, value: string | number) =>
    updateCMS((p) => ({ ...p, workCases: p.workCases.map((c) => c.id === id ? { ...c, [field]: value } : c) }));

  const removeCase = (id: string) => {
    updateCMS((p) => ({ ...p, workCases: p.workCases.filter((c) => c.id !== id) }));
    flash();
  };

  const addCase = () => {
    updateCMS((p) => ({
      ...p,
      workCases: [
        ...p.workCases,
        {
          id: uid(),
          title: "New case",
          date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          location: "Banjara Hills",
          category: "Other",
          days: 7,
          before: "",
          after: "",
          summary: "",
        },
      ],
    }));
    flash();
  };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-1">Before &amp; After Cases</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Upload images or videos directly, or paste a file path / URL. Shown on the Work Done page.
      </p>
      <div className="space-y-5 mb-6">
        {cms.workCases.map((c) => (
          <WorkCaseRow
            key={c.id}
            c={c}
            onUpdate={(field, value) => updateCase(c.id, field, value)}
            onRemove={() => removeCase(c.id)}
          />
        ))}
      </div>
      <button onClick={addCase} className={btn("saffron") + " px-5 py-2.5"}>+ Add new case</button>
    </div>
  );
}

// ── Tab: Ward Data ────────────────────────────────────────────────────────────
function WardDataTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateWard = (i: number, field: keyof CMSWard, value: string | number) =>
    updateCMS((p) => { const wards = [...p.wards]; wards[i] = { ...wards[i], [field]: value }; return { ...p, wards }; });

  const removeWard = (i: number) => updateCMS((p) => ({ ...p, wards: p.wards.filter((_, idx) => idx !== i) }));
  const addWard = () => { updateCMS((p) => ({ ...p, wards: [...p.wards, { name: "New Locality", count: 0 }] })); flash(); };

  return (
    <div className="max-w-lg">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Ward / Locality Data</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>These fill the bars on the Impact page and power the interactive map.</p>
      <div className="space-y-2 mb-4">
        {cms.wards.map((w, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className={inp + " flex-1"} value={w.name} onChange={(e) => updateWard(i, "name", e.target.value)} placeholder="Locality name" />
            <input type="number" className={inp + " w-24"} value={w.count} onChange={(e) => updateWard(i, "count", Number(e.target.value))} placeholder="Count" />
            <button onClick={() => removeWard(i)} className={btn("red")}>✕</button>
          </div>
        ))}
      </div>
      <button onClick={addWard} className={btn("green")}>+ Add locality</button>
    </div>
  );
}

// ── Tab: Stats & Ticker ───────────────────────────────────────────────────────
function StatsTickerTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateStat = (i: number, field: keyof CMSStat, value: string | number) =>
    updateCMS((p) => { const stats = [...p.stats]; stats[i] = { ...stats[i], [field]: value }; return { ...p, stats }; });

  const updatePromise = (i: number, val: string) =>
    updateCMS((p) => { const promises = [...p.promises]; promises[i] = val; return { ...p, promises }; });

  const removePromise = (i: number) => updateCMS((p) => ({ ...p, promises: p.promises.filter((_, idx) => idx !== i) }));
  const addPromise = () => { updateCMS((p) => ({ ...p, promises: [...p.promises, "New promise"] })); flash(); };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-6">Stats & Ticker Strip</h2>

      <h3 className="font-semibold mb-3 text-sm">Hero stats (4 cards)</h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {cms.stats.map((s, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex gap-2">
              <Field label="Value"><input type="number" className={inp + " w-24"} value={s.value} onChange={(e) => updateStat(i, "value", Number(e.target.value))} /></Field>
              <Field label="Suffix"><input className={inp + " w-20"} value={s.suffix} onChange={(e) => updateStat(i, "suffix", e.target.value)} placeholder="+ yrs" /></Field>
            </div>
            <Field label="Label"><input className={inp} value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} /></Field>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-3 text-sm">Saffron ticker strip (promises)</h3>
      <div className="space-y-2 mb-4">
        {cms.promises.map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className={inp + " flex-1"} value={p} onChange={(e) => updatePromise(i, e.target.value)} />
            <button onClick={() => removePromise(i)} className={btn("red")}>✕</button>
          </div>
        ))}
      </div>
      <button onClick={addPromise} className={btn("saffron")}>+ Add promise</button>
    </div>
  );
}

// ── Tab: Bio Journey ──────────────────────────────────────────────────────────
function BiographyTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateJ = (i: number, field: string, value: string) =>
    updateCMS((p) => { const j = [...p.bio.journey]; j[i] = { ...j[i], [field]: value }; return { ...p, bio: { ...p.bio, journey: j } }; });

  const removeJ = (i: number) => updateCMS((p) => ({ ...p, bio: { ...p.bio, journey: p.bio.journey.filter((_, idx) => idx !== i) } }));
  const addJ = () => { updateCMS((p) => ({ ...p, bio: { ...p.bio, journey: [...p.bio.journey, { year: "", title: "", detail: "" }] } })); flash(); };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">About / Biography</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>These entries appear on the About page timeline.</p>
      <div className="space-y-3 mb-6">
        {cms.bio.journey.map((j, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex gap-2">
              <Field label="Year/Period"><input className={inp + " w-32"} value={j.year} onChange={(e) => updateJ(i, "year", e.target.value)} /></Field>
              <div className="flex-1"><Field label="Title"><input className={inp} value={j.title} onChange={(e) => updateJ(i, "title", e.target.value)} /></Field></div>
              <button onClick={() => removeJ(i)} className={btn("red") + " mt-5"}>Remove</button>
            </div>
            <Field label="Detail">
              <textarea className={inp + " h-16 resize-none"} value={j.detail} onChange={(e) => updateJ(i, "detail", e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
      <button onClick={addJ} className={btn("saffron")}>+ Add entry</button>

      <div className="border-t mt-8 pt-6" style={{ borderColor: "var(--color-line)" }}>
        <h3 className="font-semibold text-sm mb-1">Values cards (3 cards below timeline)</h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>The Accountable / Fast / For everyone cards. Icon must be one of: shield, clock, users.</p>
        <div className="space-y-3">
          {cms.bio.values.map((v, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2" style={{ borderColor: "var(--color-line)" }}>
              <div className="grid sm:grid-cols-3 gap-2">
                <Field label="Icon key">
                  <select className={inp} value={v.icon} onChange={(e) => updateCMS((p) => { const vals = [...p.bio.values]; vals[i] = { ...vals[i], icon: e.target.value }; return { ...p, bio: { ...p.bio, values: vals } }; })}>
                    <option value="shield">shield</option>
                    <option value="clock">clock</option>
                    <option value="users">users</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Title"><input className={inp} value={v.title} onChange={(e) => { const vals = [...cms.bio.values]; vals[i] = { ...vals[i], title: e.target.value }; updateCMS((p) => ({ ...p, bio: { ...p.bio, values: vals } })); }} /></Field>
                </div>
              </div>
              <Field label="Text">
                <textarea className={inp + " h-14 resize-none"} value={v.text} onChange={(e) => { const vals = [...cms.bio.values]; vals[i] = { ...vals[i], text: e.target.value }; updateCMS((p) => ({ ...p, bio: { ...p.bio, values: vals } })); }} />
              </Field>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Submissions ──────────────────────────────────────────────────────────
function SubmissionsTab() {
  const [cases, setCases] = useState<CaseT[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    listCases().then((c) => { if (alive) setCases(c); });
    return () => { alive = false; };
  }, []);

  const updateStage = async (id: string, newStage: number) => {
    const ok = await updateCaseStage(id, newStage);
    if (ok) {
      setCases((prev) => prev.map((c) => (c.id === id ? { ...c, stageIndex: newStage } : c)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Submitted Cases</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        {cases.length} cases total. Update the stage to move a case through the verification pipeline.
        <br /><span className="text-xs">All updates save directly to Supabase and reflect immediately for every user.</span>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs uppercase" style={{ color: "var(--color-muted)" }}>
              <th className="pb-3 pr-4 font-semibold">ID</th>
              <th className="pb-3 pr-4 font-semibold">Category</th>
              <th className="pb-3 pr-4 font-semibold">Name</th>
              <th className="pb-3 pr-4 font-semibold">Location</th>
              <th className="pb-3 pr-4 font-semibold">Stage</th>
              <th className="pb-3 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody>
            {cases.slice(0, 30).map((c) => {
              const currentStage = c.stageIndex;
              return (
                <tr key={c.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                  <td className="py-2 pr-4 font-mono text-xs" style={{ color: "var(--color-saffron-text)" }}>{c.id}</td>
                  <td className="py-2 pr-4 capitalize">{c.category}</td>
                  <td className="py-2 pr-4">{c.name || "—"}</td>
                  <td className="py-2 pr-4">{c.location}</td>
                  <td className="py-2 pr-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: currentStage >= 4 ? "var(--color-green)" : "var(--color-saffron)" }}>
                      {STAGES[currentStage]?.en ?? "—"}
                    </span>
                  </td>
                  <td className="py-2">
                    <select
                      value={currentStage}
                      onChange={(e) => updateStage(c.id, Number(e.target.value))}
                      className="text-xs border rounded-lg px-2 py-1 outline-none"
                      style={{ borderColor: "var(--color-line)" }}
                    >
                      {STAGES.map((s, i) => <option key={s.key} value={i}>{s.en}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Volunteers ───────────────────────────────────────────────────────────
function VolunteersTab() {
  const [volunteers, setVolunteers] = useState<VolunteerT[]>([]);
  useEffect(() => {
    let alive = true;
    listVolunteers().then((v) => { if (alive) setVolunteers(v); });
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-2">Volunteer Applications</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>{volunteers.length} applications received.</p>

      {volunteers.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>No volunteer applications yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase" style={{ color: "var(--color-muted)" }}>
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Phone</th>
                <th className="pb-3 pr-4 font-semibold">Area</th>
                <th className="pb-3 pr-4 font-semibold">Skills</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                  <td className="py-2 pr-4 font-semibold">{v.name}</td>
                  <td className="py-2 pr-4">{v.phone}</td>
                  <td className="py-2 pr-4">{v.area}</td>
                  <td className="py-2 pr-4 text-xs" style={{ color: "var(--color-muted)" }}>{v.skills || "—"}</td>
                  <td className="py-2 text-xs" style={{ color: "var(--color-muted)" }}>{new Date(v.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tab: Reset ────────────────────────────────────────────────────────────────
function ResetTab() {
  const { resetToDefaults } = useCMS();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-display font-bold mb-2">Reset to Defaults</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        This will clear all CMS overrides and restore the original site content. Submitted cases and volunteer applications are NOT affected.
      </p>
      {!confirm ? (
        <button onClick={() => setConfirm(true)} className={btn("red") + " px-5 py-2.5 text-sm"}>Reset all content</button>
      ) : (
        <div className="rounded-xl p-4 border-2 border-red-200 space-y-3">
          <p className="text-sm font-semibold text-red-700">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => { resetToDefaults(); setConfirm(false); }} className={btn("red") + " px-4 py-2"}>Yes, reset</button>
            <button onClick={() => setConfirm(false)} className={btn("ghost") + " px-4 py-2"}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Home Page ────────────────────────────────────────────────────────────
function HomePageTab() {
  const { cms, updateCMS } = useCMS();
  const [local, setLocal] = useState<CMSHome>(() => ({ ...cms.home }));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateCMS((p) => ({ ...p, home: { ...local } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof CMSHome) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLocal((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="max-w-2xl">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-1">Home Page</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>The hero section and vision quote on the home page.</p>
      <div className="space-y-4">
        <Field label="Top badge text">
          <input className={inp} value={local.badge} onChange={set("badge")} placeholder="24-hour response · Banjara Hills" />
        </Field>
        <Field label="Hero heading (main title)">
          <textarea className={inp + " h-20 resize-none"} value={local.heroTitle} onChange={set("heroTitle")} />
        </Field>
        <Field label="Hero subheading">
          <input className={inp} value={local.heroSubtitle} onChange={set("heroSubtitle")} />
        </Field>
        <Field label="Hero body text (below subheading)">
          <input className={inp} value={local.heroBody} onChange={set("heroBody")} />
        </Field>
        <Field label="Vision quote (Our Vision section)">
          <textarea className={inp + " h-24 resize-none"} value={local.visionText} onChange={set("visionText")} />
        </Field>
        <button onClick={save} className={btn("saffron") + " px-5 py-2.5 text-sm"}>Save changes</button>
      </div>
    </div>
  );
}

// ── Tab: All Pages ────────────────────────────────────────────────────────────
const PAGE_KEYS: { key: keyof import("../lib/cms").CMSPages; label: string; icon: string }[] = [
  { key: "work",      label: "Work Done",      icon: "🔨" },
  { key: "impact",    label: "Impact",          icon: "🗺️" },
  { key: "process",   label: "How It Works",    icon: "📋" },
  { key: "report",    label: "Report an Issue", icon: "📝" },
  { key: "volunteer", label: "Get Involved",    icon: "🙋" },
  { key: "gallery",   label: "Gallery",         icon: "🖼️" },
  { key: "dashboard", label: "Dashboard",       icon: "📊" },
  { key: "track",     label: "Track a Case",    icon: "🔍" },
  { key: "about",     label: "About",           icon: "👤" },
  { key: "seekHelp",  label: "Seek Help",       icon: "🤝" },
];

function PageHeaderField({ pageKey, label, icon }: { pageKey: keyof import("../lib/cms").CMSPages; label: string; icon: string }) {
  const { cms, updateCMS } = useCMS();
  const val: CMSPageHeader = cms.pages[pageKey];
  const [local, setLocal] = useState<CMSPageHeader>({ ...val });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateCMS((p) => ({ ...p, pages: { ...p.pages, [pageKey]: { ...local } } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const set = (k: keyof CMSPageHeader) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLocal((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: "var(--color-line)", borderLeft: "4px solid var(--color-saffron)" }}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span>{icon}</span> {label}
          <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>/{pageKey === "seekHelp" ? "seek-help" : pageKey}</span>
        </h3>
        {saved && <span className="text-xs font-semibold" style={{ color: "var(--color-green-text)" }}>✓ Saved</span>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Eyebrow (small label)">
          <input className={inp} value={local.eyebrow} onChange={set("eyebrow")} />
        </Field>
        <Field label="Page title">
          <input className={inp} value={local.title} onChange={set("title")} />
        </Field>
      </div>
      <Field label="Subtitle / description">
        <textarea className={inp + " h-16 resize-none"} value={local.subtitle} onChange={set("subtitle")} />
      </Field>
      <button onClick={save} className={btn("saffron") + " text-xs px-4 py-2"}>Save</button>
    </div>
  );
}

function AllPagesTab() {
  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-1">All Pages</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Edit the header text (eyebrow label, title, subtitle) shown at the top of each page.</p>
      <div className="space-y-4">
        {PAGE_KEYS.map((p) => (
          <PageHeaderField key={p.key} pageKey={p.key} label={p.label} icon={p.icon} />
        ))}
      </div>
    </div>
  );
}

// ── Tab: Help Categories ──────────────────────────────────────────────────────
function HelpCategoriesTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const ICON_OPTIONS = ["medical", "book", "doc", "rupee", "card", "bolt", "home", "elder", "hand", "pin", "users", "megaphone"];

  const update = (i: number, field: keyof CMSHelpCategory, value: string) =>
    updateCMS((p) => {
      const cats = [...p.helpCategories];
      cats[i] = { ...cats[i], [field]: value };
      return { ...p, helpCategories: cats };
    });

  const remove = (i: number) => { updateCMS((p) => ({ ...p, helpCategories: p.helpCategories.filter((_, idx) => idx !== i) })); flash(); };

  const add = () => {
    updateCMS((p) => ({
      ...p,
      helpCategories: [...p.helpCategories, { id: uid(), icon: "hand", en: "New category", te: "", hi: "", descEn: "Description here." }],
    }));
    flash();
  };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-1">Help Categories</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        These appear on the Seek Help page as selectable cards. Each category needs English, Telugu, and Hindi labels.
      </p>
      <div className="space-y-4 mb-6">
        {cms.helpCategories.map((cat, i) => (
          <div key={cat.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--color-line)", borderLeft: "4px solid var(--color-saffron)" }}>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <Field label="Icon">
                  <select className={inp + " w-32"} value={cat.icon} onChange={(e) => update(i, "icon", e.target.value)}>
                    {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </Field>
                <div className="flex-1"><Field label="English label"><input className={inp} value={cat.en} onChange={(e) => update(i, "en", e.target.value)} /></Field></div>
              </div>
              <button onClick={() => remove(i)} className={btn("red") + " mt-5 shrink-0"}>Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Telugu (తెలుగు)"><input className={inp} value={cat.te} onChange={(e) => update(i, "te", e.target.value)} placeholder="Telugu translation" /></Field>
              <Field label="Hindi (हिंदी)"><input className={inp} value={cat.hi} onChange={(e) => update(i, "hi", e.target.value)} placeholder="Hindi translation" /></Field>
            </div>
            <Field label="Description (English)">
              <input className={inp} value={cat.descEn} onChange={(e) => update(i, "descEn", e.target.value)} placeholder="Short description shown under the category name" />
            </Field>
          </div>
        ))}
      </div>
      <button onClick={add} className={btn("saffron")}>+ Add category</button>
    </div>
  );
}

// ── Tab: Campaigns ────────────────────────────────────────────────────────────
function CampaignsTab() {
  const { cms, updateCMS } = useCMS();
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const update = (i: number, field: keyof CMSCampaign, value: string) =>
    updateCMS((p) => {
      const camps = [...p.campaigns];
      camps[i] = { ...camps[i], [field]: value };
      return { ...p, campaigns: camps };
    });

  const remove = (i: number) => { updateCMS((p) => ({ ...p, campaigns: p.campaigns.filter((_, idx) => idx !== i) })); flash(); };

  const add = () => {
    updateCMS((p) => ({
      ...p,
      campaigns: [...p.campaigns, { id: uid(), title: "New campaign", date: "", area: "" }],
    }));
    flash();
  };

  return (
    <div className="max-w-2xl">
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-1">Awareness Campaigns</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        These appear on the Volunteer page as upcoming campaigns people can join.
      </p>
      <div className="space-y-3 mb-6">
        {cms.campaigns.map((c, i) => (
          <div key={c.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--color-line)", borderLeft: "4px solid var(--color-green)" }}>
            <div className="flex gap-2 items-start">
              <div className="flex-1"><Field label="Campaign title"><input className={inp} value={c.title} onChange={(e) => update(i, "title", e.target.value)} /></Field></div>
              <button onClick={() => remove(i)} className={btn("red") + " mt-5 shrink-0"}>Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Date / Schedule"><input className={inp} value={c.date} onChange={(e) => update(i, "date", e.target.value)} placeholder="Jul 2026 / Monthly" /></Field>
              <Field label="Area / Venue"><input className={inp} value={c.area} onChange={(e) => update(i, "area", e.target.value)} placeholder="Road No. 12 community hall" /></Field>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className={btn("green")}>+ Add campaign</button>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    group: "Dashboard",
    items: [
      { key: "overview",    label: "Overview",       icon: "📊" },
      { key: "submissions", label: "Submissions",    icon: "📬" },
      { key: "volunteers",  label: "Volunteers",     icon: "🙋" },
    ],
  },
  {
    group: "Content",
    items: [
      { key: "home",      label: "Home Page",      icon: "🏠" },
      { key: "allpages",  label: "All Pages",      icon: "📄" },
      { key: "site",      label: "Site Info",      icon: "⚙️" },
      { key: "chairman",  label: "Chairman",       icon: "👤" },
      { key: "bio",       label: "Biography",      icon: "📖" },
      { key: "gallery",   label: "Gallery",        icon: "🖼️" },
      { key: "timeline",  label: "Timeline",       icon: "⏳" },
    ],
  },
  {
    group: "Data",
    items: [
      { key: "works",      label: "Work Cases",       icon: "🔨" },
      { key: "stats",      label: "Stats & Ticker",   icon: "📈" },
      { key: "wards",      label: "Ward Data",        icon: "🗺️" },
      { key: "steps",      label: "Process Steps",    icon: "📋" },
      { key: "helpcats",   label: "Help Categories",  icon: "🤝" },
      { key: "campaigns",  label: "Campaigns",        icon: "📣" },
    ],
  },
  {
    group: "Danger zone",
    items: [
      { key: "reset", label: "Reset Content", icon: "⚠️" },
    ],
  },
] as const;

type TabKey = "overview" | "submissions" | "volunteers" | "home" | "allpages" | "site" | "chairman" | "bio" | "gallery" | "timeline" | "works" | "stats" | "wards" | "steps" | "helpcats" | "campaigns" | "reset";

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function SidebarNav({ tab, setTab, onClose }: { tab: TabKey; setTab: (t: TabKey) => void; onClose?: () => void }) {
  const { saving } = useCMS();
  return (
    <nav className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-10 h-10 rounded-xl font-display font-extrabold text-base text-white shrink-0" style={{ background: "var(--color-saffron)" }}>RF</div>
          <div>
            <div className="font-display font-bold text-sm leading-tight" style={{ color: "var(--color-ink)" }}>Rathod Foundation</div>
            <div className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>Admin Panel</div>
          </div>
        </div>
        {/* Live save indicator under logo */}
        <div className={`mt-3 flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 transition-all ${saving ? "animate-pulse" : ""}`}
          style={{ background: saving ? "var(--color-saffron-tint)" : "var(--color-green-tint)", color: saving ? "var(--color-saffron-text)" : "var(--color-green-text)" }}>
          {saving ? (
            <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Saving changes…</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> All changes saved</>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((g) => (
          <div key={g.group}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--color-muted)" }}>{g.group}</p>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = tab === item.key;
                const isDanger = g.group === "Danger zone";
                return (
                  <button
                    key={item.key}
                    onClick={() => { setTab(item.key as TabKey); onClose?.(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all relative"
                    style={active
                      ? { background: isDanger ? "#fef2f2" : "var(--color-saffron-tint)", color: isDanger ? "#dc2626" : "var(--color-saffron-text)" }
                      : { color: isDanger ? "#dc2626" : "var(--color-ink)" }}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full" style={{ background: isDanger ? "#dc2626" : "var(--color-saffron)" }} />
                    )}
                    <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--color-line)" }}>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
          style={{ color: "var(--color-muted)" }}
        >
          <span className="text-base w-5 text-center">🌐</span> View website
        </Link>
      </div>
    </nav>
  );
}

// ── Main Admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const { cms } = useCMS();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rf_admin") === "1");
  const [tab, setTab] = useState<TabKey>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Allow OverviewTab quick-action buttons to navigate tabs
  useEffect(() => {
    const handler = (e: Event) => setTab((e as CustomEvent).detail as TabKey);
    window.addEventListener("rf-admin-tab", handler);
    return () => window.removeEventListener("rf-admin-tab", handler);
  }, []);

  if (!authed) {
    return (
      <LoginGate
        password={cms.adminPassword}
        onLogin={() => { sessionStorage.setItem("rf_admin", "1"); setAuthed(true); }}
      />
    );
  }

  const logout = () => { sessionStorage.removeItem("rf_admin"); setAuthed(false); };

  const allItems = NAV_GROUPS.flatMap((g) => [...g.items]) as { key: string; label: string; icon: string }[];
  const currentItem = allItems.find((i) => i.key === tab);
  const currentGroup = NAV_GROUPS.find((g) => g.items.some((i) => i.key === tab))?.group ?? "";

  return (
    <div className="min-h-screen flex" style={{ background: "#f4f5f7" }}>
      <SaveErrorBanner />

      {/* ── Desktop sidebar (wider: 260px) ──────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r sticky top-0 h-screen overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
        <SidebarNav tab={tab} setTab={setTab} />
        <div className="px-3 pb-4 border-t" style={{ borderColor: "var(--color-line)" }}>
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-red-50 text-red-600"
          >
            <span className="text-base w-5 text-center">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer overlay ────────────────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl overflow-hidden">
            <SidebarNav tab={tab} setTab={(t) => { setTab(t); setDrawerOpen(false); }} />
            <div className="px-3 pb-4 border-t" style={{ borderColor: "var(--color-line)" }}>
              <button onClick={() => { logout(); setDrawerOpen(false); }} className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 text-red-600">
                <span className="text-base w-5 text-center">🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header className="sticky top-0 z-40 bg-white border-b flex items-center gap-3 px-4 sm:px-6 h-14" style={{ borderColor: "var(--color-line)" }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden grid place-items-center w-9 h-9 rounded-xl shrink-0 transition-colors hover:bg-gray-100"
            style={{ color: "var(--color-ink)" }}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--color-muted)" }}>{currentGroup}</span>
            <span className="hidden sm:block text-sm" style={{ color: "var(--color-line)" }}>/</span>
            <span className="text-sm font-bold truncate" style={{ color: "var(--color-ink)" }}>
              {currentItem?.icon} {currentItem?.label}
            </span>
          </div>

          {/* View site button */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            View site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl w-full mx-auto">
          {tab === "overview"    && <OverviewTab />}
          {tab === "home"        && <HomePageTab />}
          {tab === "allpages"    && <AllPagesTab />}
          {tab === "site"        && <SiteInfoTab />}
          {tab === "chairman"    && <ChairmanTab />}
          {tab === "gallery"     && <GalleryTab />}
          {tab === "timeline"    && <TimelineTab />}
          {tab === "works"       && <WorkCasesTab />}
          {tab === "wards"       && <WardDataTab />}
          {tab === "stats"       && <StatsTickerTab />}
          {tab === "bio"         && <BiographyTab />}
          {tab === "steps"       && <ProcessStepsTab />}
          {tab === "submissions" && <SubmissionsTab />}
          {tab === "volunteers"  && <VolunteersTab />}
          {tab === "helpcats"    && <HelpCategoriesTab />}
          {tab === "campaigns"   && <CampaignsTab />}
          {tab === "reset"       && <ResetTab />}
        </main>
      </div>
    </div>
  );
}

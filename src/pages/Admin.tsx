import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { uid, type CMSGalleryPhoto, type CMSTimelineEntry, type CMSWard, type CMSStat, type CMSWorkCase, type CMSChairman, type CMSStep } from "../lib/cms";
import { listCases, listVolunteers, updateCaseStage, STAGES, type Case as CaseT, type Volunteer as VolunteerT } from "../lib/store";

// ── Auth gate ─────────────────────────────────────────────────────────────────
function LoginGate({ password, onLogin }: { password: string; onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === password) { onLogin(); setErr(false); }
    else { setErr(true); setPw(""); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="grid place-items-center w-14 h-14 rounded-2xl font-display font-extrabold text-xl text-white" style={{ background: "var(--color-saffron)" }}>RF</div>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-center mb-1" style={{ color: "var(--color-ink)" }}>Admin Panel</h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--color-muted)" }}>Rathod Foundation — content management</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false); }}
            placeholder="Enter admin password"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: err ? "#d92020" : "var(--color-line)" }}
            autoFocus
          />
          {err && <p className="text-xs text-red-600 font-medium">Incorrect password. Try again.</p>}
          <button type="submit" className="w-full rounded-xl py-3 font-semibold text-sm text-white" style={{ background: "var(--color-saffron)" }}>
            Sign in →
          </button>
        </form>
        <p className="text-xs text-center mt-6" style={{ color: "var(--color-muted)" }}>
          <Link to="/" className="underline">← Back to website</Link>
        </p>
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

const inp = "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[--color-saffron]";
const btn = (variant: "saffron" | "green" | "red" | "ghost" = "saffron") => {
  const styles = {
    saffron: "bg-[--color-saffron] text-white",
    green: "bg-[--color-green] text-white",
    red: "bg-red-600 text-white",
    ghost: "border text-[--color-ink]",
  };
  return `rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 ${styles[variant]}`;
};

function SaveBanner({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg" style={{ background: "var(--color-green)" }}>
      ✓ Saved successfully
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [cases, setCases] = useState<CaseT[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerT[]>([]);
  useEffect(() => {
    let alive = true;
    Promise.all([listCases(), listVolunteers()]).then(([c, v]) => {
      if (!alive) return;
      setCases(c);
      setVolunteers(v);
    });
    return () => { alive = false; };
  }, []);
  const resolved = cases.filter((c) => c.stageIndex >= 4).length;

  const cards = [
    { label: "Total cases", value: cases.length, color: "saffron" },
    { label: "Resolved", value: resolved, color: "green" },
    { label: "Volunteers", value: volunteers.length, color: "saffron" },
    { label: "Pending", value: cases.filter((c) => c.stageIndex < 4).length, color: "green" },
  ];

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl p-5 card">
            <div className="text-3xl font-display font-extrabold" style={{ color: `var(--color-${c.color}-text)` }}>{c.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{c.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        Use the tabs above to edit site content, manage gallery photos, update the timeline, review submissions and more.
        <br />Changes save automatically — they're live immediately on the website.
      </p>
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

  /* ── new photo upload hook ── */
  const newUpload = useImageUpload((base64) => setNewPhoto((p) => ({ ...p, src: base64 })));

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
          <h3 className="font-semibold text-sm">Add new photo</h3>
          {/* Mode toggle */}
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

        {/* Image input */}
        {inputMode === "upload" ? (
          <div>
            {newUpload.input}
            {newPhoto.src.startsWith("data:") ? (
              /* Preview */
              <div className="relative inline-block">
                <img src={newPhoto.src} alt="preview" className="h-40 rounded-xl object-cover border" style={{ borderColor: "var(--color-line)" }} />
                <button
                  onClick={() => setNewPhoto((p) => ({ ...p, src: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                >✕</button>
              </div>
            ) : (
              <button
                onClick={newUpload.trigger}
                disabled={newUpload.uploading}
                className="w-full border-2 border-dashed rounded-xl py-10 flex flex-col items-center gap-2 transition-colors hover:border-[--color-saffron]"
                style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
              >
                <span className="text-3xl">{newUpload.uploading ? "⏳" : "🖼️"}</span>
                <span className="text-sm font-medium">{newUpload.uploading ? "Reading file…" : "Click to choose an image"}</span>
                <span className="text-xs">JPG, PNG, WEBP — max 4 MB</span>
              </button>
            )}
            {newUpload.sizeWarn && (
              <p className="text-xs text-red-600 mt-1">{newUpload.sizeWarn}</p>
            )}
          </div>
        ) : (
          <Field label="Image URL or path">
            <input
              className={inp}
              value={newPhoto.src}
              onChange={(e) => setNewPhoto((p) => ({ ...p, src: e.target.value }))}
              placeholder="/img/my-photo.jpg  or  https://example.com/photo.jpg"
            />
            {newPhoto.src && !newPhoto.src.startsWith("data:") && (
              <img src={newPhoto.src} alt="" className="mt-2 h-28 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
  const replaceUpload = useImageUpload((base64) => onUpdateField(photo.id, "src", base64));
  const srcLabel = photo.src.startsWith("data:") ? "📎 Uploaded image" : photo.src;

  return (
    <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: "var(--color-line)" }}>
      {replaceUpload.input}
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-xl" style={{ background: "var(--color-saffron-tint)" }}>
          <img src={photo.src} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
            title="Replace with a new image"
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
    const newCase: CMSWorkCase = {
      id: uid(),
      title: "New case",
      date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      location: "Banjara Hills",
      category: "Other",
      days: 7,
      before: "",
      after: "",
      summary: "",
    };
    updateCMS((p) => ({ ...p, workCases: [...p.workCases, newCase] }));
    flash();
  };

  return (
    <div>
      <SaveBanner saved={saved} />
      <h2 className="text-xl font-display font-bold mb-2">Before & After Cases</h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Shown on the Work Done page. Before/after photo paths relative to <code>/public/img/</code>.</p>

      <div className="space-y-4 mb-6">
        {cms.workCases.map((c) => (
          <div key={c.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1"><Field label="Title"><input className={inp} value={c.title} onChange={(e) => updateCase(c.id, "title", e.target.value)} /></Field></div>
              <button onClick={() => removeCase(c.id)} className={btn("red") + " mt-5"}>Remove</button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Date"><input className={inp} value={c.date} onChange={(e) => updateCase(c.id, "date", e.target.value)} /></Field>
              <Field label="Location"><input className={inp} value={c.location} onChange={(e) => updateCase(c.id, "location", e.target.value)} /></Field>
              <Field label="Category"><input className={inp} value={c.category} onChange={(e) => updateCase(c.id, "category", e.target.value)} /></Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Days to resolve"><input type="number" className={inp} value={c.days} onChange={(e) => updateCase(c.id, "days", Number(e.target.value))} /></Field>
              <Field label="Before photo path"><input className={inp} value={c.before} onChange={(e) => updateCase(c.id, "before", e.target.value)} placeholder="before-after/drain-before.jpg" /></Field>
              <Field label="After photo path"><input className={inp} value={c.after} onChange={(e) => updateCase(c.id, "after", e.target.value)} placeholder="before-after/drain-after.jpg" /></Field>
            </div>
            <Field label="Summary">
              <textarea className={inp + " h-16 resize-none"} value={c.summary} onChange={(e) => updateCase(c.id, "summary", e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
      <button onClick={addCase} className={btn("saffron") + " px-5 py-2"}>+ Add new case</button>
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
        <br /><span className="text-xs">Updates save to Supabase when configured; otherwise to this browser.</span>
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

// ── Main Admin page ───────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "site", label: "Site Info" },
  { key: "chairman", label: "Chairman" },
  { key: "gallery", label: "Gallery" },
  { key: "timeline", label: "Timeline" },
  { key: "works", label: "Work Cases" },
  { key: "wards", label: "Ward Data" },
  { key: "stats", label: "Stats & Ticker" },
  { key: "bio", label: "Biography" },
  { key: "steps", label: "Process Steps" },
  { key: "submissions", label: "Submissions" },
  { key: "volunteers", label: "Volunteers" },
  { key: "reset", label: "Reset" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function Admin() {
  const { cms } = useCMS();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rf_admin") === "1");
  const [tab, setTab] = useState<TabKey>("overview");

  if (!authed) {
    return (
      <LoginGate
        password={cms.adminPassword}
        onLogin={() => { sessionStorage.setItem("rf_admin", "1"); setAuthed(true); }}
      />
    );
  }

  const logout = () => { sessionStorage.removeItem("rf_admin"); setAuthed(false); };

  return (
    <div className="min-h-screen" style={{ background: "#f7f7f8" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-8 h-8 rounded-lg font-display font-extrabold text-xs text-white" style={{ background: "var(--color-saffron)" }}>RF</div>
            <span className="font-display font-bold text-sm">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>← Website</Link>
            <button onClick={logout} className="text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: "var(--color-line)" }}>Logout</button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0.5 min-w-max pb-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2"
                style={{
                  borderColor: tab === t.key ? "var(--color-saffron)" : "transparent",
                  color: tab === t.key ? "var(--color-saffron-text)" : "var(--color-muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "site" && <SiteInfoTab />}
        {tab === "chairman" && <ChairmanTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "timeline" && <TimelineTab />}
        {tab === "works" && <WorkCasesTab />}
        {tab === "wards" && <WardDataTab />}
        {tab === "stats" && <StatsTickerTab />}
        {tab === "bio" && <BiographyTab />}
        {tab === "steps" && <ProcessStepsTab />}
        {tab === "submissions" && <SubmissionsTab />}
        {tab === "volunteers" && <VolunteersTab />}
        {tab === "reset" && <ResetTab />}
      </div>
    </div>
  );
}

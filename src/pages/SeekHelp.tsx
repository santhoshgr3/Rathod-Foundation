import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/ui";
import { categoryLabel } from "../data/help";
import { useCMS } from "../contexts/CMSContext";
import { useT } from "../lib/i18n";
import { createCase, STAGES, type Case } from "../lib/store";
import type { Lang } from "../lib/store";

// ── SpeechRecognition interface (not in all TS DOM libs) ─────────────────────
interface ISpeechRecognition extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
interface ISpeechRecognitionResult { readonly [i: number]: { transcript: string }; isFinal: boolean }
interface ISpeechRecognitionEvent { resultIndex: number; results: { [i: number]: ISpeechRecognitionResult; length: number } }
type SRConstructor = new () => ISpeechRecognition;
function getSR(): SRConstructor | null {
  return (window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor }).SpeechRecognition
    || (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition
    || null;
}

const LANG_LOCALE: Record<Lang, string> = { en: "en-IN", te: "te-IN", hi: "hi-IN" };

// ── Voice input component ─────────────────────────────────────────────────────
function VoiceInput({ lang, onTranscript }: { lang: Lang; onTranscript: (text: string) => void }) {
  const [mode, setMode] = useState<"idle" | "listening" | "recorded">("idle");
  const [live, setLive] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasSpeech, setHasSpeech] = useState(true);
  const recogRef = useRef<ISpeechRecognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => { setHasSpeech(!!getSR()); }, []);

  const btnLabel = {
    idle:      { en: "Tap to start speaking", te: "మాట్లాడటానికి టాప్ చేయండి", hi: "बोलने के लिए टैप करें" },
    listening: { en: "🔴 Listening… tap to stop", te: "🔴 వింటున్నాం… ఆపడానికి నొక్కండి", hi: "🔴 सुन रहे हैं… रोकने के लिए टैप करें" },
    recorded:  { en: "✅ Voice recorded — tap to re-record", te: "✅ రికార్డ్ అయింది — మళ్ళీ చేయండి", hi: "✅ रिकॉर्ड हो गया — दोबारा करें" },
  }[mode][lang];

  const startListening = async () => {
    setLive(""); setAudioUrl(null); setMode("listening");
    const SR = getSR();
    if (SR) {
      const recog = new SR();
      recogRef.current = recog;
      recog.lang = LANG_LOCALE[lang]; recog.continuous = true; recog.interimResults = true;
      let finalText = "";
      recog.onresult = (e: ISpeechRecognitionEvent) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const txt = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += txt + " "; else interim = txt;
        }
        setLive(finalText + interim);
      };
      recog.onerror = () => stopListening();
      recog.onend = () => {
        if (finalText.trim()) { onTranscript(finalText.trim()); setMode("recorded"); }
        else setMode("idle");
        setLive("");
      };
      recog.start();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mediaRef.current = mr;
        mr.ondataavailable = (e) => chunksRef.current.push(e.data);
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioUrl(URL.createObjectURL(blob)); setMode("recorded");
          stream.getTracks().forEach((t) => t.stop());
        };
        mr.start();
      } catch { setMode("idle"); }
    }
  };

  const stopListening = () => { recogRef.current?.stop(); mediaRef.current?.stop(); };
  const reset = () => { recogRef.current?.abort(); mediaRef.current?.stop(); setMode("idle"); setLive(""); setAudioUrl(null); };
  useEffect(() => () => { recogRef.current?.abort(); mediaRef.current?.stop(); }, []);

  return (
    <div className="space-y-3">
      {/* Big mic button */}
      <button
        type="button"
        onClick={mode === "listening" ? stopListening : startListening}
        className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl py-8 transition-all"
        style={{
          background: mode === "listening" ? "#d92020" : mode === "recorded" ? "var(--color-green)" : "var(--color-saffron-tint)",
          border: `2px ${mode === "idle" ? "dashed" : "solid"} ${mode === "listening" ? "#d92020" : mode === "recorded" ? "var(--color-green)" : "var(--color-saffron)"}`,
          color: mode === "idle" ? "var(--color-saffron-text)" : "#fff",
        }}
      >
        <span className={`grid place-items-center w-20 h-20 rounded-full ${mode === "listening" ? "animate-pulse" : ""}`}
              style={{ background: mode === "idle" ? "rgba(255,153,51,0.15)" : "rgba(255,255,255,0.18)" }}>
          {mode === "listening" ? (
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          ) : mode === "recorded" ? (
            <Icon.check className="w-9 h-9" sw={2.5} />
          ) : (
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" />
            </svg>
          )}
        </span>
        <span className="font-semibold text-base">{btnLabel}</span>
      </button>

      {mode === "listening" && live && (
        <div className="rounded-xl p-3 text-sm italic border animate-pulse"
             style={{ background: "var(--color-saffron-tint)", borderColor: "var(--color-saffron)", color: "var(--color-ink)" }}>
          {live}
        </div>
      )}
      {audioUrl && <audio controls src={audioUrl} className="w-full rounded-xl" />}
      {mode !== "idle" && (
        <button type="button" onClick={reset} className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>
          ✕ Clear and start over
        </button>
      )}
      {!hasSpeech && mode === "idle" && (
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          {lang === "te" ? "వాయిస్-టు-టెక్స్ట్ అందుబాటులో లేదు — ఆడియో రికార్డ్ చేస్తాం." : lang === "hi" ? "आवाज़-से-टेक्स्ट उपलब्ध नहीं — ऑडियो रिकॉर्ड होगा।" : "Voice-to-text unavailable — audio will be recorded instead."}
        </p>
      )}
    </div>
  );
}

// ── Step progress indicator ───────────────────────────────────────────────────
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const labels = ["Category", "Describe", "Contact"];
  return (
    <div className="flex items-center justify-center mb-10">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = current > n;
        const active = current === n;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  background: done ? "var(--color-green)" : active ? "var(--color-saffron)" : "var(--color-line)",
                  color: done || active ? "#fff" : "var(--color-muted)",
                  boxShadow: active ? "var(--elev-saffron)" : "none",
                }}
              >
                {done ? <Icon.check className="w-4 h-4" sw={2.5} /> : n}
              </div>
              <span className="text-[10px] font-semibold whitespace-nowrap"
                    style={{ color: active ? "var(--color-saffron-text)" : done ? "var(--color-green-text)" : "var(--color-muted)" }}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300"
                   style={{ background: current > n ? "var(--color-green)" : "var(--color-line)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
};

// ── Input helpers ─────────────────────────────────────────────────────────────
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
    "w-full rounded-xl px-4 py-3 text-base outline-none transition-shadow bg-white",
    error ? "border-2 border-red-400" : "border border-[var(--color-line)]",
    "focus:border-[var(--color-saffron)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-saffron)_25%,transparent)]",
  ].join(" ");
}

// ── Back button ───────────────────────────────────────────────────────────────
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--color-saffron-tint)]"
      style={{ border: "1.5px solid var(--color-line)", color: "var(--color-muted)" }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
    </button>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export default function SeekHelp() {
  const { t, lang } = useT();
  const { cms: { leader, helpCategories } } = useCMS();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [cat, setCat] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"type" | "voice">(
    searchParams.get("mode") === "voice" ? "voice" : "type"
  );
  const [form, setForm] = useState({ name: "", phone: "", location: "", details: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [ticket, setTicket] = useState<Case | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const goNext = () => { setDir(1); setStep((s) => (s + 1) as 1 | 2 | 3); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBack = () => { setDir(-1); setStep((s) => (s - 1) as 1 | 2 | 3); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json() as { display_name?: string; address?: { road?: string; suburb?: string; city?: string } };
          const addr = data.address;
          const readable = [addr?.road, addr?.suburb, addr?.city].filter(Boolean).join(", ") || data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
          setForm((f) => ({ ...f, location: readable }));
        } catch {
          setForm((f) => ({ ...f, location: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` }));
        } finally { setLocating(false); }
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const submit = async () => {
    if (!cat || submitting) return;
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errs.phone = true;
    if (!form.location.trim()) errs.location = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const c = await createCase({ type: "help", category: cat, name: form.name.trim(), phone: form.phone.trim(), location: form.location.trim(), details: form.details.trim(), lang });
      setTicket(c);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally { setSubmitting(false); }
  };

  const reset = () => {
    setTicket(null); setCat(null); setStep(1); setDir(1);
    setForm({ name: "", phone: "", location: "", details: "" });
    setPhoto(null); setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (ticket) {
    return (
      <div className="min-h-screen bg-white">
        <div className="tricolor-rule" style={{ height: 4, borderRadius: 0 }} />
        <div className="mx-auto max-w-lg px-5 sm:px-8 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">

            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
              className="mx-auto grid place-items-center w-24 h-24 rounded-full mb-6"
              style={{ background: "var(--color-green)", color: "#fff", boxShadow: "var(--elev-green)" }}
            >
              <Icon.check className="w-12 h-12" sw={2.5} />
            </motion.div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl" style={{ color: "var(--color-ink)" }}>Help is on the way!</h1>
            <p className="mt-2 text-base" style={{ color: "var(--color-muted)" }}>Your request has been received and assigned.</p>

            {/* Case ID — big and prominent */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-8 rounded-3xl p-7"
              style={{ background: "var(--color-saffron-tint)", border: "2px dashed var(--color-saffron)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-muted)" }}>Your Case ID</div>
              <div className="font-display font-extrabold text-5xl tracking-wider" style={{ color: "var(--color-saffron-text)" }}>{ticket.id}</div>
              <button
                onClick={() => { navigator.clipboard?.writeText(ticket.id); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                className="mt-3 text-sm font-semibold inline-flex items-center gap-1.5"
                style={{ color: copied ? "var(--color-green-text)" : "var(--color-saffron-text)" }}
              >
                {copied ? <><Icon.check className="w-4 h-4" /> Copied!</> : "📋 Copy case ID"}
              </button>
              <p className="mt-3 text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                📱 Screenshot this number to track your case later
              </p>
            </motion.div>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => navigate(`/track?id=${ticket.id}`)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-semibold text-lg text-white"
                style={{ background: "var(--color-saffron)", boxShadow: "var(--elev-saffron)" }}
              >
                <Icon.search className="w-5 h-5" /> Track my case
              </button>
              <a
                href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent(`I submitted a help request.\n\nCase ID: ${ticket.id}\nCategory: ${categoryLabel(ticket.category, "en")}\n\nPlease help me.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-semibold text-lg text-white"
                style={{ background: "#25D366" }}
              >
                <Icon.chat className="w-5 h-5" /> Share on WhatsApp
              </a>
              <button onClick={reset} className="text-sm font-semibold mt-1" style={{ color: "var(--color-saffron-text)" }}>
                Submit another request →
              </button>
            </div>

            {/* What happens next */}
            <div className="mt-8 rounded-2xl p-5 text-left" style={{ background: "var(--color-green-tint)" }}>
              <div className="font-semibold mb-3">What happens next</div>
              <ol className="space-y-2.5 text-sm" style={{ color: "var(--color-muted)" }}>
                {STAGES.map((s, i) => (
                  <li key={s.key} className="flex gap-3 items-start">
                    <span className="grid place-items-center w-6 h-6 rounded-full text-[11px] font-bold text-white shrink-0 mt-0.5"
                          style={{ background: i === 0 ? "var(--color-saffron)" : "var(--color-green)" }}>{i + 1}</span>
                    {s[lang]}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="tricolor-rule" style={{ height: 4, borderRadius: 0 }} />
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8 sm:py-12">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait" custom={dir}>

          {/* ── Step 1: Category ── */}
          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <div className="text-center mb-8">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl" style={{ color: "var(--color-ink)" }}>
                  What do you need help with?
                </h1>
                <p className="mt-2" style={{ color: "var(--color-muted)" }}>Tap a category to get started — it's free</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {helpCategories.map((c) => {
                  const I = (Icon as Record<string, (p: { className?: string }) => JSX.Element>)[c.icon] ?? Icon.hand;
                  const active = cat === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setCat(c.id); setTimeout(goNext, 320); }}
                      className="relative w-full text-left rounded-2xl p-5 transition-all active:scale-95"
                      style={{
                        background: active ? "var(--color-saffron)" : "#fff",
                        border: `2px solid ${active ? "var(--color-saffron)" : "var(--color-line)"}`,
                        color: active ? "#fff" : "var(--color-ink)",
                        boxShadow: active ? "var(--elev-saffron)" : "var(--elev-1)",
                      }}
                    >
                      <div className="grid place-items-center w-12 h-12 rounded-xl mb-3 transition-colors"
                           style={{ background: active ? "rgba(255,255,255,0.22)" : "var(--color-saffron-tint)", color: active ? "#fff" : "var(--color-saffron-text)" }}>
                        <I className="w-6 h-6" />
                      </div>
                      <div className="font-semibold leading-snug text-sm">{c[lang]}</div>
                      <div className="text-xs mt-1 leading-relaxed" style={{ color: active ? "rgba(255,255,255,0.82)" : "var(--color-muted)" }}>{c.descEn}</div>
                      {active && (
                        <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.3)" }}>
                          <Icon.check className="w-3.5 h-3.5" sw={2.8} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-sm" style={{ color: "var(--color-muted)" }}>
                Already submitted? <Link to="/track" className="font-semibold" style={{ color: "var(--color-saffron-text)" }}>Track your case →</Link>
              </p>
            </motion.div>
          )}

          {/* ── Step 2: Describe ── */}
          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-7">
                <BackBtn onClick={goBack} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-saffron-text)" }}>
                    {cat ? categoryLabel(cat, lang) : ""}
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight" style={{ color: "var(--color-ink)" }}>
                    Describe your problem
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Mode selector — Voice first */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInputMode("voice")}
                    className="flex flex-col items-center gap-2 rounded-2xl py-5 px-4 font-semibold text-sm transition-all"
                    style={{
                      background: inputMode === "voice" ? "var(--color-saffron)" : "var(--color-saffron-tint)",
                      border: `2px solid ${inputMode === "voice" ? "var(--color-saffron)" : "transparent"}`,
                      color: inputMode === "voice" ? "#fff" : "var(--color-saffron-text)",
                      boxShadow: inputMode === "voice" ? "var(--elev-saffron)" : "none",
                    }}
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" />
                    </svg>
                    <span>{lang === "te" ? "🎤 మాట్లాడండి" : lang === "hi" ? "🎤 बोलें" : "🎤 Speak"}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {lang === "te" ? "typing అక్కరలేదు" : lang === "hi" ? "टाइपिंग नहीं चाहिए" : "No typing needed"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("type")}
                    className="flex flex-col items-center gap-2 rounded-2xl py-5 px-4 font-semibold text-sm transition-all"
                    style={{
                      background: inputMode === "type" ? "var(--color-ink)" : "#fff",
                      border: `2px solid ${inputMode === "type" ? "var(--color-ink)" : "var(--color-line)"}`,
                      color: inputMode === "type" ? "#fff" : "var(--color-ink)",
                    }}
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M8 10h8M8 14h5" />
                    </svg>
                    <span>{lang === "te" ? "⌨️ రాయండి" : lang === "hi" ? "⌨️ लिखें" : "⌨️ Type"}</span>
                    <span className="text-[10px] font-normal opacity-70">
                      {lang === "te" ? "Text lo raseyandi" : lang === "hi" ? "शब्दों में लिखें" : "Write in your words"}
                    </span>
                  </button>
                </div>

                {/* Input area */}
                {inputMode === "voice" ? (
                  <VoiceInput lang={lang} onTranscript={(text) => setForm((f) => ({ ...f, details: f.details ? f.details + " " + text : text }))} />
                ) : (
                  <textarea
                    rows={5}
                    className={inputCls(errors.details) + " resize-none"}
                    value={form.details}
                    onChange={set("details")}
                    placeholder={lang === "te" ? "మీ సమస్య వివరంగా రాయండి…" : lang === "hi" ? "अपनी समस्या विस्तार से लिखें…" : "Describe your problem in detail…"}
                    autoFocus
                  />
                )}
                {errors.details && (
                  <p className="text-sm text-red-600 font-medium">
                    {lang === "te" ? "దయచేసి మీ సమస్య చెప్పండి" : lang === "hi" ? "कृपया अपनी समस्या बताएं" : "Please describe your problem first"}
                  </p>
                )}

                {/* If voice mode and something was transcribed, show the text */}
                {inputMode === "voice" && form.details && (
                  <div className="rounded-xl p-3 text-sm" style={{ background: "var(--color-green-tint)", border: "1px solid var(--color-green)" }}>
                    <span className="font-semibold text-xs uppercase tracking-wide block mb-1" style={{ color: "var(--color-green-text)" }}>Recorded</span>
                    {form.details}
                  </div>
                )}

                {/* Photo upload */}
                <div>
                  <span className="text-sm font-semibold block mb-2">
                    📷 {lang === "te" ? "ఫోటో జోడించండి" : lang === "hi" ? "फोटो जोड़ें"  : "Add a photo"}
                    {" "}<span className="font-normal text-xs" style={{ color: "var(--color-muted)" }}>
                      ({lang === "te" ? "ఐచ్ఛికం" : lang === "hi" ? "वैकल्पिक" : "optional"})
                    </span>
                  </span>
                  {photo ? (
                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-line)" }}>
                      <img src={photo} alt="Uploaded" className="w-full max-h-48 object-cover" />
                      <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold">✕</button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-4 px-4 transition-colors hover:bg-[var(--color-saffron-tint)]"
                           style={{ borderColor: "var(--color-line)" }}>
                      <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-muted)" }}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      <span className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                        {lang === "te" ? "ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి" : lang === "hi" ? "फोटो लें या अपलोड करें" : "Take or upload a photo"}
                      </span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setPhoto(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!form.details.trim()) { setErrors((e) => ({ ...e, details: true })); return; }
                    setErrors({});
                    goNext();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-lg text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "var(--color-saffron)", boxShadow: "var(--elev-saffron)" }}
                >
                  Continue <Icon.arrow className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-7">
                <BackBtn onClick={goBack} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-green-text)" }}>Last step</div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight" style={{ color: "var(--color-ink)" }}>
                    How do we reach you?
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <Field
                  label={lang === "te" ? "మీ పేరు" : lang === "hi" ? "आपका नाम" : "Your name"}
                  error={errors.name}
                  hint={lang === "te" ? "అవసరం" : lang === "hi" ? "आवश्यक है" : "Required"}
                >
                  <input
                    className={inputCls(errors.name)}
                    value={form.name}
                    onChange={set("name")}
                    placeholder={lang === "te" ? "పూర్తి పేరు" : lang === "hi" ? "पूरा नाम" : "Full name"}
                    autoComplete="name"
                  />
                </Field>

                <Field
                  label={lang === "te" ? "మొబైల్ నంబర్" : lang === "hi" ? "मोबाइल नंबर" : "Mobile number"}
                  error={errors.phone}
                  hint={lang === "te" ? "సరైన 10-అంకెల నంబర్ ఇవ్వండి" : lang === "hi" ? "10-अंक का वैध नंबर दें" : "Enter a valid 10-digit number"}
                >
                  <input
                    className={inputCls(errors.phone)}
                    value={form.phone}
                    onChange={set("phone")}
                    inputMode="tel"
                    placeholder="+91 9xxxxxxxxx"
                    autoComplete="tel"
                  />
                </Field>

                <Field
                  label={lang === "te" ? "మీ చిరునామా" : lang === "hi" ? "आपका पता" : "Your address / location"}
                  error={errors.location}
                  hint={lang === "te" ? "అవసరం" : lang === "hi" ? "आवश्यक है" : "Required"}
                >
                  <div className="flex gap-2">
                    <input
                      className={inputCls(errors.location) + " flex-1"}
                      value={form.location}
                      onChange={set("location")}
                      placeholder="Road No. 12, Banjara Hills"
                    />
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
                      <span className="hidden sm:inline">{locating ? "Locating…" : "GPS"}</span>
                    </button>
                  </div>
                </Field>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={submit}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-lg text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-2"
                  style={{ background: "var(--color-saffron)", boxShadow: "var(--elev-saffron)" }}
                >
                  {submitting
                    ? (lang === "te" ? "సమర్పిస్తున్నాం…" : lang === "hi" ? "सबमिट हो रहा है…" : "Submitting…")
                    : (lang === "te" ? "కేస్ నంబర్ పొందండి" : lang === "hi" ? "केस नंबर पाएं" : t("sh.getNumber"))
                  }
                  {!submitting && <Icon.arrow className="w-5 h-5" />}
                </button>

                <p className="text-xs text-center" style={{ color: "var(--color-muted)" }}>
                  {lang === "te"
                    ? "మీ వివరాలు సురక్షితంగా ఉంటాయి. ఉచిత సేవ."
                    : lang === "hi"
                    ? "आपकी जानकारी सुरक्षित है। बिल्कुल मुफ़्त सेवा।"
                    : "Your details are kept private. This is a free service — no charges."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

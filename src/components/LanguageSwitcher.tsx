import { LANGS, useT } from "../lib/i18n";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useT();
  return (
    <div className={`inline-flex items-center rounded-full p-0.5 ${compact ? "" : "border"}`} style={{ background: "var(--color-saffron-tint)", borderColor: "var(--color-line)" }}>
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: active ? "var(--color-saffron)" : "transparent",
              color: active ? "#fff" : "var(--color-saffron-text)",
            }}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

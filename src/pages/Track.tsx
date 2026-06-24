import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import VerificationTimeline from "../components/VerificationTimeline";
import { Icon } from "../components/ui";
import { categoryLabel } from "../data/help";
import { useT } from "../lib/i18n";
import { getCase, STAGES, type Case } from "../lib/store";
import { useCMS } from "../contexts/CMSContext";

export default function Track() {
  const { t, lang } = useT();
  const { cms: { pages } } = useCMS();
  const [params, setParams] = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [result, setResult] = useState<Case | "none" | null>(null);
  const [searching, setSearching] = useState(false);

  const run = async (value: string) => {
    const v = value.trim();
    if (!v) return;
    setSearching(true);
    try {
      const c = await getCase(v);
      setResult(c ?? "none");
    } finally {
      setSearching(false);
    }
  };

  // auto-run if arriving with ?id=
  useEffect(() => {
    const q = params.get("id");
    if (q) run(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(id ? { id } : {});
    run(id);
  };

  return (
    <>
      <PageHeader eyebrow={pages.track.eyebrow} title={pages.track.title} subtitle={pages.track.subtitle} />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Icon.search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="RF-2026-...."
                className="w-full rounded-xl pl-11 pr-3 py-3 text-sm outline-none bg-white focus:border-[var(--color-saffron)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-saffron)_30%,transparent)]"
                style={{ border: "1px solid var(--color-line)" }}
              />
            </div>
            <button type="submit" disabled={searching} className="rounded-xl px-6 font-semibold text-white disabled:opacity-60" style={{ background: "var(--color-saffron)" }}>{searching ? "…" : t("tr.button")}</button>
          </form>

          {result === "none" && (
            <div className="mt-6 rounded-2xl p-5 text-sm" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}>
              {t("tr.notFound")}
            </div>
          )}

          {result && result !== "none" && (
            <div className="mt-8 rounded-3xl p-6 sm:p-8 card">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6" style={{ borderBottom: "1px solid var(--color-line)" }}>
                <div>
                  <div className="font-display font-extrabold text-lg">{result.id}</div>
                  <div className="text-sm" style={{ color: "var(--color-muted)" }}>
                    {result.type === "help" ? categoryLabel(result.category, lang) : result.category} · {result.location}
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: result.stageIndex >= 4 ? "var(--color-green)" : "var(--color-saffron)" }}>
                  {t("tr.stageNow")}: {STAGES[result.stageIndex][lang]}
                </span>
              </div>
              <VerificationTimeline c={result} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

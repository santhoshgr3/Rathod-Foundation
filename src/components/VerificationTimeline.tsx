import { STAGES, type Case } from "../lib/store";
import { useT } from "../lib/i18n";
import { Icon } from "./ui";

/** Shows the 5 verification stages with the case's current position. */
export default function VerificationTimeline({ c }: { c: Case }) {
  const { lang } = useT();
  return (
    <ol className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-line)]">
      {STAGES.map((s, i) => {
        const done = i < c.stageIndex;
        const current = i === c.stageIndex;
        const entry = c.timeline.find((t) => t.stage === s.key);
        const label = s[lang];
        const isResolvedGuided = s.key === "resolved" && c.outcome === "guided";
        return (
          <li key={s.key} className="relative pl-9">
            <span
              className="absolute left-0 top-0 grid place-items-center w-6 h-6 rounded-full text-white"
              style={{
                background: done ? "var(--color-green)" : current ? "var(--color-saffron)" : "#d9d9d9",
                boxShadow: "0 0 0 4px #fff",
              }}
            >
              {done ? <Icon.check className="w-3.5 h-3.5" sw={3} /> : <span className="text-[11px] font-bold">{i + 1}</span>}
            </span>
            <div className={current ? "font-semibold" : done ? "" : "opacity-55"}>
              {isResolvedGuided ? `${label} · guided to govt office` : label}
            </div>
            {entry && (
              <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                {new Date(entry.at).toLocaleDateString()} {entry.note ? `· ${entry.note}` : ""}
              </div>
            )}
            {current && !entry && (
              <div className="text-xs mt-0.5" style={{ color: "var(--color-saffron-text)" }}>In progress</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

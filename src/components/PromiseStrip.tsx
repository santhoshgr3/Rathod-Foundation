import { useCMS } from "../contexts/CMSContext";
import { Icon } from "./ui";

export default function PromiseStrip() {
  const { cms: { promises } } = useCMS();
  const items = [...promises, ...promises];
  return (
    <div className="relative py-4 overflow-hidden select-none" style={{ background: "var(--color-saffron)", color: "#fff" }}>
      <div className="ticker-track">
        {items.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-7 font-semibold text-sm sm:text-base">
            <Icon.check className="w-5 h-5" sw={2.6} />
            {p}
            <span className="opacity-50 pl-4">★</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20" style={{ background: "linear-gradient(to right, var(--color-saffron), transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20" style={{ background: "linear-gradient(to left, var(--color-saffron), transparent)" }} />
    </div>
  );
}

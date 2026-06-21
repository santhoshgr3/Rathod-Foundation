import { useState } from "react";
import { useCMS } from "../contexts/CMSContext";
import { Icon, Reveal, SectionHead } from "./ui";

// Hand-placed coordinates (viewBox 0..1000 x 0..640) approximating the
// Banjara Hills road layout. Positions are illustrative, not survey-accurate.
const points: Record<string, { x: number; y: number }> = {
  "Road No. 12": { x: 340, y: 250 },
  "N.B. Nagar": { x: 470, y: 330 },
  "Road No. 10": { x: 560, y: 210 },
  "MLA Colony": { x: 670, y: 360 },
  "Journalist Colony": { x: 250, y: 410 },
  "Road No. 14": { x: 410, y: 150 },
  "Shri Nagar Colony": { x: 760, y: 250 },
};

export default function BanjaraMap() {
  const { cms: { wards } } = useCMS();
  const [active, setActive] = useState<string | null>("Road No. 12");
  const max = Math.max(...wards.map((w) => w.count));
  const activeWard = wards.find((w) => w.name === active);

  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Visual impact map"
          title={<>The footprint across <span style={{ color: "var(--color-saffron-text)" }}>Banjara Hills</span>.</>}
          intro="Tap a marker to see the work in that locality. Bigger markers mean more issues resolved there."
        />

        <Reveal>
          <div className="mt-12 rounded-3xl overflow-hidden card relative">
            <svg viewBox="0 0 1000 640" className="w-full h-auto block">
              <defs>
                <radialGradient id="land" cx="45%" cy="40%" r="75%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#fff8f0" />
                </radialGradient>
                <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              <rect width="1000" height="640" fill="url(#land)" />

              {/* KBR park / green lung */}
              <ellipse cx="640" cy="130" rx="180" ry="90" fill="#138808" opacity="0.16" />
              <text x="640" y="135" textAnchor="middle" fill="#0f7406" fontSize="15" fontWeight="700" opacity="0.85" fontFamily="Sora">KBR PARK</text>
              <ellipse cx="230" cy="540" rx="120" ry="60" fill="#138808" opacity="0.12" />
              <text x="230" y="545" textAnchor="middle" fill="#0f7406" fontSize="12" fontWeight="600" opacity="0.8" fontFamily="Sora">Banjara Lake</text>

              {/* abstract road network */}
              <g stroke="#e2c9ad" strokeWidth="4" fill="none" opacity="0.9">
                <path d="M60 300 Q300 230 520 250 T980 300" />
                <path d="M120 120 Q280 260 360 460 T520 600" />
                <path d="M880 110 Q700 260 660 400 T700 600" />
                <path d="M40 460 Q300 420 560 440 T980 430" />
                <path d="M420 60 Q460 280 470 420 T500 600" />
              </g>
              <g fill="#b79b7d" fontSize="12" fontFamily="Plus Jakarta Sans" fontWeight="600">
                <text x="90" y="290">Road No. 1</text>
                <text x="850" y="470">Road No. 3</text>
                <text x="120" y="445">Rd 12 Main</text>
              </g>

              {/* markers */}
              {wards.map((w) => {
                const p = points[w.name];
                if (!p) return null;
                const r = 9 + (w.count / max) * 16;
                const isActive = active === w.name;
                return (
                  <g key={w.name} style={{ cursor: "pointer" }} onMouseEnter={() => setActive(w.name)} onClick={() => setActive(w.name)}>
                    <circle cx={p.x} cy={p.y} r={r} fill="#ff9933" opacity={isActive ? 0.3 : 0.16} filter="url(#soft)">
                      <animate attributeName="r" values={`${r};${r + 8};${r}`} dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={p.x} cy={p.y} r={r} fill={isActive ? "#ff9933" : "#138808"} stroke="#ffffff" strokeWidth="2.5" />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={r > 16 ? 13 : 10} fontWeight="800" fill="#ffffff" fontFamily="Sora">{w.count}</text>
                    <text x={p.x} y={p.y + r + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={isActive ? "#d4660a" : "#5c5c5c"} fontFamily="Plus Jakarta Sans">{w.name}</text>
                  </g>
                );
              })}

              {/* compass */}
              <g transform="translate(940 70)" opacity="0.6">
                <circle r="22" fill="none" stroke="#e2c9ad" strokeWidth="2" />
                <path d="M0 -16 L5 4 L0 -2 L-5 4 Z" fill="#ff9933" />
                <text x="0" y="-26" textAnchor="middle" fill="#b79b7d" fontSize="11" fontWeight="700">N</text>
              </g>
            </svg>

            {activeWard && (
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 rounded-2xl p-5 w-[15rem] bg-white" style={{ border: "1px solid var(--color-saffron)", boxShadow: "0 12px 30px rgba(16,24,40,0.12)" }}>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-saffron-text)" }}>
                  <Icon.pin className="w-4 h-4" /> Banjara Hills
                </div>
                <div className="font-display font-bold text-lg mt-1">{activeWard.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold" style={{ color: "var(--color-green-text)" }}>{activeWard.count}</span>
                  <span className="text-sm" style={{ color: "var(--color-muted)" }}>issues resolved</span>
                </div>
              </div>
            )}
          </div>
        </Reveal>
        <p className="text-xs mt-3" style={{ color: "var(--color-muted)" }}>Map is an illustrative schematic of Banjara Hills localities, not a survey-accurate map.</p>
      </div>
    </section>
  );
}

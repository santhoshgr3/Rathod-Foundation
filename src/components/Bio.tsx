import { useCMS } from "../contexts/CMSContext";
import { chairman } from "../data/content";
import { Icon, Reveal, SectionHead } from "./ui";

const valueIcons = { shield: Icon.shield, clock: Icon.clock, users: Icon.users };

export default function Bio() {
  const { cms: { bio, leader } } = useCMS();
  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="About Dhanraj Rathod"
          title={<>Two decades on the <span style={{ color: "var(--color-saffron-text)" }}>same streets</span>.</>}
          intro={bio.intro}
        />

        <div className="mt-14 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
          <Reveal>
            <div className="space-y-5">
              <div className="rounded-3xl overflow-hidden card" style={{ background: "var(--color-saffron-tint)" }}>
                <img src={leader.photos.candid} alt={leader.name} className="w-full h-auto block" />
              </div>
              <div className="rounded-3xl p-6 space-y-3.5 text-sm card">
                <Fact k="Born" v={leader.dob} />
                <Fact k="Community" v={leader.community} />
                <Fact k="Languages" v={leader.languages.join(", ")} />
                <Fact k="Based in" v={leader.location} />
                <Fact k="Role" v={leader.role} />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="font-display font-bold text-xl mb-7">The journey of service</h3>
            </Reveal>
            <ol className="relative space-y-7 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-[var(--color-line)]">
              {bio.journey.map((j, i) => (
                <Reveal key={j.year} delay={i * 0.08}>
                  <li className="relative pl-8">
                    <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full" style={{ background: "var(--color-saffron)", boxShadow: "0 0 0 4px #fff, 0 0 0 5px var(--color-line)" }} />
                    <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--color-saffron-text)" }}>{j.year}</div>
                    <div className="font-semibold mt-0.5">{j.title}</div>
                    <div className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-muted)" }}>{j.detail}</div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {bio.values.map((v, i) => {
                const I = valueIcons[v.icon as keyof typeof valueIcons];
                const green = i === 1;
                return (
                  <Reveal key={v.title} delay={i * 0.08}>
                    <div className="rounded-2xl p-5 h-full card">
                      <div className="grid place-items-center w-10 h-10 rounded-xl mb-3" style={{ background: green ? "var(--color-green-tint)" : "var(--color-saffron-tint)", color: green ? "var(--color-green-text)" : "var(--color-saffron-text)" }}>
                        <I className="w-5 h-5" />
                      </div>
                      <div className="font-semibold">{v.title}</div>
                      <div className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-muted)" }}>{v.text}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Chairman card ── */}
        <Reveal>
          <div className="mt-16 rounded-3xl overflow-hidden grid sm:grid-cols-[1fr_2fr] items-center card">
            <div className="w-full h-64 sm:h-full bg-[var(--color-saffron-tint)] flex items-center justify-center overflow-hidden">
              <img
                src={chairman.photo}
                alt={chairman.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="p-7 sm:p-10 space-y-4">
              <span className="eyebrow" style={{ color: "var(--color-saffron-text)" }}>{chairman.role}</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl leading-tight">{chairman.name}</h3>
              <p className="text-sm font-medium" style={{ color: "var(--color-green-text)" }}>{chairman.affiliation}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{chairman.bio}</p>
              <ul className="space-y-1.5 pt-1">
                {chairman.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-saffron)" }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* recognition strip with CM photo */}
        <Reveal>
          <div className="mt-16 rounded-3xl overflow-hidden grid sm:grid-cols-[1fr_1.4fr] items-center card">
            <img src={leader.photos.withCM} alt="Dhanraj Rathod with community leaders" className="w-full h-64 sm:h-full object-cover" />
            <div className="p-7 sm:p-10">
              <span className="eyebrow" style={{ color: "var(--color-saffron-text)" }}>Trusted by leadership</span>
              <p className="font-display text-xl sm:text-2xl font-bold mt-3 leading-snug">
                Working hand-in-hand with officials and the community to get Banjara Hills
                the attention — and the action — it deserves.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0" style={{ color: "var(--color-muted)" }}>{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

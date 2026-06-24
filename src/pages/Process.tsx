import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import HowItWorks from "../components/HowItWorks";
import { Icon, Reveal, SectionHead } from "../components/ui";
import { useCMS } from "../contexts/CMSContext";

const workflow = [
  { t: "Citizen submits application", d: "Online, by WhatsApp, by phone, or in person.", icon: Icon.doc },
  { t: "Application receives a tracking ID", d: "Instantly — so you can follow it anytime.", icon: Icon.search },
  { t: "Local volunteer visits the location", d: "A neighbour from your ward, not a stranger.", icon: Icon.pin },
  { t: "Volunteer uploads photos & findings", d: "Real evidence, recorded against your case.", icon: Icon.check },
  { t: "Foundation reviews the case", d: "We confirm what's needed and the fastest route.", icon: Icon.shield },
  { t: "Assistance is provided or you're guided", d: "Direct help, or hand-held to the right govt office.", icon: Icon.hand },
  { t: "Status is updated online", d: "You're told the moment anything changes.", icon: Icon.bell },
];

export default function Process() {
  const { cms: { pages } } = useCMS();
  const p = pages.process;
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

      {/* the 7-step verification workflow */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead
            eyebrow="Volunteer verification system"
            title={<>Seven steps, fully <span style={{ color: "var(--color-saffron-text)" }}>transparent</span>.</>}
            intro="This is how every help request is handled — the same way, every time."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflow.map((s, i) => {
              const I = s.icon;
              return (
                <Reveal key={s.t} delay={(i % 4) * 0.07}>
                  <div className="relative rounded-3xl p-6 h-full card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="grid place-items-center w-11 h-11 rounded-xl" style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)" }}><I className="w-6 h-6" /></span>
                      <span className="font-display text-4xl font-extrabold" style={{ color: "var(--color-saffron-tint)" }}>{i + 1}</span>
                    </div>
                    <h3 className="font-display font-bold leading-snug">{s.t}</h3>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--color-muted)" }}>{s.d}</p>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={0.2}>
              <Link to="/seek-help" className="rounded-3xl p-6 h-full flex flex-col justify-center items-start text-white transition-transform hover:-translate-y-1" style={{ background: "var(--color-green)" }}>
                <Icon.hand className="w-8 h-8 mb-3" />
                <h3 className="font-display font-bold text-lg">Start a request</h3>
                <p className="text-sm mt-1 text-white/85">It takes two minutes.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-sm">Seek help <Icon.arrow className="w-4 h-4" /></span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* short 4-step + contact channels (reused) */}
      <HowItWorks />
    </>
  );
}

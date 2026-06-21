import { useCMS } from "../contexts/CMSContext";
import { Icon, Reveal, SectionHead } from "./ui";

export default function HowItWorks() {
  const { cms: { leader, steps } } = useCMS();
  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="How it works"
          title={<>From complaint to <span style={{ color: "var(--color-saffron-text)" }}>closed</span>, in four steps.</>}
          intro="No runaround, no lost paperwork. Here's exactly what happens after you reach out."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative rounded-3xl p-6 h-full overflow-hidden card">
                <div className="font-display text-6xl font-extrabold absolute -top-2 right-3" style={{ color: "var(--color-saffron-tint)" }}>{s.n}</div>
                <div className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--color-saffron-text)" }}>Step {s.n}</div>
                <h3 className="font-display font-bold text-lg mt-2">{s.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--color-muted)" }}>{s.text}</p>
                <div className="mt-4 h-1 w-10 rounded-full" style={{ background: i % 2 ? "var(--color-green)" : "var(--color-saffron)" }} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <ContactCard icon={<Icon.phone className="w-5 h-5" />} label="Call the help desk" value={leader.phones[0]} href={`tel:${leader.phones[0].replace(/\s/g, "")}`} sub={leader.phones[1]} />
            <ContactCard icon={<Icon.chat className="w-5 h-5" />} label="WhatsApp a photo" value="Message us" href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent("Hello Rathod Foundation, I'd like to report a civic issue in Banjara Hills.")}`} sub="Fastest way to reach us" accent />
            <ContactCard icon={<Icon.pin className="w-5 h-5" />} label="Visit the office" value="N.B. Nagar, Road No. 12" href={`https://www.google.com/maps/search/${encodeURIComponent(leader.location)}`} sub="Banjara Hills, Hyderabad" green />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactCard({
  icon, label, value, href, sub, accent = false, green = false,
}: { icon: React.ReactNode; label: string; value: string; href: string; sub: string; accent?: boolean; green?: boolean }) {
  const filled = accent || green;
  const bg = accent ? "var(--color-saffron)" : green ? "var(--color-green)" : "#fff";
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`group rounded-2xl p-5 flex items-start gap-4 transition-transform hover:-translate-y-1 ${filled ? "" : "card"}`}
      style={filled ? { background: bg, color: "#fff" } : undefined}
    >
      <span className="grid place-items-center w-11 h-11 rounded-xl shrink-0" style={{ background: filled ? "rgba(255,255,255,0.22)" : "var(--color-saffron-tint)", color: filled ? "#fff" : "var(--color-saffron-text)" }}>
        {icon}
      </span>
      <div>
        <div className="text-xs" style={{ color: filled ? "rgba(255,255,255,0.85)" : "var(--color-muted)" }}>{label}</div>
        <div className="font-semibold mt-0.5">{value}</div>
        <div className="text-xs mt-0.5" style={{ color: filled ? "rgba(255,255,255,0.8)" : "var(--color-muted)" }}>{sub}</div>
      </div>
    </a>
  );
}

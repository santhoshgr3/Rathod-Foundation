import { Link } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { Icon } from "./ui";

export default function Footer() {
  const { cms: { leader } } = useCMS();
  return (
    <footer className="relative pt-16 pb-10 bg-white" style={{ borderTop: "1px solid var(--color-line)" }}>
      <div className="tricolor-rule absolute top-0 inset-x-0" style={{ borderRadius: 0, height: 4 }} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-sm" style={{ background: "var(--color-saffron)", color: "#fff" }}>RF</span>
              <span className="font-display font-bold text-lg">{leader.org}</span>
            </div>
            <p className="mt-4 text-sm max-w-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>{leader.tagline} Led by {leader.name}, {leader.role}.</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Reach us</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
              {leader.phones.map((p) => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-[color:var(--color-saffron-text)]"><Icon.phone className="w-4 h-4" />{p}</a></li>
              ))}
              <li><a href={`mailto:${leader.email}`} className="inline-flex items-center gap-2 hover:text-[color:var(--color-saffron-text)]"><Icon.mail className="w-4 h-4" />{leader.email}</a></li>
              <li className="flex items-start gap-2"><Icon.pin className="w-4 h-4 mt-0.5 shrink-0" /><span>{leader.location}</span></li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <h4 className="font-semibold text-sm mb-3">Get help</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
                {[["/seek-help", "Seek help"], ["/track", "Track status"], ["/report", "Report an issue"], ["/dashboard", "Dashboard"]].map(([h, l]) => (
                  <li key={h}><Link to={h} className="hover:text-[color:var(--color-saffron-text)]">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Foundation</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
                {[["/about", "About"], ["/work", "Work done"], ["/impact", "Impact & map"], ["/process", "How it works"], ["/volunteer", "Get involved"]].map(([h, l]) => (
                  <li key={h}><Link to={h} className="hover:text-[color:var(--color-saffron-text)]">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs" style={{ color: "var(--color-muted)", borderTop: "1px solid var(--color-line)" }}>
          <span>© {new Date().getFullYear()} {leader.org}. All rights reserved.</span>
          <span>Serving Banjara Hills, Hyderabad · Built for the people.</span>
        </div>
      </div>
    </footer>
  );
}

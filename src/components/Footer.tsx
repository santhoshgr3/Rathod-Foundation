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

        {/* Share strip */}
        <div className="mt-10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: "var(--color-green-tint)", border: "1px solid var(--color-green)" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--color-green-text)" }}>🤝 Know someone who needs help?</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Share this platform with your neighbours, family, and community.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Rathod Foundation — free community help in Banjara Hills. Report issues, get help, track your case: https://rathodfoundation.in")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm text-white"
              style={{ background: "var(--color-green)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2C6.477 2 2 6.477 2 12.003c0 1.77.46 3.432 1.267 4.876L2 22l5.273-1.237A9.947 9.947 0 0 0 12.003 22C17.523 22 22 17.523 22 12.003S17.523 2 12.003 2zm0 18.117a8.1 8.1 0 0 1-4.136-1.13l-.296-.177-3.13.734.771-3.033-.193-.312A8.095 8.095 0 0 1 3.883 12c0-4.483 3.64-8.117 8.12-8.117 4.48 0 8.117 3.634 8.117 8.117 0 4.48-3.637 8.117-8.117 8.117z"/></svg>
              Share on WhatsApp
            </a>
            <a
              href="/qr"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm"
              style={{ background: "var(--color-saffron-tint)", color: "var(--color-saffron-text)", border: "1px solid var(--color-saffron)" }}
            >
              🖨️ Print QR
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs" style={{ color: "var(--color-muted)", borderTop: "1px solid var(--color-line)" }}>
          <span>© {new Date().getFullYear()} {leader.org}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Serving Banjara Hills, Hyderabad · Built for the people.</span>
            <Link to="/admin" className="opacity-40 hover:opacity-100 transition-opacity underline underline-offset-2">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

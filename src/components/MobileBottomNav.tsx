import { NavLink } from "react-router-dom";
import { useCMS } from "../contexts/CMSContext";
import { Icon } from "./ui";

function WaIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.003 2C6.477 2 2 6.477 2 12.003c0 1.77.46 3.432 1.267 4.876L2 22l5.273-1.237A9.947 9.947 0 0 0 12.003 22C17.523 22 22 17.523 22 12.003S17.523 2 12.003 2zm0 18.117a8.1 8.1 0 0 1-4.136-1.13l-.296-.177-3.13.734.771-3.033-.193-.312A8.095 8.095 0 0 1 3.883 12c0-4.483 3.64-8.117 8.12-8.117 4.48 0 8.117 3.634 8.117 8.117 0 4.48-3.637 8.117-8.117 8.117z" />
    </svg>
  );
}

const tabs = [
  { to: "/", end: true, label: "Home", icon: Icon.home },
  { to: "/seek-help", end: false, label: "Seek Help", icon: Icon.hand },
  { to: "/track", end: false, label: "Track", icon: Icon.search },
] as const;

export default function MobileBottomNav() {
  const { cms: { leader } } = useCMS();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t"
      style={{
        borderColor: "var(--color-line)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -2px 20px rgba(16,24,40,0.08)",
      }}
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map(({ to, end, label, icon: I }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <div
                className="flex flex-col items-center justify-center gap-0.5 h-full"
                style={{ color: isActive ? "var(--color-saffron-text)" : "var(--color-muted)" }}
              >
                <span
                  className="grid place-items-center w-10 h-7 rounded-full transition-colors duration-150"
                  style={{ background: isActive ? "var(--color-saffron-tint)" : "transparent" }}
                >
                  <I className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </div>
            )}
          </NavLink>
        ))}

        <a
          href={`https://wa.me/${leader.whatsapp}?text=${encodeURIComponent("Hello! I need help from Rathod Foundation, Banjara Hills.")}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: "#25D366" }}
        >
          <span className="grid place-items-center w-10 h-7 rounded-full">
            <WaIcon />
          </span>
          <span className="text-[10px] font-semibold leading-none">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}

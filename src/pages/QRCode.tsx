import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { useCMS } from "../contexts/CMSContext";

const SITE_URL = "https://rathodfoundation.in"; // update when domain is live

export default function QRCodePage() {
  const { cms: { leader } } = useCMS();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Print button — hidden when printing */}
      <button
        onClick={handlePrint}
        className="no-print mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
        style={{ background: "var(--color-saffron)" }}
      >
        🖨️ Print this page
      </button>

      {/* Printable card */}
      <div
        ref={printRef}
        className="w-full max-w-sm rounded-3xl border-4 p-8 text-center space-y-5"
        style={{ borderColor: "var(--color-saffron)" }}
      >
        {/* Tricolor stripe top */}
        <div className="flex h-2 rounded-full overflow-hidden mb-2">
          <div className="flex-1" style={{ background: "var(--color-saffron)" }} />
          <div className="flex-1 bg-white border-y border-gray-200" />
          <div className="flex-1" style={{ background: "var(--color-green)" }} />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="grid place-items-center w-10 h-10 rounded-xl font-display font-extrabold text-base text-white" style={{ background: "var(--color-saffron)" }}>RF</span>
          <span className="font-display font-bold text-xl">{leader.org}</span>
        </div>

        <p className="font-bold text-lg leading-snug" style={{ color: "var(--color-ink)" }}>
          Need help? <br />
          <span style={{ color: "var(--color-saffron-text)" }}>Scan this QR code</span>
        </p>

        {/* Telugu */}
        <p className="text-base font-semibold" style={{ color: "var(--color-muted)" }}>
          సహాయం కావాలా? స్కాన్ చేయండి
        </p>

        {/* Hindi */}
        <p className="text-base font-semibold" style={{ color: "var(--color-muted)" }}>
          मदद चाहिए? स्कैन करें
        </p>

        {/* QR Code */}
        <div className="flex justify-center py-2">
          <div className="p-3 rounded-2xl border-2" style={{ borderColor: "var(--color-saffron)" }}>
            <QRCodeSVG
              value={SITE_URL}
              size={200}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
              level="H"
            />
          </div>
        </div>

        <div className="text-sm font-semibold break-all" style={{ color: "var(--color-saffron-text)" }}>
          {SITE_URL}
        </div>

        {/* Phone numbers — big and clear */}
        <div className="rounded-2xl p-4 space-y-2" style={{ background: "var(--color-saffron-tint)" }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Or call us directly</div>
          {leader.phones.map((p) => (
            <div key={p} className="font-display font-extrabold text-xl" style={{ color: "var(--color-saffron-text)" }}>
              📞 {p}
            </div>
          ))}
        </div>

        <div className="text-xs" style={{ color: "var(--color-muted)" }}>
          Free service · 24-hour response · Banjara Hills
        </div>

        {/* Tricolor stripe bottom */}
        <div className="flex h-2 rounded-full overflow-hidden mt-2">
          <div className="flex-1" style={{ background: "var(--color-saffron)" }} />
          <div className="flex-1 bg-white border-y border-gray-200" />
          <div className="flex-1" style={{ background: "var(--color-green)" }} />
        </div>
      </div>

      <p className="no-print mt-6 text-sm text-center max-w-xs" style={{ color: "var(--color-muted)" }}>
        Print this and paste it on walls, tea shops, auto stands, and notice boards in your area so everyone can access help easily.
      </p>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}

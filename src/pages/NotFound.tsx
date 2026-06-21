import { Link } from "react-router-dom";
import { Icon } from "../components/ui";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] grid place-items-center bg-white px-5 pt-24">
      <div className="text-center">
        <div className="font-display font-extrabold text-7xl" style={{ color: "var(--color-saffron-text)" }}>404</div>
        <div className="tricolor-rule w-28 mx-auto my-5" />
        <h1 className="font-display font-bold text-2xl">Page not found</h1>
        <p className="mt-2" style={{ color: "var(--color-muted)" }}>The page you're looking for isn't here.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold" style={{ background: "var(--color-saffron)", color: "#fff" }}>
          <Icon.arrow className="w-4 h-4 rotate-180" /> Back home
        </Link>
      </div>
    </section>
  );
}

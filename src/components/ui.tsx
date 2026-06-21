import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/** Fade-and-rise wrapper that triggers once on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Animated count-up that runs the first time it scrolls into view. */
export function CountUp({
  to,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/** Section eyebrow + heading block (light theme). */
export function SectionHead({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
      <Reveal>
        <span className="eyebrow" style={{ color: "var(--color-saffron-text)" }}>
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 leading-[1.05]" style={{ color: "var(--color-ink)" }}>
          {title}
        </h2>
      </Reveal>
      {center && (
        <div className="tricolor-rule w-28 mt-5" style={{ marginInline: "auto" }} />
      )}
      {intro && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Thin tricolor scroll-progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-saffron), var(--color-green))",
      }}
    />
  );
}

/**
 * Card wrapper with a cursor-following spotlight glow (spatial depth).
 * Polymorphic: pass `as={Link}` + `to=...` to make the whole card a link.
 */
type SpotlightProps = {
  as?: ElementType;
  glow?: "saffron" | "green";
  className?: string;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
export function SpotlightCard({
  as,
  glow = "saffron",
  className = "",
  children,
  ...rest
}: SpotlightProps) {
  const Comp = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const glowColor = glow === "green" ? "rgba(19,136,8,0.15)" : "rgba(255,153,51,0.17)";

  return (
    <Comp ref={ref} onMouseMove={onMove} className={`spotlight-card ${className}`} {...rest}>
      <span aria-hidden className="spotlight-glow" style={{ ["--glow" as string]: glowColor }} />
      <span className="relative z-[1] block h-full">{children}</span>
    </Comp>
  );
}

/** 3D perspective tilt that follows the cursor — for hero / feature imagery. */
export function TiltCard({
  children,
  className = "",
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 14 });
  const sry = useSpring(ry, { stiffness: 140, damping: 14 });
  // glare gradient derived from tilt — declared unconditionally (rules of hooks)
  const glare = useTransform(
    sry,
    [-max, max],
    [
      "radial-gradient(60% 60% at 0% 0%, rgba(255,255,255,0.5), transparent 70%)",
      "radial-gradient(60% 60% at 100% 0%, rgba(255,255,255,0.5), transparent 70%)",
    ]
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}

export const Icon = {
  shield: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  clock: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  users: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8M17 13.5a5.5 5.5 0 0 1 3.5 5.5" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M4 5c0 8 7 15 15 15l1.5-3.5-4-2-1.8 1.6a12 12 0 0 1-5.4-5.4L11 9 9 5 5.5 5z" />
    </svg>
  ),
  chat: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M4 5h16v11H9l-5 4V5z" />
    </svg>
  ),
  pin: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  medical: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 .9-.2 1.7-.5 2.5" />
      <path d="M14 14h6M17 11v6" />
    </svg>
  ),
  book: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 1 2-2h12" />
    </svg>
  ),
  doc: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v4h4M9 13h6M9 17h6" />
    </svg>
  ),
  rupee: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8h6M9 11h6M9 8c3 0 4 6-1 6l4 3" />
    </svg>
  ),
  card: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  ),
  bolt: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  ),
  home: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </svg>
  ),
  elder: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="11" cy="5" r="2.2" />
      <path d="M11 9v7m0-4 4 2M11 16l-2 5m2-5 2 5M18 9v12" />
    </svg>
  ),
  hand: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M7 11V6a1.5 1.5 0 0 1 3 0v4m0-1V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 14a1.6 1.6 0 0 1 3-1.2" />
    </svg>
  ),
  grid: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  bell: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  ),
  megaphone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M18 9a4 4 0 0 1 0 6" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
};

type IconProps = { className?: string; stroke?: string; sw?: number; style?: CSSProperties };
function base(p: IconProps) {
  return {
    className: p.className ?? "w-6 h-6",
    stroke: p.stroke ?? "currentColor",
    strokeWidth: p.sw ?? 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: p.style,
  };
}

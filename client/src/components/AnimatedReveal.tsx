import { type CSSProperties, type ReactNode } from "react";

/**
 * AnimatedReveal — Drop-in Replacement für die häufigsten Framer-Motion-
 * Verwendungen in dieser App (Audit-Item #16). Nutzt `tw-animate-css` (schon
 * in index.css importiert) statt einer 80-KB-gz-Library.
 *
 * Reduced-Motion: die Tailwind/tw-animate-Klassen werden automatisch via
 * `@media (prefers-reduced-motion: reduce)` no-op'd (siehe motion-safe-
 * Variante in tw-animate-css). Vorher gemacht via <MotionConfig> in App.tsx.
 *
 * Beispiel:
 *   <AnimatedReveal slide="up" delay={0.1}>
 *     <h1>Hallo</h1>
 *   </AnimatedReveal>
 *
 * Migration-Mapping (Framer → AnimatedReveal):
 *   initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}     → slide="up"
 *   initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}    → slide="down"
 *   initial={{opacity:0, x:-15}} animate={{opacity:1, x:0}}    → slide="right"
 *   initial={{opacity:0, x:15}} animate={{opacity:1, x:0}}     → slide="left"
 *   initial={{opacity:0}} animate={{opacity:1}}                → slide=undefined
 *   transition={{delay:0.3}}                                   → delay={0.3}
 *   transition={{duration:0.5}}                                → duration={500}
 */

type Slide = "up" | "down" | "left" | "right";

type AnimatedRevealProps = {
  children: ReactNode;
  /** Slide-Richtung (von wo soll's hereinkommen). Default: kein Slide, nur Fade. */
  slide?: Slide;
  /** Delay in Sekunden (kompatibel zur Framer-Notation). Default: 0. */
  delay?: number;
  /** Dauer in Millisekunden. Default: 500. */
  duration?: number;
  /** Optionale Tailwind-Klassen am Wrapper. */
  className?: string;
  /** Inline-Style passthrough, wird mit Animation-CSS gemergt. */
  style?: CSSProperties;
  /** Element-Tag. Default: div. */
  as?: "div" | "section" | "article" | "header" | "nav" | "li" | "p" | "span";
};

const slideClass: Record<Slide, string> = {
  // Werte (~16-20px) entsprechen der originalen Framer-Distanz aus der App.
  up: "slide-in-from-bottom-4",
  down: "slide-in-from-top-4",
  left: "slide-in-from-right-4",
  right: "slide-in-from-left-4",
};

export function AnimatedReveal({
  children,
  slide,
  delay = 0,
  duration = 500,
  className,
  style,
  as: Tag = "div",
}: AnimatedRevealProps) {
  const animClass = ["animate-in", "fade-in", slide ? slideClass[slide] : null]
    .filter(Boolean)
    .join(" ");

  const animStyle: CSSProperties = {
    ...style,
    animationDuration: `${duration}ms`,
    animationFillMode: "both",
    ...(delay > 0 ? { animationDelay: `${delay * 1000}ms` } : {}),
  };

  return (
    <Tag className={className ? `${animClass} ${className}` : animClass} style={animStyle}>
      {children}
    </Tag>
  );
}

/**
 * CollapseReveal — Drop-in für Framer-Motion `<AnimatePresence>` mit
 * `height: 0 → auto` Patterns. Nutzt den `grid-template-rows: 0fr → 1fr`
 * Trick (modernes CSS, alle aktuellen Browser): das innere div hat
 * effektiv `height: auto` aber wird vom grid-row auf 0 geclippt.
 *
 * Verwendung:
 *   <CollapseReveal open={expanded} id="panel-1">
 *     <div className="…">expand-content</div>
 *   </CollapseReveal>
 *
 * Vorher (Framer):
 *   <AnimatePresence>
 *     {open && (
 *       <motion.div
 *         initial={{ height: 0, opacity: 0 }}
 *         animate={{ height: "auto", opacity: 1 }}
 *         exit={{ height: 0, opacity: 0 }}
 *         transition={{ duration: 0.2 }}
 *       >
 *         <div>…</div>
 *       </motion.div>
 *     )}
 *   </AnimatePresence>
 */
type CollapseRevealProps = {
  open: boolean;
  children: ReactNode;
  id?: string;
  /** Dauer in Millisekunden. Default: 200 (matched Framer-Original). */
  duration?: number;
  className?: string;
};

export function CollapseReveal({
  open,
  children,
  id,
  duration = 200,
  className,
}: CollapseRevealProps) {
  // `inert` (statt `aria-hidden`) wenn collapsed: der Content bleibt für die
  // CSS-Animation im DOM gemountet, aber `inert` macht den ganzen Subtree
  // un-fokussierbar UND für Assistive Tech unsichtbar — ohne den
  // `aria-hidden-focus`-WCAG-Verstoß (aria-hidden + fokussierbare Kinder).
  // Framers <AnimatePresence> unmountete den Content; der grid-collapse-Trick
  // nicht, daher ist `inert` hier essentiell. React 19 unterstützt das
  // `inert`-Boolean-Prop nativ.
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity] ease-out motion-reduce:transition-none ${className ?? ""}`}
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
      inert={!open}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}

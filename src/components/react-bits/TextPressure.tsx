"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type IdleMode = "none" | "wave" | "pulse";

export interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean | number;
  radius?: number;
  smoothing?: number;
  idle?: IdleMode;
  idleSpeed?: number;
  clickRipple?: boolean;
  textColor?: string;
  pressureColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
  letterGap?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Ripple extends Point {
  start: number;
}

interface PressureOptions {
  width: boolean;
  weight: boolean;
  italic: boolean;
  alpha: boolean;
  radius: number;
  smoothing: number;
  idle: IdleMode;
  idleSpeed: number;
  clickRipple: boolean;
  textColor: string;
  pressureColor: string;
}

interface AppliedStyle {
  span: HTMLSpanElement;
  settings: string;
  fillColor: string;
  strokeVal: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const RIPPLE_LIFE = 1.3;
const MAX_RIPPLES = 6;
const WAVE_PERIOD = 3.2;
const PULSE_PERIOD = 2.8;
const PULSE_DEPTH = 0.42;

// Initial / resting state: THIN condensed outline letters
const RESTING_WDTH = 25; // ultra-condensed slender
const RESTING_WGHT = 100; // hairline thin

// Broad active state under cursor:
const MAX_WDTH = 151; // ultra-broad expanded
const MAX_WGHT = 1000; // massive bold block

const dist = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getIdlePressure = (
  mode: IdleMode,
  position: number,
  clock: number,
  spread: number
) => {
  if (mode === "wave") {
    const crest =
      0.5 + 0.5 * Math.cos(Math.PI * 2 * (position / spread - clock / WAVE_PERIOD));
    return crest * crest;
  }
  if (mode === "pulse") {
    const lag = Math.abs(position - 0.5) * 0.4;
    const breath = 0.5 - 0.5 * Math.cos(Math.PI * 2 * (clock / PULSE_PERIOD - lag));
    return PULSE_DEPTH * breath * breath * (3 - 2 * breath);
  }
  return 0;
};

const getRipplePressure = (
  ripples: Ripple[],
  point: Point,
  now: number,
  span: number
) => {
  const band = Math.max(span * 0.14, 32);
  let total = 0;
  for (const ripple of ripples) {
    const age = (now - ripple.start) / 1000;
    if (age <= 0 || age >= RIPPLE_LIFE) continue;
    const offset = (dist(ripple, point) - age * span * 1.25) / band;
    if (offset <= -1 || offset >= 1) continue;
    const fade = 1 - age / RIPPLE_LIFE;
    const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / 0.06);
    total = 1 - (1 - total) * (1 - swell);
  }
  return total;
};

export default function TextPressure({
  text = "DUSYANTH",
  fontFamily = "Roboto Flex Variable",

  width = true,
  weight = true,
  italic = false,
  alpha = false,

  flex = true,
  scale = false as boolean | number,

  radius = 0.45,
  smoothing = 0.35,

  idle = "none",
  idleSpeed = 1.0,
  clickRipple = true,

  textColor = "#F2EFE7",
  pressureColor = "",
  strokeColor = "rgba(242, 239, 231, 0.95)",
  strokeWidth = 1.8,
  className = "",

  minFontSize = 32,
  maxFontSize = 240,
  letterGap = "0.025em",
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const wakeRef = useRef<(() => void) | null>(null);
  const visibleRef = useRef(true);
  const ripplesRef = useRef<Ripple[]>([]);
  const optionsRef = useRef<PressureOptions>({
    width,
    weight,
    italic,
    alpha,
    radius,
    smoothing,
    idle,
    idleSpeed,
    clickRipple,
    textColor,
    pressureColor,
  });

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point & { seen: boolean }>({ x: 0, y: 0, seen: false });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);

  const chars = Array.from(text);

  useEffect(() => {
    optionsRef.current = {
      width,
      weight,
      italic,
      alpha,
      radius,
      smoothing,
      idle,
      idleSpeed,
      clickRipple,
      textColor,
      pressureColor,
    };
    wakeRef.current?.();
  }, [
    width,
    weight,
    italic,
    alpha,
    radius,
    smoothing,
    idle,
    idleSpeed,
    clickRipple,
    textColor,
    pressureColor,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const wake = () => wakeRef.current?.();
    const track = (x: number, y: number) => {
      cursor.x = x;
      cursor.y = y;
      cursor.seen = true;
      wake();
    };
    const handleMouseMove = (e: MouseEvent) => track(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    };
    const handleLeave = () => {
      cursor.seen = false;
      wake();
    };
    const handlePress = (e: PointerEvent) => {
      if (!optionsRef.current.clickRipple || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ripples = ripplesRef.current;
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      wake();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("touchend", handleLeave);
    window.addEventListener("touchcancel", handleLeave);
    window.addEventListener("scroll", wake, { passive: true, capture: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.fonts?.addEventListener?.("loadingdone", wake);
    container?.addEventListener("pointerdown", handlePress);

    if (container) {
      // Initially, position virtual mouse far away so letters start thin
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      cursor.x = -9999;
      cursor.y = -9999;
      cursor.seen = false;
    }

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) wake();
    });
    if (container) observer.observe(container);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", handleLeave);
      window.removeEventListener("touchcancel", handleLeave);
      window.removeEventListener("scroll", wake, { capture: true });
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.fonts?.removeEventListener?.("loadingdone", wake);
      container?.removeEventListener("pointerdown", handlePress);
      observer.disconnect();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const { width: containerW, height: containerH } =
        container.getBoundingClientRect();
      if (containerW <= 0) return;

      const rawFontSize = containerW / (chars.length * 0.64);
      const nextFontSize = Math.min(Math.max(rawFontSize, minFontSize), maxFontSize);
      setFontSize(nextFontSize);

      let nextScaleY = 1;
      if (typeof scale === "number") {
        nextScaleY = scale;
      } else if (scale && containerH > 0) {
        nextScaleY = Math.max(containerH / nextFontSize, 1.3);
      }
      setScaleY(nextScaleY);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [chars.length, minFontSize, maxFontSize, scale]);

  useEffect(() => {
    const title = titleRef.current;
    const container = containerRef.current;
    if (!title || !container) return;

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const applied: AppliedStyle[] = [];
    let rafId = 0;
    let last = 0;
    let idleFrames = 0;
    let clock = 0;

    const tick = (now: number) => {
      rafId = 0;
      const elapsed = last ? Math.min(now - last, 64) : 1000 / 60;
      last = now;

      const options = optionsRef.current;
      const idleMode: IdleMode =
        (options.idle === "wave" || options.idle === "pulse") &&
        !motionQuery?.matches
          ? options.idle
          : "none";
      const mouse = mouseRef.current;
      const cursor = cursorRef.current;
      const lag = 1000 * options.smoothing * options.smoothing;
      const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
      mouse.x += (cursor.x - mouse.x) * follow;
      mouse.y += (cursor.y - mouse.y) * follow;

      const idling = idleMode !== "none";
      if (idling) clock += (elapsed / 1000) * options.idleSpeed;

      const ripples = ripplesRef.current;
      while (ripples.length && now - ripples[0].start > RIPPLE_LIFE * 1000)
        ripples.shift();

      const titleRect = title.getBoundingClientRect();
      const maxDist = Math.max(titleRect.width * options.radius, 1);
      const spread = Math.max(options.radius * 2, 0.2);
      const spans = spansRef.current;
      const centers = spans.map((span) => {
        if (!span) return null;
        const rect = span.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });

      let changed = false;
      let anyActive = false;

      spans.forEach((span, i) => {
        const center = centers[i];
        if (!span || !center) return;

        // Proximity calculation from cursor to character center
        let pressure = 0;
        if (cursor.seen && !motionQuery?.matches) {
          const rawDist = dist(mouse, center);
          pressure = clamp01(1 - rawDist / maxDist);
          // Sharpen curve so letters broaden punchily under cursor
          pressure = Math.pow(pressure, 1.25);
        }

        if (idling) {
          const position =
            (center.x - titleRect.left) / Math.max(titleRect.width, 1);
          const resting = getIdlePressure(idleMode, position, clock, spread);
          pressure = resting + (pressure - resting) * (cursor.seen ? 1 : 0.4);
        }

        if (ripples.length) {
          const swell = getRipplePressure(ripples, center, now, titleRect.width);
          pressure = 1 - (1 - pressure) * (1 - swell);
        }

        if (pressure > 0.01) anyActive = true;

        // When pressure = 0: THIN initially (RESTING_WDTH: 25, RESTING_WGHT: 100)
        // When cursor moves on it (pressure -> 1): BECOMES BROADER (MAX_WDTH: 151, MAX_WGHT: 1000)
        const wdth = options.width
          ? Math.round(RESTING_WDTH + (MAX_WDTH - RESTING_WDTH) * pressure)
          : RESTING_WDTH;
        const wght = options.weight
          ? Math.round(RESTING_WGHT + (MAX_WGHT - RESTING_WGHT) * pressure)
          : RESTING_WGHT;

        // Outline-to-solid transition:
        // Thin state: outline stroke with translucent fill
        // Broad state under cursor: solid warm-white #F2EFE7
        const fillAlpha = Math.min(1, Math.max(0.25, pressure * 1.3));
        const currentStrokeWidth = Math.max(0, strokeWidth * (1 - pressure * 0.9));

        let fillColor: string;
        if (fillAlpha >= 0.95) {
          fillColor = options.textColor;
        } else {
          fillColor = `rgba(242, 239, 231, ${fillAlpha.toFixed(3)})`;
        }

        const strokeVal =
          currentStrokeWidth > 0.2
            ? `${currentStrokeWidth.toFixed(1)}px ${strokeColor}`
            : "0px transparent";

        const italVal = options.italic ? pressure.toFixed(2) : "0";
        const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}, 'opsz' 144`;
        const previous = applied[i];

        if (
          !previous ||
          previous.span !== span ||
          previous.settings !== settings ||
          previous.fillColor !== fillColor ||
          previous.strokeVal !== strokeVal
        ) {
          span.style.fontVariationSettings = settings;
          span.style.color = fillColor;
          span.style.webkitTextStroke = strokeVal;
          applied[i] = { span, settings, fillColor, strokeVal };
          changed = true;
        }
      });

      const moving =
        cursor.seen &&
        (Math.abs(cursor.x - mouse.x) > 0.1 || Math.abs(cursor.y - mouse.y) > 0.1);
      const animating = moving || anyActive || idling || ripples.length > 0;
      idleFrames = animating ? 0 : idleFrames + 1;

      if (animating || (changed && idleFrames < 40))
        rafId = requestAnimationFrame(tick);
      else last = 0;
    };

    const wake = () => {
      if (!rafId && visibleRef.current) rafId = requestAnimationFrame(tick);
    };

    wakeRef.current = wake;
    wake();

    return () => {
      cancelAnimationFrame(rafId);
      wakeRef.current = null;
    };
  }, [strokeColor, strokeWidth]);

  useEffect(() => {
    wakeRef.current?.();
  }, [fontSize, scaleY, text, flex, fontFamily]);

  const titleStyle = {
    fontFamily: `"${fontFamily}", sans-serif`,
    fontSize: `${fontSize}px`,
    lineHeight: 0.9,
    transform: `scale(1, ${scaleY})`,
    transformOrigin: "left center",
    fontWeight: RESTING_WGHT,
    color: textColor,
    letterSpacing: "-0.01em",
    gap: letterGap,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-transparent overflow-visible select-none ${className}`}
    >
      <style>{`


        .tp-char-transition {
          will-change: font-variation-settings, color, -webkit-text-stroke;
          transition: transform 0.08s ease-out;
        }
      `}</style>
      <h1
        ref={titleRef}
        aria-label={text}
        className={`text-pressure-title m-0 w-full uppercase whitespace-nowrap select-none cursor-pointer ${
          flex ? "flex justify-between items-center" : "inline-flex items-center"
        }`}
        style={titleStyle}
      >
        <span className="sr-only">{text}</span>
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            aria-hidden="true"
            className="tp-char-transition inline-block"
            style={{
              fontFamily: `"${fontFamily}", sans-serif`,
              fontVariationSettings: `'wght' ${RESTING_WGHT}, 'wdth' ${RESTING_WDTH}, 'opsz' 144`,
              color: "rgba(242, 239, 231, 0.25)",
              WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}

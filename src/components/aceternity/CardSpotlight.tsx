"use client";
import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { usePointerMotion } from "@/lib/usePointerMotion";

interface CardSpotlightProps extends HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  children: React.ReactNode;
}

/** Local Aceternity-style surface. Pointer coordinates never enter React state. */
export function CardSpotlight({ children, radius = 220, color = "var(--surface-spotlight)", className, style, onPointerMove, onPointerLeave, ...props }: CardSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  const enabled = usePointerMotion();
  useEffect(() => {
    if (!enabled) ref.current?.style.setProperty("--spotlight-active", "0");
    return () => { cancelAnimationFrame(frame.current); frame.current = 0; };
  }, [enabled]);
  return <div {...props} ref={ref} className={cn("card-spotlight", className)}
    style={{ "--spotlight-radius": `${radius}px`, "--spotlight-color": color, ...style } as CSSProperties}
    onPointerMove={event => {
      onPointerMove?.(event);
      if (!enabled || event.pointerType !== "mouse") return;
      point.current = { x: event.clientX, y: event.clientY };
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spotlight-x", `${point.current.x - rect.left}px`);
        el.style.setProperty("--spotlight-y", `${point.current.y - rect.top}px`);
        el.style.setProperty("--spotlight-active", "1");
      });
    }}
    onPointerLeave={event => {
      cancelAnimationFrame(frame.current); frame.current = 0;
      ref.current?.style.setProperty("--spotlight-active", "0");
      onPointerLeave?.(event);
    }}>
    <span className="spotlight-light" aria-hidden="true" />
    <div className="spotlight-content">{children}</div>
  </div>;
}

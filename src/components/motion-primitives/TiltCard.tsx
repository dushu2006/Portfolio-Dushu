"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePointerMotion } from "@/lib/usePointerMotion";
import { interactionSpring } from "@/lib/motion";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  tiltFactor?: number;
  glareEnable?: boolean;
  holographicSheen?: boolean;
  accentColor?: string;
}

/** Motion owns only this inner surface's transform; its scroll rail belongs to GSAP. */
export function TiltCard({ children, className, tiltFactor = 4, glareEnable = false, holographicSheen = false, accentColor = "var(--cyan-glow-alpha)", style, onPointerMove, onPointerLeave, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = usePointerMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const springX = useSpring(x, interactionSpring), springY = useSpring(y, interactionSpring);
  const rotateX = useTransform(springY, [-.5, .5], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(springX, [-.5, .5], [-tiltFactor, tiltFactor]);
  const glare = useTransform([springX, springY], ([gx, gy]) => `radial-gradient(circle at ${(Number(gx) + .5) * 100}% ${(Number(gy) + .5) * 100}%, ${accentColor}, transparent 70%)`);
  useEffect(() => { if (!enabled) { x.set(0); y.set(0); } }, [enabled, x, y]);
  return <motion.div {...props} ref={ref} data-tilt-surface
    className={cn("tilt-surface relative", className)}
    style={{ ...style, rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0, transformPerspective: enabled ? 900 : 0 }}
    onPointerMove={event => {
      onPointerMove?.(event);
      if (!enabled || event.pointerType !== "mouse" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set(Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5)));
      y.set(Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5)));
    }}
    onPointerLeave={event => { x.set(0); y.set(0); onPointerLeave?.(event); }}>
    {children}
    {enabled && (glareEnable || holographicSheen) && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{ background: glare }} />}
  </motion.div>;
}

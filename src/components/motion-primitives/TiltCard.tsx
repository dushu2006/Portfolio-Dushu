"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLMotionProps } from "framer-motion";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  tiltFactor?: number;
  glareEnable?: boolean;
  holographicSheen?: boolean;
  accentColor?: string;
}

export function TiltCard({
  children,
  className,
  tiltFactor = 10,
  glareEnable = true,
  holographicSheen = true,
  accentColor,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Responsive spring physics for organic motion
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 24 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? [0, 0] : [tiltFactor, -tiltFactor]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? [0, 0] : [-tiltFactor, tiltFactor]
  );

  // Glare position (maps -0.5..0.5 to percentage across the card)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  // Calculate dynamic sheen angle based on mouse coordinates
  const [sheenAngle, setSheenAngle] = useState(135);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mousePxX = e.clientX - rect.left;
    const mousePxY = e.clientY - rect.top;

    const normX = mousePxX / width - 0.5;
    const normY = mousePxY / height - 0.5;

    x.set(normX);
    y.set(normY);

    // Compute angle from center
    const angleRad = Math.atan2(normY, normX);
    const angleDeg = Math.round(angleRad * (180 / Math.PI)) + 90;
    setSheenAngle(angleDeg);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl transition-shadow duration-300 ease-out will-change-transform select-none",
        hovered
          ? "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(153,207,222,0.15)]"
          : "shadow-2xl",
        className
      )}
      {...props}
    >
      {/* 3D Elevated Content Layer */}
      <div
        className="relative z-10 h-full w-full"
        style={{
          transform: prefersReducedMotion ? "none" : "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>

      {/* 
        Holographic Prismatic Iridescent Sheen Layer:
        Sweeps across the card reflecting subtle spectral highlights
      */}
      {holographicSheen && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-500 overflow-hidden mix-blend-color-dodge"
          style={{
            opacity: hovered ? 0.65 : 0,
            background: `linear-gradient(${sheenAngle}deg, 
              rgba(255, 60, 120, 0) 0%, 
              rgba(255, 80, 160, 0.18) 18%, 
              rgba(255, 190, 60, 0.22) 36%, 
              rgba(60, 240, 200, 0.24) 52%, 
              rgba(80, 180, 255, 0.22) 68%, 
              rgba(190, 90, 255, 0.18) 84%, 
              rgba(190, 90, 255, 0) 100%)`,
          }}
        />
      )}

      {/* 
        Specular Light Glare Physics Layer:
        Radial highlight that tracks directly with the cursor
      */}
      {glareEnable && !prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 overflow-hidden mix-blend-overlay"
          style={{
            opacity: hovered ? 0.45 : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.15) 35%, transparent 70%)`
            ),
          }}
        />
      )}

      {/* Specular Perimeter Edge Reflection */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 border border-white/20"
          style={{
            opacity: hovered ? 0.9 : 0,
            boxShadow: accentColor
              ? `inset 0 0 20px ${accentColor}30, 0 0 15px ${accentColor}40`
              : "inset 0 0 16px rgba(255, 255, 255, 0.12)",
          }}
        />
      )}
    </motion.div>
  );
}

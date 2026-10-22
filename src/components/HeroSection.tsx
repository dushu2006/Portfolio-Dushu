"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

import TextPressure from "@/components/react-bits/TextPressure";
import { assetPath } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const naturalContainerRef = useRef<HTMLDivElement>(null);
  const lensRingRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const supportingContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Dual-Layer Portrait Spotlight Reveal interaction
  const updateSpotlight = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current;
    const naturalContainer = naturalContainerRef.current;
    const lensRing = lensRingRef.current;
    if (!stage || !naturalContainer || !lensRing) return;

    const rect = stage.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    naturalContainer.style.clipPath = `circle(135px at ${x}px ${y}px)`;
    naturalContainer.style.opacity = "1";

    lensRing.style.left = `${x}px`;
    lensRing.style.top = `${y}px`;
    lensRing.style.opacity = "1";
  }, []);

  const resetSpotlight = useCallback(() => {
    const naturalContainer = naturalContainerRef.current;
    const lensRing = lensRingRef.current;
    if (!naturalContainer || !lensRing) return;

    lensRing.style.opacity = "0";
    naturalContainer.style.clipPath = "circle(0px at 50% 50%)";
    naturalContainer.style.opacity = "0";
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e: MouseEvent) =>
      updateSpotlight(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      updateSpotlight(touch.clientX, touch.clientY);
    };

    stage.addEventListener("mousemove", handleMouseMove);
    stage.addEventListener("mouseleave", resetSpotlight);
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("touchend", resetSpotlight);

    return () => {
      stage.removeEventListener("mousemove", handleMouseMove);
      stage.removeEventListener("mouseleave", resetSpotlight);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", resetSpotlight);
    };
  }, [updateSpotlight, resetSpotlight]);

  // GSAP ScrollTrigger Pinned Scene & Initial Entrance
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const nameEl = nameContainerRef.current;
    const supportingEl = supportingContentRef.current;
    const overlay = overlayRef.current;

    if (!section || !stage || !nameEl || !supportingEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (typeof window !== "undefined" && !(window as unknown as { __portfolioLogged?: boolean }).__portfolioLogged) {
        (window as unknown as { __portfolioLogged?: boolean }).__portfolioLogged = true;
        console.log(
          "%c✦ DUSYANTH TANNA — DEVELOPER & AI EXPLORER ✦\n%cLooking under the hood? Feel free to connect for collabs at dushyanthtanna@gmail.com",
          "color: #99CFDE; font-size: 14px; font-weight: bold; background: #0B0C10; padding: 6px 12px; border-radius: 6px; border: 1px solid #8E343B;",
          "color: #F2EFE7; font-size: 11px; padding: 4px;"
        );
      }

      // 1. Initial Load Reveal Timeline
      const loadTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set([nameEl, stage, supportingEl], { opacity: 1 });
        },
      });

      loadTl
        .fromTo(
          nameEl,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0, delay: 0.1 }
        )
        .fromTo(
          stage,
          { opacity: 0, scale: 0.96, y: 25 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1 },
          "-=0.7"
        )
        .fromTo(
          supportingEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.7"
        );

      // 2. Cinematic Pinned Hero: Hero stays stationary while About section scrolls upward over it
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${section.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Subtle atmospheric dimming as the foreground About sheet covers the stationary hero
      if (overlay) {
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-10 w-full h-screen min-h-[720px] bg-[#0B0C10] flex flex-col justify-start overflow-hidden select-none ambient-glow-mesh pt-24 sm:pt-28"
    >
      {/* Dimming overlay as About slides over */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#0B0C10] pointer-events-none z-30 opacity-0 will-change-[opacity]"
      />

      {/* Ambient background grid */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-20" />

      {/* Monumental Watermark placed faintly in background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-hidden select-none opacity-[0.055] pr-6">
        <span className="font-editorial text-[clamp(10rem,28vw,26rem)] leading-none text-white tracking-tighter uppercase font-bold">
          DUSHU
        </span>
      </div>

      {/* Main Layout Container */}
      <div className="pointer-events-none relative z-20 max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 w-full flex-1 flex flex-col justify-start">
        
        {/* ========================================================= */}
        {/* GROUP 1: OVERWHELMINGLY DOMINANT NAME STATEMENT           */}
        {/* ========================================================= */}
        <div
          ref={nameContainerRef}
          className="hero-name pointer-events-auto w-full flex flex-col items-start text-left z-20 pt-2 lg:pt-4"
        >
          {/* Futuristic Cinematic Kinetic Variable-Font Typography — Expanded Vertically */}
          <div className="hero-title-box w-full max-w-[540px] sm:max-w-[650px] md:max-w-[760px] lg:max-w-[860px] xl:max-w-[960px] 2xl:max-w-[1040px] h-[110px] sm:h-[145px] md:h-[185px] lg:h-[220px] xl:h-[255px] 2xl:h-[280px] relative flex items-center justify-start drop-shadow-[0_0_35px_rgba(153,207,222,0.3)]">
            <TextPressure
              text="DUSYANTH"
              fontFamily="Roboto Flex Variable"
              flex={true}
              width={true}
              weight={true}
              italic={false}
              stroke={true}
              textColor="#F2EFE7"
              strokeColor="rgba(242, 239, 231, 0.95)"
              idle="none"
              radius={0.5}
              smoothing={0.28}
              clickRipple={true}
              scale={1.38}
              minFontSize={42}
              maxFontSize={220}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* GROUP 2: COMPACT SUPPORTING CONTENT GROUP                 */}
        {/* Tight, deliberate spacing connected to the composition   */}
        {/* ========================================================= */}
        <div
          ref={supportingContentRef}
          className="hero-support pointer-events-auto w-full max-w-lg sm:max-w-xl lg:max-w-xl flex flex-col items-start gap-4 sm:gap-5 text-left z-20 mt-6 sm:mt-8 lg:mt-10"
        >
          {/* Subtitle */}
          <p className="font-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#99CFDE] font-normal flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#356BCE] shadow-[0_0_12px_#356BCE] ring-4 ring-[#356BCE]/20 animate-pulse shrink-0" />
            <span>Developer. AI explorer. Builder.</span>
          </p>

          {/* Core Introduction Bio */}
          <p className="text-sm sm:text-base lg:text-lg text-white/75 font-normal leading-relaxed max-w-lg">
            AI &amp; Data Science student at Vignan&apos;s Institute of Information
            Technology. Exploring autonomous systems, multi-agent workflows,
            computer-vision diagnostics, and high-performance developer tooling.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-[#8E343B] hover:bg-[#a63d45] border border-transparent hover:border-[#ff7875]/40 text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(142,52,59,0.4)] hover:shadow-[0_0_30px_rgba(142,52,59,0.7)] group active:scale-95"
            >
              <span>Selected Work (10)</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#99CFDE]/60 hover:shadow-[0_0_24px_rgba(153,207,222,0.3)] text-white text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md active:scale-95 group"
            >
              <span>About &amp; Journey</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#99CFDE]/60 group-hover:bg-[#99CFDE] group-hover:scale-125 transition-all" />
            </a>
          </div>

          {/* Onboarding Wayfinding Cue */}
          <div className="hidden sm:flex items-center gap-3 text-white/40 font-mono text-[11px] tracking-widest uppercase pt-4 sm:pt-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E343B] animate-pulse" />
            <span>Scroll to explore cinematic journey</span>
            <span className="w-8 h-[1px] bg-white/20" />
          </div>
        </div>

      </div>

      {/* 
        Shared responsive portrait:
        Refined dimensions anchored flush to the bottom-right corner.
        Preserves sharp rectangular boundary and binary scan reveal lens.
      */}
      <div className="hero-portrait absolute right-0 bottom-0 z-10 w-[430px] xl:w-[490px] 2xl:w-[560px] aspect-[1161/1355] pointer-events-auto">
        {/* Studio Lighting: Soft diffused blue/cyan glow on the LEFT side of the portrait */}
        <div className="pointer-events-none absolute -left-28 top-1/4 w-[360px] h-[400px] rounded-full bg-[#356BCE]/30 blur-[130px] z-0" />
        <div className="pointer-events-none absolute -left-14 top-1/3 w-[220px] h-[260px] rounded-full bg-[#99CFDE]/20 blur-[90px] z-0" />

        {/* Studio Lighting: Soft diffused red glow on the RIGHT side of the portrait */}
        <div className="pointer-events-none absolute -right-12 top-1/4 w-[340px] h-[380px] rounded-full bg-[#8E343B]/35 blur-[120px] z-0" />
        <div className="pointer-events-none absolute right-4 top-1/3 w-[220px] h-[260px] rounded-full bg-[#FF4D4F]/20 blur-[80px] z-0" />

        {/* Interactive Dual-Layer Stage with Sharp Rectangular Edges */}
        <div
          ref={stageRef}
          className="relative z-10 w-full h-full cursor-crosshair group"
          id="hero-portrait-stage"
        >
          {/* Layer 1: Natural portrait (base layer) */}
          <Image
            src={assetPath("/images/hero-side-front.png")}
            alt="Dusyanth photographic profile"
            fill
            className="object-contain object-bottom pointer-events-none "
            priority
            sizes="(max-width: 600px) min(56vw, 245px), (max-width: 1023px) min(45vw, 300px), (max-height: 760px) 64svh, (max-width: 1279px) 430px, (max-width: 1535px) 490px, 560px"
          />

          {/* Layer 2: Binary scan, clipped to the cursor-following circular lens */}
          <div
            ref={naturalContainerRef}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            id="hero-natural-container"
            style={{ clipPath: "circle(0px at 50% 50%)", opacity: 0 }}
          >
            <Image
              src={assetPath("/images/hero-side-scan.png")}
              alt=""
              fill
              className="object-contain object-bottom pointer-events-none"
              loading="eager"
              sizes="(max-width: 600px) min(56vw, 245px), (max-width: 1023px) min(45vw, 300px), (max-height: 760px) 64svh, (max-width: 1279px) 430px, (max-width: 1535px) 490px, 560px"
            />
          </div>

          {/* Glowing Lens Ring Follower */}
          <div
            ref={lensRingRef}
            className="pointer-events-none absolute w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#99CFDE]/70 shadow-[0_0_35px_rgba(153,207,222,0.45)] opacity-0 transition-opacity duration-200"
            style={{ top: "50%", left: "50%" }}
          />
        </div>
      </div>
    </section>
  );
}

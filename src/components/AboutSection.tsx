"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, GraduationCap, Flame } from "lucide-react";
import { assetPath } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const bio = bioRef.current;
    const stats = statsRef.current;
    const imageContainer = imageContainerRef.current;

    if (!section || !heading || !bio || !stats || !imageContainer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // 1. Heading Reveal with ScrollTrigger
      gsap.fromTo(
        heading,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Left Column Bio & Stats Stagger
      gsap.fromTo(
        [bio, stats],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bio,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3. Cinematic Portrait Parallax / Scale
      gsap.fromTo(
        imageContainer,
        { opacity: 0, scale: 0.94, x: 30 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageContainer,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 w-full min-h-screen flex flex-col justify-center bg-[#EDE8DF] text-[#111215] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 transition-colors border-t border-[#DDD7CD] shadow-[0_-30px_70px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Typography Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            ref={headingRef}
            className="font-editorial text-[clamp(2.55rem,5.8vw,5.75rem)] leading-[1.08] tracking-tight font-normal text-[#111215]"
          >
            Curiosity starts it.
            <br />
            <span className="italic text-[#8E343B] underline decoration-1 underline-offset-8 decoration-[#8E343B]/30">
              Building makes it real.
            </span>
          </h2>
        </div>

        {/* Two Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Authentic Bio & Stats */}
          <div className="lg:col-span-6 flex flex-col gap-5 text-[#111215]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8E343B]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#111215]/60 font-semibold">
                ABOUT // CORE PHILOSOPHY
              </span>
            </div>

            <h3 className="font-editorial text-[1.65rem] sm:text-[2rem] leading-snug font-normal text-[#111215] max-w-xl">
              I like knowing how things work beneath the surface.
            </h3>

            <div
              ref={bioRef}
              className="space-y-4 text-[15px] sm:text-base leading-relaxed text-[#111215]/80 font-normal max-w-xl"
            >
              <p>
                I&apos;m Dusyanth, an AI &amp; Data Science student at
                Vignan&apos;s Institute of Information Technology. I&apos;m
                curious about how technology works underneath, and I enjoy
                turning ideas into projects through experimentation, engineering
                and hands-on building.
              </p>
              <div className="h-[1px] w-24 bg-[#111215]/20 my-2.5" />
              <p>
                My interests run across software development, AI and practical
                projects — from agents and retrieval to web apps and developer
                tools. I take part in hackathons and help organise events for my
                branch.
              </p>
            </div>

            {/* Polished Stat Chips Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-w-xl"
            >
              <div className="p-3 rounded-xl bg-white/80 border border-[#8E343B]/20 shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:shadow-[0_8px_24px_-6px_rgba(142,52,59,0.28)] hover:border-[#8E343B]/50 transition-all duration-300 cursor-default group">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-mono text-lg font-bold text-[#8E343B] group-hover:scale-105 transition-transform">
                    10+
                  </div>
                  <Award className="w-3.5 h-3.5 text-[#8E343B]/70 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#111215]/70 uppercase font-medium">
                  Hackathons Led
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-[#111215]/15 shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:shadow-[0_8px_24px_-6px_rgba(17,18,21,0.2)] hover:border-[#111215]/40 transition-all duration-300 cursor-default group">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-mono text-lg font-bold text-[#111215] group-hover:scale-105 transition-transform">
                    AI &amp; DS
                  </div>
                  <GraduationCap className="w-3.5 h-3.5 text-[#111215]/70 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#111215]/70 uppercase font-medium">
                  VIIT Undergraduate
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-[#356BCE]/20 shadow-sm col-span-2 sm:col-span-1 flex flex-col justify-between hover:scale-[1.03] hover:shadow-[0_8px_24px_-6px_rgba(53,107,206,0.28)] hover:border-[#356BCE]/50 transition-all duration-300 cursor-default group">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-mono text-lg font-bold text-[#356BCE] group-hover:scale-105 transition-transform">
                    DENVUP
                  </div>
                  <Flame className="w-3.5 h-3.5 text-[#356BCE]/70 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#111215]/70 uppercase font-medium">
                  Founding Member
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Editorial Portrait Tile */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-[430px] group"
            >
              {/* Inner Photo Tile */}
              <div className="relative w-full aspect-[1241/1267] overflow-hidden">
                <Image
                  src={assetPath("/images/about-straight.png")}
                  alt="Dusyanth Portrait"
                  fill
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                />
              </div>

              {/* Editorial Tile Caption Footer */}
              <div className="mt-2.5 px-1 pb-0.5 flex items-center justify-between font-mono text-[11px] text-[#111215]/65">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E343B]" />
                  <span className="font-semibold text-[#111215] tracking-wider uppercase">
                    DUSYANTH // VIIT
                  </span>
                </div>
                <span className="tracking-widest uppercase text-[10px] text-[#111215]/50">
                  UNDERGRADUATE &amp; BUILDER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

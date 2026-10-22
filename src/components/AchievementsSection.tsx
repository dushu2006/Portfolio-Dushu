"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Trophy, Users, ShieldCheck, Flame, Sparkles, Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AchievementItem {
  id: string;
  number: string;
  mainHeading: string;
  secondaryLabel: string;
  badge?: string;
  headline: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  bgGradient: string;
  cardBorder: string;
  icon: typeof Trophy;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "samartha",
    number: "01",
    mainHeading: "1ST PRIZE",
    secondaryLabel: "SAMARTHA",
    badge: "VIIT COMP",
    headline: "1st Place Laureate. Computational automation built under 36 hours.",
    description:
      "Engineered an automated computational workflow solution beating out 50+ university teams under strict algorithmic benchmarks.",
    accentColor: "#ff4d4f",
    badgeBg: "bg-[#ff4d4f]/15",
    badgeText: "text-[#ff7875]",
    bgGradient: "from-[#200b0f] via-[#12080a] to-[#0a0506]",
    cardBorder: "border-[#ff4d4f]/30",
    icon: Trophy,
  },
  {
    id: "hackmatrix",
    number: "02",
    mainHeading: "2ND PRIZE",
    secondaryLabel: "HACKMATRIX",
    badge: "REGIONAL LEVEL",
    headline: "High-performance autonomous agents and distributed systems.",
    description:
      "Awarded second place across regional competitors for deploying resilient AI agents with real-time state orchestration.",
    accentColor: "#e65100",
    badgeBg: "bg-[#ff9800]/15",
    badgeText: "text-[#ffb74d]",
    bgGradient: "from-[#241203] via-[#140b02] to-[#0c0602]",
    cardBorder: "border-[#ff9800]/30",
    icon: Flame,
  },
  {
    id: "denvup",
    number: "03",
    mainHeading: "CO-FOUNDER",
    secondaryLabel: "DENVUP",
    badge: "STUDENT NETWORK",
    headline: "Building the next-gen student tech incubator & developer network.",
    description:
      "Co-founded and scaled student developer infrastructure, hosting hack sessions, mentorship syncs, and collaborative product sprints.",
    accentColor: "#ff0055",
    badgeBg: "bg-[#ff0055]/15",
    badgeText: "text-[#ff6699]",
    bgGradient: "from-[#290514] via-[#16030b] to-[#090104]",
    cardBorder: "border-[#ff0055]/30",
    icon: Sparkles,
  },
  {
    id: "hackathon-experience",
    number: "04",
    mainHeading: "10+ HACKATHONS",
    secondaryLabel: "HACKATHON EXPERIENCE",
    badge: "TEAM LEAD",
    headline: "Participated in 10+ hackathons, serving as team lead in all of them.",
    description:
      "Spearheaded multi-developer engineering squads across 10+ intense hackathons, serving as team lead and lead architect in all of them with zero downtime.",
    accentColor: "#2979ff",
    badgeBg: "bg-[#2979ff]/15",
    badgeText: "text-[#82b1ff]",
    bgGradient: "from-[#08182b] via-[#040e1b] to-[#02070d]",
    cardBorder: "border-[#2979ff]/30",
    icon: Users,
  },
  {
    id: "first-year-lead",
    number: "05",
    mainHeading: "FIRST-YEAR LEAD",
    secondaryLabel: "STUDENT SPOT · VIIT",
    badge: "APPOINTED MENTOR",
    headline: "Direct liaison and technical mentor for incoming developers.",
    description:
      "Selected to onboard and guide junior cohorts at Student Spot VIIT, providing architectural code reviews and roadmap workshops.",
    accentColor: "#00e5ff",
    badgeBg: "bg-[#00e5ff]/15",
    badgeText: "text-[#84ffff]",
    bgGradient: "from-[#042426] via-[#021314] to-[#010808]",
    cardBorder: "border-[#00e5ff]/30",
    icon: Award,
  },
  {
    id: "event-lead",
    number: "06",
    mainHeading: "EVENT ORGANIZING LEAD",
    secondaryLabel: "AI & DS CLUB",
    badge: "DIRECTOR",
    headline: "Conducted department-wide AI hackathons and code masterclasses.",
    description:
      "Orchestrated departmental innovation challenges, authoring problem statements, running jury evaluations, and hands-on workshops.",
    accentColor: "#7c4dff",
    badgeBg: "bg-[#7c4dff]/15",
    badgeText: "text-[#b388ff]",
    bgGradient: "from-[#1b0e36] via-[#0f0720] to-[#07030e]",
    cardBorder: "border-[#7c4dff]/30",
    icon: ShieldCheck,
  },
];

export default function AchievementsSection() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const header = headerRef.current;
    if (!pinWrap) return;

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const totalCards = cards.length;
    if (totalCards === 0) return;

    // Apply positions along the upward-convex arch
    const applyPositions = (progress: number, isDesktop: boolean) => {
      const currentProgress = progress * (totalCards - 1);

      // Y base centers the card deck gracefully inside the viewport stage
      const yBase = isDesktop ? 25 : 15;
      const xDist = isDesktop ? 620 : 340;
      const yCurvature = isDesktop ? 60 : 42;
      const rotFactor = isDesktop ? 16 : 12;

      cards.forEach((card, i) => {
        const offset = i - currentProgress;
        const x = offset * xDist;
        const y = yBase + Math.pow(offset, 2) * yCurvature;
        const rotation = offset * rotFactor - 2;
        const scale = Math.max(0.75, 1 - Math.abs(offset) * 0.08);
        const zIndex = Math.round(30 - Math.abs(offset) * 5);
        // Smooth opacity falloff prevents edge crowding and unwanted overflow
        const opacity = Math.max(0, 1 - Math.abs(offset) * 0.42);

        gsap.set(card, {
          x,
          y,
          rotation,
          scale,
          zIndex,
          opacity,
          pointerEvents: Math.abs(offset) < 1.2 ? "auto" : "none",
          transformOrigin: "center 75%",
        });
      });
    };

    applyPositions(0, window.innerWidth >= 768);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP (> 768px)
      mm.add("(min-width: 769px)", () => {
        const scrollDistPerCard = 600;
        const totalScroll = (totalCards - 1) * scrollDistPerCard;

        ScrollTrigger.create({
          trigger: pinWrap,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyPositions(self.progress, true);
          },
        });
      });

      // MOBILE (<= 768px)
      mm.add("(max-width: 768px)", () => {
        const scrollDistPerCard = 480;
        const totalScroll = (totalCards - 1) * scrollDistPerCard;

        ScrollTrigger.create({
          trigger: pinWrap,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyPositions(self.progress, false);
          },
        });
      });
    }, pinWrapRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="achievements" className="relative z-20 w-full bg-[#0A0B0E] border-b border-white/5 overflow-hidden">
      {/* Pinned inner wrapper prevents Next.js HMR removeChild errors */}
      <div
        ref={pinWrapRef}
        className="relative w-full h-screen min-h-[720px] flex flex-col justify-between pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 overflow-hidden select-none"
      >
        {/* Background Subtle Ambience */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />

        {/* Top Header Row — comfortably cleared below the floating navbar */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 sm:px-12 w-full z-40 pt-2 sm:pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-widest text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#ff4d4f] animate-pulse" />
              <span>06 VERIFIED RECOGNITIONS</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-white font-normal uppercase tracking-tight">
              Achievements &amp; Leadership
            </h2>
          </div>
        </div>

        {/* Main Semicircular Wheel Stage */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-visible">
          {ACHIEVEMENTS.map((card, index) => {
            const IconComp = card.icon;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute will-change-transform select-none cursor-grab active:cursor-grabbing pointer-events-auto"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                {/* Large rounded Huge Inc Style Card Tile */}
                <div
                  className={`relative w-[300px] h-[380px] sm:w-[420px] sm:h-[480px] md:w-[460px] md:h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] sm:rounded-[38px] p-7 sm:p-9 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${card.bgGradient} border ${card.cardBorder} shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-shadow duration-300`}
                >
                  {/* Subtle Inner Glow */}
                  <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40"
                    style={{ backgroundColor: card.accentColor }}
                  />

                  {/* Top Section: Main Heading (Award/Role) + Secondary Organization Label */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex-1 pr-2">
                      <h3 className="font-editorial text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-white uppercase drop-shadow-md leading-[1.1]">
                        {card.mainHeading}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span
                          className={`font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${card.badgeBg} ${card.badgeText} border border-white/10`}
                        >
                          {card.secondaryLabel}
                        </span>
                        {card.badge && (
                          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                            {card.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Icon Emblem */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shrink-0">
                      <IconComp
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: card.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Bottom Section: Headline & Description */}
                  <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                      {card.headline}
                    </p>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-md line-clamp-3">
                      {card.description}
                    </p>

                    {/* Bottom bar with card number */}
                    <div className="flex items-center justify-between pt-3.5 mt-1 border-t border-white/10 text-xs font-mono text-white/40">
                      <span className="tracking-widest uppercase text-[10px]">
                        VERIFIED MERIT
                      </span>
                      <span className="font-bold text-white/80">
                        {card.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}

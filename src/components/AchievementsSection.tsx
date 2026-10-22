"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Trophy, Users, ShieldCheck, Flame, Sparkles } from "lucide-react";

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
    headline: "First prize at Samartha.",
    description: "Recognition for a hackathon project.",
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
    headline: "Second prize at Hackmatrix.",
    description: "Recognition for a hackathon project.",
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
    headline: "Co-founding Denvup.",
    description: "Contributing to a digital agency as co-founder.",
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
    mainHeading: "HACKATHON TEAM LEAD",
    secondaryLabel: "10+ HACKATHONS",
    headline: "Building together under time constraints.",
    description: "Team leadership across hackathon projects.",
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
    headline: "First-year leadership at Student Spot.",
    description: "A student leadership role at VIIT.",
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
    headline: "Organizing for the AI & DS community.",
    description: "Helping organize branch events and activities.",
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
    const stage = pinWrapRef.current;
    if (!stage) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const position = (progress: number) => {
        const radius = stage.clientHeight * (stage.clientHeight < 500 ? .30 : innerWidth < 768 ? .43 : .46);
        const travel = progress * (cards.length - 1);
        cards.forEach((card, i) => {
          const offset = i - travel;
          const angle = Math.PI / 2 - offset * 1.05;
          const inArc = angle > -.15 && angle < Math.PI + .15;
          gsap.set(card, {
            x: Math.cos(angle) * Math.min(innerWidth * .65, radius * 1.65),
            y: -Math.sin(angle) * radius,
            rotation: offset * 12,
            scale: Math.max(.8, 1 - Math.abs(offset) * .1),
            opacity: inArc ? Math.max(0, 1 - Math.abs(offset) * .65) : 0,
            visibility: inArc ? "visible" : "hidden",
            zIndex: Math.round(30 - Math.abs(offset) * 5),
          });
        });
      };
      position(0);
      ScrollTrigger.create({ id: "achievement-wheel", trigger: stage, start: "top top", end: () => {
        const radius = stage.clientHeight * (stage.clientHeight < 500 ? .30 : innerWidth < 768 ? .43 : .46);
        const horizontalRadius = Math.min(innerWidth * .65, radius * 1.65);
        // Arc length per card plus the final 6% reading dwell (same .94 as position).
        return `+=${(cards.length - 1) * 1.05 * Math.hypot(horizontalRadius, radius) / Math.SQRT2 / .94}`;
      }, pin: true, invalidateOnRefresh: true,
        onUpdate: self => position(Math.min(1, self.progress / .94)), onRefresh: self => position(Math.min(1, self.progress / .94)),
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="achievements" className="relative z-20 w-full bg-[#0A0B0E] border-b border-white/5 overflow-hidden">
      {/* Pinned inner wrapper prevents Next.js HMR removeChild errors */}
      <div
        ref={pinWrapRef}
        className="achievement-stage relative w-full flex flex-col pt-20 overflow-hidden"
      >
        {/* Background Subtle Ambience */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />

        {/* Top Header Row — comfortably cleared below the floating navbar */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 sm:px-12 w-full z-40 pt-2 sm:pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-widest text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#ff4d4f] animate-pulse" />
              <span>06 / ACHIEVEMENTS & ROLES</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-white font-normal uppercase tracking-tight">
              Achievements &amp; Leadership
            </h2>
          </div>
        </div>

        {/* Main Semicircular Wheel Stage */}
        <div className="achievement-wheel absolute inset-0">
          {ACHIEVEMENTS.map((card, index) => {
            const IconComp = card.icon;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="achievement-position absolute will-change-transform select-none"
                style={{
                  left: "50%",
                  top: "100%",
                }}
              >
                {/* Large rounded Huge Inc Style Card Tile */}
                <div
                  className={`achievement-card relative w-[300px] h-[380px] sm:w-[420px] sm:h-[480px] md:w-[460px] md:h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] sm:rounded-[38px] p-7 sm:p-9 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${card.bgGradient} border ${card.cardBorder} shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-shadow duration-300`}
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
                        MILESTONE
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

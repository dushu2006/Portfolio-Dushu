"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Terminal,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
} from "lucide-react";
import { CardSpotlight } from "@/components/aceternity/CardSpotlight";
import { TiltCard } from "@/components/motion-primitives/TiltCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  index: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: string;
  categoryColor: string;
  hoverBorder: string;
  hoverShadow: string;
  hoverText: string;
  spotlightColor: string;
  liveUrl?: string;
  githubUrl?: string;
  flagship?: boolean;
}

const FEATURED_PROJECTS: Project[] = [
  {
    index: "01",
    name: "CrimeLink",
    subtitle: "AI-assisted criminal-network analysis",
    description:
      "Synthesizes real & synthetic case records to map intricate criminal networks, using automated entity co-occurrence graphs with human review verification protocols and evidence provenance tracking.",
    tags: ["Next.js", "Python", "NetworkX", "LLM Provenance"],
    category: "Flagship AI",
    categoryColor: "bg-[#8E343B]/30 text-[#ffb3b4] border-[#8E343B]/40",
    hoverBorder: "hover:border-[#8E343B]/80",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(142,52,59,0.35)]",
    hoverText: "group-hover:text-[#ffb3b4]",
    spotlightColor: "rgba(142, 52, 59, 0.28)",
    liveUrl: "https://crime-link-seven.vercel.app/",
    githubUrl: "https://github.com/dushu2006/CrimeLink",
    flagship: true,
  },
  {
    index: "02",
    name: "ARISE",
    subtitle: "Intelligent assistant & automation framework",
    description:
      "Contextual autonomous assistant built for dynamic tool invocation, multi-step agentic execution graphs, iterative self-correction, and integrated CLI/system tasks.",
    tags: ["Python", "LangChain", "Tool Calling", "AsyncIO"],
    category: "Autonomous Agents",
    categoryColor: "bg-[#356BCE]/20 text-[#afc6ff] border-[#356BCE]/30",
    hoverBorder: "hover:border-[#356BCE]/80",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(53,107,206,0.35)]",
    hoverText: "group-hover:text-[#afc6ff]",
    spotlightColor: "rgba(53, 107, 206, 0.25)",
    githubUrl: "https://github.com/dushu2006/ARISE",
  },
  {
    index: "03",
    name: "SmartPlant",
    subtitle: "IoT & computer-vision diagnostics",
    description:
      "Biometric agricultural telemetry pairing physical hardware soil and ambient monitors with custom trained computer-vision CNN models for instant crop pathology analysis.",
    tags: ["Computer Vision", "IoT Sensors", "TensorFlow", "Flask"],
    category: "IoT & Vision",
    categoryColor: "bg-[#00b0ff]/15 text-[#80d8ff] border-[#00b0ff]/30",
    hoverBorder: "hover:border-[#00b0ff]/80",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(0,176,255,0.35)]",
    hoverText: "group-hover:text-[#80d8ff]",
    spotlightColor: "rgba(0, 176, 255, 0.25)",
    githubUrl: "https://github.com/dushu2006/SmartPlant",
  },
  {
    index: "04",
    name: "DropZone",
    subtitle: "High-throughput localized P2P file transfer",
    description:
      "Zero-cloud localized transmission system powered by direct WebRTC data channels with chunked cryptographic hashing and cross-platform LAN auto-discovery.",
    tags: ["WebRTC", "Node.js", "WebSockets", "SHA-256"],
    category: "P2P Network",
    categoryColor: "bg-[#00e676]/15 text-[#69f0ae] border-[#00e676]/30",
    hoverBorder: "hover:border-[#00e676]/80",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(0,230,118,0.35)]",
    hoverText: "group-hover:text-[#69f0ae]",
    spotlightColor: "rgba(0, 230, 118, 0.22)",
    githubUrl: "https://github.com/dushu2006/DropZone",
  },
  {
    index: "05",
    name: "API Doctor",
    subtitle: "Automated health, load testing & validation",
    description:
      "Diagnostic CLI suite running automated OpenAPI spec schema linting, concurrent stress vectors, regression audits, and response contract validations.",
    tags: ["Python", "AsyncIO", "OpenAPI Spec", "Benchmarking"],
    category: "Dev Tools",
    categoryColor: "bg-[#ff9100]/15 text-[#ffb74d] border-[#ff9100]/30",
    hoverBorder: "hover:border-[#ff9100]/80",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(255,145,0,0.35)]",
    hoverText: "group-hover:text-[#ffb74d]",
    spotlightColor: "rgba(255, 145, 0, 0.25)",
    githubUrl: "https://github.com/dushu2006/API-DOCTOR",
  },
];

const ALL_CATALOG_PROJECTS = [
  {
    index: "01",
    category: "FLAGSHIP",
    color: "text-[#ffb3b4]",
    name: "CrimeLink",
    desc: "AI-assisted criminal network analysis with evidence provenance.",
    hoverBorder: "hover:border-[#8E343B]/60",
    githubUrl: "https://github.com/dushu2006/CrimeLink",
    liveUrl: "https://crime-link-seven.vercel.app/",
  },
  {
    index: "02",
    category: "AGENTS",
    color: "text-[#afc6ff]",
    name: "ARISE",
    desc: "Intelligent automation assistant & multi-agent execution framework.",
    hoverBorder: "hover:border-[#356BCE]/60",
    githubUrl: "https://github.com/dushu2006/ARISE",
  },
  {
    index: "03",
    category: "CV & IOT",
    color: "text-[#99CFDE]",
    name: "SmartPlant",
    desc: "Real-time edge telemetry with leaf pathology neural classification.",
    hoverBorder: "hover:border-[#99CFDE]/60",
    githubUrl: "https://github.com/dushu2006/SmartPlant",
  },
  {
    index: "04",
    category: "P2P",
    color: "text-white/60",
    name: "DropZone",
    desc: "Zero-cloud direct WebRTC localized file streaming pipeline.",
    hoverBorder: "hover:border-white/40",
    githubUrl: "https://github.com/dushu2006/DropZone",
  },
  {
    index: "05",
    category: "DEV TOOLS",
    color: "text-white/60",
    name: "API Doctor",
    desc: "Automated OpenAPI schema validation, stress testing & diagnostics.",
    hoverBorder: "hover:border-white/40",
    githubUrl: "https://github.com/dushu2006/API-DOCTOR",
  },
  {
    index: "06",
    category: "QUERY ENGINE",
    color: "text-white/60",
    name: "SQL AI",
    desc: "Natural language to schema-safe optimized SQL query synthesizer.",
    hoverBorder: "hover:border-white/40",
  },
  {
    index: "07",
    category: "COLLABORATION",
    color: "text-white/60",
    name: "CodeRoom",
    desc: "Real-time collaborative code editor with state conflict arbitration.",
    hoverBorder: "hover:border-white/40",
  },
  {
    index: "08",
    category: "BEHAVIORAL",
    color: "text-white/60",
    name: "Habit Tracker",
    desc: "Data-driven behavioral analytics & streak preservation engine.",
    hoverBorder: "hover:border-white/40",
  },
  {
    index: "09",
    category: "GAME LOGIC",
    color: "text-white/60",
    name: "Hand Cricket",
    desc: "Algorithmic probability-based turn prediction game engine.",
    hoverBorder: "hover:border-white/40",
  },
  {
    index: "10",
    category: "KNOWLEDGE ENGINE",
    color: "text-white/60",
    name: "IdeaTrix",
    desc: "Concept matrix synthesis & rapid hackathon brainstorming board.",
    hoverBorder: "hover:border-white/40",
  },
];

export default function ProjectsSection() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Freeze background Lenis smooth scroll and prevent body scroll when dialog is active
  useEffect(() => {
    const lenis = (
      window as unknown as {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;

    if (catalogOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [catalogOpen]);

  // GSAP ScrollTrigger: Horizontal rail driven by vertical scrolling (Desktop & Mobile)
  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    const header = triggerRef.current;
    if (!pinWrap || !track) return;

    // Header reveal animation
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

    const mm = gsap.matchMedia();

    // Desktop (>= 768px): Pin & scrub horizontal rail
    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
            }
          },
        },
      });

      return () => tween.kill();
    });

    // Mobile (< 768px): Pin & scrub horizontal rail smoothly on vertical scroll!
    mm.add("(max-width: 767px)", () => {
      const getScrollAmountMobile = () => -(track.scrollWidth - window.innerWidth + 32);

      const tween = gsap.to(track, {
        x: getScrollAmountMobile,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 180}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
            }
          },
        },
      });

      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  // Horizontal touch gesture drag support on mobile
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // When dragging primarily horizontally, convert to vertical scroll driving the pinned rail
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        startX = currentX;
        startY = currentY;
        const lenis = (
          window as unknown as {
            __lenis?: { scrollTo: (t: number) => void; scroll: number };
          }
        ).__lenis;

        if (lenis) {
          lenis.scrollTo(lenis.scroll + diffX * 1.5);
        } else {
          window.scrollBy({ top: diffX * 1.5, behavior: "auto" });
        }
      }
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const manualScroll = (direction: number) => {
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (t: number) => void; scroll: number };
      }
    ).__lenis;

    if (lenis) {
      lenis.scrollTo(lenis.scroll + direction * 420);
    } else {
      window.scrollBy({ top: direction * 420, behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="projects"
        className="relative z-20 w-full bg-[#0B0C10] border-b border-white/5 overflow-hidden"
      >
        <div ref={pinWrapRef} className="w-full py-16 sm:py-20 ambient-glow-mesh">
        <div ref={triggerRef} className="max-w-7xl mx-auto px-6 sm:px-12 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] text-[#99CFDE] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#99CFDE] animate-pulse" />
                <span>01 / 06 SELECTED ARTIFACTS</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal uppercase tracking-tight">
                Selected Work
              </h2>
            </div>

            {/* Horizontal Rail Progress Indicator (Desktop & Mobile) */}
            <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs text-white/40">
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">RAIL PROGRESS</span>
              <div className="w-20 sm:w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#99CFDE] shadow-[0_0_8px_#99CFDE] w-0 transition-all duration-75"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Projects Rail */}
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 px-4 sm:px-12 pb-6 pt-2 will-change-transform touch-pan-x"
        >
          {FEATURED_PROJECTS.map((project) => (
            <article
              key={project.name}
              className="flex-none w-[285px] sm:w-[390px] md:w-[460px]"
            >
              <TiltCard tiltFactor={8} accentColor={project.spotlightColor} className="h-full">
                <CardSpotlight
                  color={project.spotlightColor}
                  radius={320}
                  className={`p-7 sm:p-8 h-full flex flex-col justify-between group ${project.hoverBorder} ${project.hoverShadow} transition-all duration-300`}
                >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-4">
                    <span className="text-[#99CFDE]">
                      {project.index} // ARTIFACT
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-semibold border ${project.categoryColor}`}
                    >
                      {project.category}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-bold text-white tracking-tight ${project.hoverText} transition-colors`}
                  >
                    {project.name}
                  </h3>

                  <p className="font-mono text-xs text-[#99CFDE]/90 mt-1 uppercase">
                    {project.subtitle}
                  </p>

                  <p className="text-sm text-white/70 mt-4 leading-relaxed">
                    {project.description}
                  </p>

                  {project.flagship && (
                    <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-white/60 flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#99CFDE] shrink-0 mt-0.5" />
                      <span>
                        Evaluated against rigorously verified synthetic baselines
                        to protect operational forensic privacy.
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] text-white/60">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded bg-black/40 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-lg bg-[#8E343B] hover:bg-[#a63d45] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(142,52,59,0.4)]"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          project.liveUrl ? "px-4" : "w-full"
                        } py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{project.liveUrl ? "Code" : "Inspect Repository"}</span>
                      </a>
                    )}
                  </div>
                </div>
              </CardSpotlight>
            </TiltCard>
          </article>
          ))}

          {/* Card 6: See More Projects */}
          <article className="flex-none w-[285px] sm:w-[380px]">
            <div
              onClick={() => setCatalogOpen(true)}
              className="h-full rounded-2xl bg-gradient-to-br from-[#1C1D24] to-[#121317] border border-dashed border-white/25 p-7 sm:p-8 flex flex-col justify-between cursor-pointer group hover:border-[#8E343B] transition-all duration-300 shadow-xl"
            >
              <div>
                <span className="font-mono text-xs text-[#ffb3b4] uppercase tracking-widest">
                  // FULL INVENTORY
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4 tracking-tight group-hover:text-[#ffb3b4] transition-colors">
                  See More Projects
                </h3>
                <p className="text-sm text-white/70 mt-3 leading-relaxed">
                  Explore SQL AI, CodeRoom, Habit Tracker, Hand Cricket,
                  IdeaTrix, and active multi-agent research initiatives.
                </p>
              </div>

              <div className="pt-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 group-hover:bg-[#8E343B] text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-lg">
                  <span>Open Catalog (10+ Builds)</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

      {/* Accessible shadcn/ui Dialog: Full Projects Index */}
      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent
          className="flex flex-col h-[90vh] sm:h-[85vh] max-h-[850px] p-6 sm:p-8 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          <DialogHeader className="shrink-0 mb-4 pb-3">
            <DialogDescription>
              // ARTIFACT ARCHIVE • REPOSITORY DIRECTORY
            </DialogDescription>
            <DialogTitle>Full Projects Index</DialogTitle>
          </DialogHeader>

          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain pr-1.5 space-y-3.5 focus:outline-none"
            tabIndex={0}
          >
            {ALL_CATALOG_PROJECTS.map((proj) => (
              <div
                key={proj.name}
                className={`p-4 rounded-xl bg-black/40 border border-white/10 ${proj.hoverBorder} transition-colors flex flex-col justify-between gap-2`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] ${proj.color}`}>
                    {proj.index} // {proj.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ffb3b4] hover:underline text-[11px] font-mono flex items-center gap-1"
                      >
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-white">
                  {proj.name}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

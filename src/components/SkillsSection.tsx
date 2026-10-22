"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillNode {
  id: string;
  name: string;
  desc: string;
  x: number; // SVG viewBox (0 - 1200)
  y: number; // SVG viewBox (0 - 600)
  labelPlacement: "top" | "bottom" | "left" | "right";
  color: string;
  glow: string;
  isSpecial?: boolean;
}

// Ordered progression sequence:
// 0: Center Origin (600, 290)
// 1: Upper-Right (950, 110) [SQL & databases]
// 2: Upper-Left (220, 120) [Python & Web]
// 3: Mid-Right (1020, 280) [Git & dev tools]
// 4: Lower-Left (160, 410) [Machine learning]
// 5: Lower-Right (960, 450) [Backend & APIs]
// 6: Left-Center (340, 520) [AI & LLMs]
// 7: Right-Center (760, 530) [AI agents & RAG]
// 8: Bottom-Center Endpoint (600, 565) [Many more...]
const ORIGIN_NODE = {
  id: "origin",
  name: "Toolkit Origin",
  desc: "Core Engineering Foundations — Computational algorithms, system design, and continuous learning.",
  x: 600,
  y: 290,
  color: "#356BCE",
  glow: "rgba(53, 107, 206, 0.85)",
};

const SKILL_NODES: SkillNode[] = [
  {
    id: "sql",
    name: "SQL & databases",
    desc: "SQL & Databases — Relational modeling, indexing, schema optimization, and vector stores.",
    x: 950,
    y: 110,
    labelPlacement: "top",
    color: "#ffb74d",
    glow: "rgba(255, 183, 77, 0.85)",
  },
  {
    id: "python",
    name: "Python & Web",
    desc: "Python & Web — Scripting, automation, Next.js application architecture, and AI pipelines.",
    x: 220,
    y: 120,
    labelPlacement: "top",
    color: "#80d8ff",
    glow: "rgba(128, 216, 255, 0.85)",
  },
  {
    id: "git",
    name: "Git & dev tools",
    desc: "Git & Dev Tools — Branch workflows, CI/CD pipelines, Docker containers, and diagnostics.",
    x: 1020,
    y: 280,
    labelPlacement: "right",
    color: "#69f0ae",
    glow: "rgba(105, 240, 174, 0.85)",
  },
  {
    id: "ml",
    name: "Machine learning",
    desc: "Machine Learning — Supervised learning, classification, CNN vision models, and evaluation metrics.",
    x: 160,
    y: 410,
    labelPlacement: "left",
    color: "#b388ff",
    glow: "rgba(179, 136, 255, 0.85)",
  },
  {
    id: "backend",
    name: "Backend & APIs",
    desc: "Backend & APIs — Robust REST & WebSockets, asynchronous microservices, and contract validation.",
    x: 960,
    y: 450,
    labelPlacement: "right",
    color: "#ff9100",
    glow: "rgba(255, 145, 0, 0.85)",
  },
  {
    id: "ai-llms",
    name: "AI & LLMs",
    desc: "AI & LLMs — Working with language models, embeddings, and prompt optimization.",
    x: 340,
    y: 520,
    labelPlacement: "bottom",
    color: "#40c4ff",
    glow: "rgba(64, 196, 255, 0.85)",
  },
  {
    id: "rag",
    name: "AI agents & RAG",
    desc: "AI Agents & RAG — Tool-use execution graphs, multi-step agents, and vector context retrieval.",
    x: 760,
    y: 530,
    labelPlacement: "bottom",
    color: "#ff5252",
    glow: "rgba(255, 82, 82, 0.85)",
  },
  {
    id: "many-more",
    name: "Many more...",
    desc: "Continuous exploration — Systems programming, edge computing, distributed nodes, and UI choreography.",
    x: 600,
    y: 565,
    labelPlacement: "bottom",
    color: "#ffd54f",
    glow: "rgba(255, 213, 79, 0.95)",
    isSpecial: true,
  },
];

export default function SkillsSection() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const originDotRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeDesc, setActiveDesc] = useState(ORIGIN_NODE.desc);
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const [activeSkillId, setActiveSkillId] = useState<string>("origin");

  // Track cursor position inside canvas for smooth magnetic attraction
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Magnetic interaction parameters
  const MAGNETIC_RADIUS = 120; // Proximity threshold in pixels
  const MAX_DISPLACEMENT = 10; // Maximum attraction in pixels

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  // Compute magnetic displacement for a node at given pixel coordinates
  const getMagneticTransform = useCallback(
    (nodeXRatio: number, nodeYRatio: number) => {
      if (!mousePos || !canvasRef.current) return { x: 0, y: 0, scale: 1 };
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      const nodePxX = nodeXRatio * width;
      const nodePxY = nodeYRatio * height;

      const dx = mousePos.x - nodePxX;
      const dy = mousePos.y - nodePxY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAGNETIC_RADIUS && dist > 0) {
        const factor = 1 - dist / MAGNETIC_RADIUS;
        const pull = factor * MAX_DISPLACEMENT;
        return {
          x: (dx / dist) * pull,
          y: (dy / dist) * pull,
          scale: 1 + factor * 0.15,
        };
      }
      return { x: 0, y: 0, scale: 1 };
    },
    [mousePos]
  );

  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const originDot = originDotRef.current;
    if (!pinWrap || !originDot) return;

    const segments = segmentRefs.current.filter(Boolean) as SVGPathElement[];
    const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];

    // Ensure all segments are initially hidden via strokeDashoffset
    segments.forEach((seg) => {
      const len = seg.getTotalLength();
      gsap.set(seg, {
        strokeDasharray: len,
        strokeDashoffset: len,
        opacity: 0.85,
      });
    });

    // Nodes start in an elegant ambient state, fully revealing the architecture map
    nodes.forEach((node) => {
      gsap.set(node, {
        opacity: 0.38,
        scale: 0.9,
        pointerEvents: "auto",
      });
    });

    // Origin starts visible with prominent glow
    gsap.set(originDot, {
      opacity: 1,
      scale: 1,
    });

    const ctx = gsap.context(() => {
      // Master ScrollTrigger timeline pinned when the section aligns with viewport center
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: "center center",
          end: "+=1800",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p <= 0.05) {
              setActiveDesc(ORIGIN_NODE.desc);
              setActiveSkillId("origin");
            }
          },
        },
      });

      // Sequential path drawing and node reveal
      segments.forEach((seg, idx) => {
        const destNode = nodes[idx];
        const skill = SKILL_NODES[idx];

        tl.to(
          seg,
          {
            strokeDashoffset: 0,
            duration: 1,
            ease: "none",
          },
          `step-${idx}`
        );

        if (destNode) {
          tl.to(
            destNode,
            {
              opacity: 1,
              scale: 1,
              pointerEvents: "auto",
              duration: 0.3,
              ease: "back.out(1.7)",
              onStart: () => {
                setActiveDesc(skill.desc);
                setActiveSkillId(skill.id);
              },
              onReverseComplete: () => {
                gsap.to(destNode, { opacity: 0.38, scale: 0.9, duration: 0.25 });
                if (idx > 0) {
                  setActiveDesc(SKILL_NODES[idx - 1].desc);
                  setActiveSkillId(SKILL_NODES[idx - 1].id);
                } else {
                  setActiveDesc(ORIGIN_NODE.desc);
                  setActiveSkillId("origin");
                }
              },
            },
            `step-${idx}+=0.82`
          );
        }
      });
    }, pinWrapRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // Compute curved Bezier path segment with controlled control-points
  const getCurvePath = (x1: number, y1: number, x2: number, y2: number, index: number) => {
    // Specific crafted curves to avoid intersections and overlap
    if (index === 0) return `M ${x1} ${y1} C 720 220, 840 140, ${x2} ${y2}`;
    if (index === 1) return `M ${x1} ${y1} C 740 60, 440 60, ${x2} ${y2}`;
    if (index === 2) return `M ${x1} ${y1} C 460 210, 780 230, ${x2} ${y2}`;
    if (index === 3) return `M ${x1} ${y1} C 780 370, 420 380, ${x2} ${y2}`;
    if (index === 4) return `M ${x1} ${y1} C 420 470, 720 460, ${x2} ${y2}`;
    if (index === 5) return `M ${x1} ${y1} C 780 530, 520 540, ${x2} ${y2}`;
    if (index === 6) return `M ${x1} ${y1} C 480 515, 620 515, ${x2} ${y2}`;
    if (index === 7) return `M ${x1} ${y1} C 710 560, 650 565, ${x2} ${y2}`;

    return `M ${x1} ${y1} L ${x2} ${y2}`;
  };

  const getLabelClasses = (placement: SkillNode["labelPlacement"]) => {
    switch (placement) {
      case "top":
        return "bottom-full mb-3 left-1/2 -translate-x-1/2";
      case "bottom":
        return "top-full mt-3 left-1/2 -translate-x-1/2";
      case "left":
        return "right-full mr-3.5 top-1/2 -translate-y-1/2 text-right";
      case "right":
        return "left-full ml-3.5 top-1/2 -translate-y-1/2 text-left";
    }
  };

  const originMag = getMagneticTransform(ORIGIN_NODE.x / 1200, ORIGIN_NODE.y / 600);

  return (
    <section id="skills" className="relative z-20 w-full bg-[#0B0C10] border-b border-white/5">
      {/* Pinned inner wrapper prevents Turbopack removeChild DOM error */}
      <div
        ref={pinWrapRef}
        className="relative z-20 w-full min-h-screen flex flex-col justify-between py-10 sm:py-14 px-6 sm:px-12 overflow-hidden ambient-glow-mesh select-none"
      >
        {/* Header Info */}
        <div className="max-w-7xl mx-auto w-full z-20">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#99CFDE] uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#356BCE] animate-pulse" />
            <span>TECHNICAL DOMAINS &amp; SYSTEMS</span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight">
            Things I work with
          </h2>
          <p
            id="skills-subtitle"
            className="font-mono text-sm sm:text-base text-[#99CFDE] mt-3 tracking-normal h-8 transition-colors duration-200 flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#356BCE] shadow-[0_0_8px_#356BCE] animate-pulse shrink-0" />
            <span className="text-white/90">
              {hoveredDesc || activeDesc}
            </span>
          </p>
        </div>

        {/* Constellation Canvas with Interactive Mouse Tracking */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="max-w-7xl mx-auto relative h-[460px] sm:h-[540px] w-full flex-1 my-2 flex items-center justify-center cursor-crosshair"
        >
          {/* SVG Drawing Layer: Distinct, non-overlapping luminous Bezier curves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1200 600"
          >
            <defs>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" in="SourceGraphic" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient Architectural Constellation Wireframe */}
            <g className="opacity-20 pointer-events-none">
              {SKILL_NODES.map((node, index) => {
                const prevX = index === 0 ? ORIGIN_NODE.x : SKILL_NODES[index - 1].x;
                const prevY = index === 0 ? ORIGIN_NODE.y : SKILL_NODES[index - 1].y;
                const d = getCurvePath(prevX, prevY, node.x, node.y, index);
                return (
                  <path
                    key={`ambient-${node.id}`}
                    d={d}
                    fill="none"
                    stroke="#356BCE"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                );
              })}
            </g>

            {/* Render individual connected path segments */}
            {SKILL_NODES.map((node, index) => {
              const prevX = index === 0 ? ORIGIN_NODE.x : SKILL_NODES[index - 1].x;
              const prevY = index === 0 ? ORIGIN_NODE.y : SKILL_NODES[index - 1].y;
              const d = getCurvePath(prevX, prevY, node.x, node.y, index);
              const isSegmentActive = activeSkillId === node.id;

              return (
                <path
                  key={`seg-${node.id}`}
                  ref={(el) => {
                    segmentRefs.current[index] = el;
                  }}
                  d={d}
                  fill="none"
                  stroke={isSegmentActive ? node.color : "#356BCE"}
                  strokeWidth={isSegmentActive ? "3.5" : "2"}
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                  className="transition-colors duration-300"
                />
              );
            })}
          </svg>

          {/* 
            Origin Dot (Center Node) at (600, 290):
            Magnetic interaction applied to inner elements so base remains stable.
          */}
          <div
            ref={originDotRef}
            style={{
              left: `${(ORIGIN_NODE.x / 1200) * 100}%`,
              top: `${(ORIGIN_NODE.y / 600) * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 pointer-events-auto cursor-pointer"
          >
            <div
              style={{
                transform: `translate(${originMag.x}px, ${originMag.y}px) scale(${originMag.scale})`,
                transition: "transform 0.15s ease-out",
              }}
              className="relative flex items-center justify-center p-2"
            >
              <div className="w-5 h-5 rounded-full bg-[#356BCE] shadow-[0_0_24px_#356BCE] border-2 border-white animate-pulse" />
              <div className="absolute w-8 h-8 rounded-full border border-[#99CFDE]/50 animate-ping" />
            </div>
          </div>

          {/* 
            Progressive Destination Nodes & Legible Labels:
            Magnetic proximity applied to node container without detaching path connection.
          */}
          {SKILL_NODES.map((node, index) => {
            const leftPercent = (node.x / 1200) * 100;
            const topPercent = (node.y / 600) * 100;
            const isNodeActive = activeSkillId === node.id;
            const mag = getMagneticTransform(node.x / 1200, node.y / 600);

            return (
              <div
                key={node.id}
                ref={(el) => {
                  nodeRefs.current[index] = el;
                }}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                onMouseEnter={() => setHoveredDesc(node.desc)}
                onMouseLeave={() => setHoveredDesc(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 select-none opacity-0"
              >
                {/* Inner wrapper receives fluid magnetic displacement */}
                <div
                  style={{
                    transform: `translate(${mag.x}px, ${mag.y}px) scale(${mag.scale})`,
                    transition: "transform 0.15s ease-out",
                  }}
                  className="relative flex items-center justify-center cursor-pointer group p-2"
                >
                  <span
                    style={
                      isNodeActive
                        ? {
                            color: node.color,
                            textShadow: `0 0 16px ${node.glow}`,
                          }
                        : undefined
                    }
                    className={`absolute ${getLabelClasses(
                      node.labelPlacement
                    )} whitespace-nowrap font-mono text-[13px] sm:text-[15px] md:text-[16px] font-medium tracking-tight transition-all duration-300 pointer-events-none ${
                      node.isSpecial
                        ? "text-[#ffd54f] font-bold drop-shadow-[0_0_12px_rgba(255,213,79,0.9)]"
                        : isNodeActive
                        ? "font-bold scale-110"
                        : "text-white/80 group-hover:text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]"
                    }`}
                  >
                    {node.name}
                  </span>

                  {/* Node Target Circle */}
                  {node.isSpecial ? (
                    <div
                      style={{
                        backgroundColor: `${node.color}25`,
                      }}
                      className="relative w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <div
                        style={{
                          backgroundColor: node.color,
                          borderColor: "#ffffff",
                          boxShadow: `0 0 20px ${node.glow}`,
                        }}
                        className={`w-4 h-4 rounded-full border-2 transition-transform duration-200 ${
                          isNodeActive ? "scale-125" : "group-hover:scale-125"
                        }`}
                      />
                    </div>
                  ) : (
                    <div
                      style={
                        isNodeActive
                          ? {
                              borderColor: node.color,
                              boxShadow: `0 0 18px ${node.glow}`,
                            }
                          : undefined
                      }
                      className={`w-5 h-5 rounded-full border-2 bg-[#0B0C10] flex items-center justify-center transition-all duration-300 ${
                        isNodeActive
                          ? "scale-125"
                          : "border-[#356BCE] group-hover:border-[#99CFDE] group-hover:scale-125 shadow-[0_0_10px_rgba(53,107,206,0.5)]"
                      }`}
                    >
                      <div
                        style={
                          isNodeActive
                            ? { backgroundColor: node.color }
                            : undefined
                        }
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          isNodeActive
                            ? ""
                            : "bg-[#356BCE] group-hover:bg-[#99CFDE]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

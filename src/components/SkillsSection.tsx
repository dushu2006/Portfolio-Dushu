"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const skills = [
  { name: "SQL & databases", x: 78, y: 22 },
  { name: "Python & Web", x: 22, y: 24 },
  { name: "Git & dev tools", x: 80, y: 43 },
  { name: "Machine learning", x: 20, y: 60 },
  { name: "Backend & APIs", x: 78, y: 70 },
  { name: "AI & LLMs", x: 24, y: 81 },
  { name: "AI agents & RAG", x: 76, y: 88 },
  { name: "Many more...", x: 50, y: 95 },
];
const origin = { x: 50, y: 50 };

export default function SkillsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !originRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const paths = gsap.utils.toArray<SVGPathElement>(".skill-path", stage);
      const nodes = gsap.utils.toArray<HTMLElement>(".skill-node", stage);
      gsap.set(nodes, { autoAlpha: 0 });
      paths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, autoRound: false, visibility: "visible" });
      });
      const timeline = gsap.timeline({ scrollTrigger: {
        id: "skills-sequence", trigger: originRef.current, start: "center center",
        pin: stage, end: () => {
          const canvas = stage.querySelector(".skills-canvas")!.getBoundingClientRect();
          // Travel in rendered pixels, scaled to a comfortable scroll-to-draw ratio.
          const distance = skills.reduce((total, node, i) => {
            const previous = i ? skills[i - 1] : origin;
            return total + Math.hypot((node.x - previous.x) * canvas.width / 100, (node.y - previous.y) * canvas.height / 100);
          }, 0);
          return `+=${distance * .65}`;
        },
        scrub: true, invalidateOnRefresh: true,
      } });
      paths.forEach((path, i) => {
        timeline.to(path, { strokeDashoffset: 0, autoRound: false, duration: 1, ease: "none" });
        timeline.to(nodes[i], { autoAlpha: 1, duration: .16, ease: "none" });
      });
      timeline.to({}, { duration: .5 }); // A readable final endpoint before release.
      // Geometry stays anchored. Only the surrounding halo is attracted to the pointer.
      const points = gsap.utils.toArray<HTMLElement>(".skill-point", stage);
      const setters = points.map(point => {
        const halo = point.querySelector(".skill-halo");
        return { point, x: gsap.quickTo(halo, "x", { duration: .25 }), y: gsap.quickTo(halo, "y", { duration: .25 }), scale: gsap.quickTo(halo, "scale", { duration: .25 }) };
      });
      const reset = () => setters.forEach(s => { s.x(0); s.y(0); s.scale(1); });
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        setters.forEach(s => {
          const r = s.point.getBoundingClientRect();
          const dx = event.clientX - r.left - r.width / 2;
          const dy = event.clientY - r.top - r.height / 2;
          const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 100);
          s.x(dx * strength * .12); s.y(dy * strength * .12); s.scale(1 + strength * .5);
        });
      };
      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", reset);
      return () => { stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", reset); };
    });
    return () => mm.revert();
  }, []);
  return <section id="skills" className="relative z-20 bg-[#0B0C10]">
    <div ref={stageRef} className="skills-stage">
      <header className="skills-heading"><p className="eyebrow">03 / CONNECTING THE DOTS</p><h2 className="font-editorial text-4xl sm:text-5xl">The toolkit.</h2></header>
      <div className="skills-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
          {skills.map((node, i) => {
            const from = i ? skills[i - 1] : origin;
            const mid = (from.x + node.x) / 2;
            return <path key={node.name} className="skill-path" d={i === 0 ? "M 50 50 C 99 55, 98 22, 78 22" : `M ${from.x} ${from.y} Q ${mid} ${Math.min(from.y, node.y) - (i === 1 ? 12 : 0)} ${node.x} ${node.y}`} fill="none" stroke="#7398c7" strokeWidth=".14" />;
          })}
        </svg>
        <div ref={originRef} data-origin className="skill-point skill-origin" style={{ left: "50%", top: "50%" }} aria-label="Toolkit origin"><span className="skill-halo"/><span className="skill-core"/></div>
        {skills.map((node, i) => <div key={node.name} className="skill-node skill-point" style={{ left: `${node.x}%`, top: `${node.y}%` }}><span className="skill-halo"/><span className="skill-core"/><span className={`skill-label ${i === 7 ? "endpoint" : ""}`}>{node.name}</span></div>)}
      </div>
    </div>
  </section>;
}

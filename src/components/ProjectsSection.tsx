"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects, repositoryUrl, type Project } from "@/lib/projects";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProjectVisual from "./ProjectVisual";
import { motion, useReducedMotion } from "framer-motion";
import { TiltCard } from "./motion-primitives/TiltCard";
import { CardSpotlight } from "./aceternity/CardSpotlight";
import { revealTransition } from "@/lib/motion";
gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [preview, setPreview] = useState<Project | null>(null);
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (preview) lenis?.stop();
    return () => lenis?.start();
  }, [preview]);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!track.current || !stage.current) return;
      const distance = () => Math.max(0, track.current!.scrollWidth - stage.current!.clientWidth);
      gsap.to(track.current, { x: () => -distance(), ease: "none", scrollTrigger: {
        id: "projects-rail", trigger: stage.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: true, invalidateOnRefresh: true,
        onUpdate: self => { if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`; },
      } });
    });
    return () => mm.revert();
  }, []);
  return <>
    <section id="projects" className="relative z-20 bg-[#101217] overflow-hidden">
      <div ref={stage} className="projects-stage">
        <header className="px-6 sm:px-12 flex justify-between items-end gap-6 mb-6"><div><p className="eyebrow">02 / SELECTED ARTIFACTS</p><h2 className="font-editorial text-4xl sm:text-5xl">Selected work.</h2></div><div className="w-24 h-0.5 bg-white/15"><div ref={progress} className="h-full bg-[#99CFDE] origin-left scale-x-0"/></div></header>
        <div ref={track} className="project-track">
          {projects.slice(0, 5).map((project, i) => <button key={project.slug} type="button" className="project-tile group text-left" onClick={event => { opener.current = event.currentTarget; setPreview(project); }}>
            <div className="flex justify-between text-xs text-[#99CFDE] font-mono"><span>0{i + 1} / {project.category}</span><ArrowUpRight size={18}/></div>
            <TiltCard className="project-art" tiltFactor={4}>
              <CardSpotlight className="h-full"><ProjectVisual project={project}/></CardSpotlight>
            </TiltCard>
            <div><h3 className="text-3xl font-semibold mb-2 group-hover:text-[#99CFDE] transition-colors">{project.name}</h3><p className="text-sm text-white/70 leading-relaxed max-w-sm">{project.summary}</p><span className="inline-flex items-center gap-2 mt-5 text-xs uppercase tracking-wider">Open preview <ArrowRight size={14}/></span></div>
          </button>)}
          <Link href="/projects" className="project-tile project-more"><p className="eyebrow">THE FULL INVENTORY</p><h3 className="font-editorial text-5xl">See More<br/>Projects</h3><p className="text-white/65">Ten projects. Different questions.<br/>One continuing practice.</p><span className="flex items-center gap-3">Explore the catalog <ArrowRight size={18}/></span></Link>
        </div>
      </div>
    </section>
    <Dialog open={!!preview} onOpenChange={open => { if (!open) setPreview(null); }}>
      <DialogContent className="max-w-none w-full h-dvh border-0 p-6 sm:p-16 justify-center" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
        {preview && <motion.div key={preview.slug} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={reducedMotion ? { duration: 0 } : revealTransition} className="preview-layout max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="preview-art"><ProjectVisual project={preview}/><p className="text-xs text-white/45 mt-4">Conceptual architecture illustration · not a product screenshot</p></div>
          <div><p className="eyebrow mb-5">{preview.category}</p><DialogTitle className="font-editorial text-5xl sm:text-7xl normal-case font-normal">{preview.name}</DialogTitle><DialogDescription className="font-sans text-base normal-case tracking-normal text-white/70 leading-relaxed mt-6">{preview.summary}</DialogDescription><p className="text-sm text-white/50 mt-4">{preview.stack.join(" / ")}</p><div className="flex flex-wrap gap-4 mt-8"><Link className="action-link" href={`/projects/${preview.slug}`}>Explore Full Project <ArrowUpRight size={16}/></Link>{preview.live && <a className="action-link secondary" href={preview.live} target="_blank" rel="noreferrer">Live demo</a>}{preview.repo && <a className="text-sm underline py-3" href={repositoryUrl(preview)} target="_blank" rel="noreferrer">Repository</a>}</div></div>
        </motion.div>}
      </DialogContent>
    </Dialog>
  </>;
}

"use client";

import {
  ArrowUp,
  Mail,
  Terminal,
  Link as LinkIcon,
  Phone,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#0B0C10] border-t border-white/10 pt-16 pb-12 text-left relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Top Section: Multi-column architectural footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Left Column: Monogram & Bio / Availability Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-editorial text-3xl sm:text-4xl uppercase tracking-wider text-[#F2EFE7]">
                  DUSYANTH
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#99CFDE]">
                  AI &amp; DS // VIIT
                </span>
              </div>
              <p className="text-sm text-white/70 max-w-sm leading-relaxed mb-6">
                AI &amp; Data Science student exploring autonomous systems,
                multi-agent workflows, scalable backend architectures, and
                production-grade developer tooling.
              </p>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 text-white/80">
                <span className="w-2 h-2 rounded-full bg-[#99CFDE] animate-pulse" />
                <span className="text-[#99CFDE]">
                  Open to Research &amp; Engineering Collaborations
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Visakhapatnam, IN • UTC+5:30 (IST)</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Curated Directory */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <span className="text-[#ffb3b4] text-[10px] uppercase tracking-widest block mb-4 font-semibold">
                // NAVIGATION
              </span>
              <ul className="space-y-2.5 text-white/60">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors block">
                    01. Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors block">
                    02. About
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-white transition-colors block"
                  >
                    03. Selected Work
                  </a>
                </li>
                <li>
                  <a href="#skills" className="hover:text-white transition-colors block">
                    04. Skills Constellation
                  </a>
                </li>
                <li>
                  <a
                    href="#achievements"
                    className="hover:text-white transition-colors block"
                  >
                    05. Accreditations
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors block">
                    06. Direct Transmission
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <span className="text-[#99CFDE] text-[10px] uppercase tracking-widest block mb-4 font-semibold">
                // ARTIFACTS
              </span>
              <ul className="space-y-2.5 text-white/60">
                <li>
                  <a
                    href="https://crime-link-seven.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ffb3b4] transition-colors flex items-center gap-1"
                  >
                    <span>CrimeLink</span>
                    <span className="text-[9px] text-[#ffb3b4]">[Live]</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dushu2006/ARISE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block"
                  >
                    ARISE Agent
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dushu2006/SmartPlant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block"
                  >
                    SmartPlant IoT
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dushu2006/DropZone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block"
                  >
                    DropZone P2P
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dushu2006/API-DOCTOR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block"
                  >
                    API Doctor
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-[#99CFDE] transition-colors block">
                    View All (10+)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Coordinates & Back-to-Top */}
          <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end">
            <div className="w-full lg:text-right">
              <span className="font-mono text-[#ffb3b4] text-[10px] uppercase tracking-widest block mb-4 font-semibold">
                // VERIFIED COORDINATES
              </span>
              <div className="space-y-2.5 font-mono text-xs text-white/70">
                <div>
                  <a
                    href="mailto:dushyanthtanna@gmail.com"
                    className="hover:text-[#99CFDE] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>dushyanthtanna@gmail.com</span>
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <a
                    href="https://github.com/dushu2006"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99CFDE] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>github.com/dushu2006</span>
                    <Terminal className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.linkedin.com/in/tanna-dusyanth-5639a5429/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99CFDE] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>linkedin.com/in/tanna-dusyanth</span>
                    <LinkIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <a
                    href="tel:+917675993371"
                    className="hover:text-[#99CFDE] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>+91 7675993371</span>
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Back to Top Pill Button */}
            <div className="pt-8 lg:pt-0 w-full flex lg:justify-end">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-mono text-xs transition-all duration-300 group"
              >
                <span>Return to top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monumental Ultra-Oversized DUSYANTH banner (edge-to-edge full width, massive horizontally & vertically) */}
      <div className="w-full select-none py-12 sm:py-20 lg:py-28 border-b border-white/5 flex items-center justify-center overflow-hidden px-2 sm:px-6">
        <svg
          viewBox="0 0 1600 280"
          className="w-full h-auto max-h-[280px] sm:max-h-[440px] lg:max-h-[600px] xl:max-h-[750px] overflow-visible"
          aria-label="DUSYANTH"
        >
          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-editorial uppercase fill-white/[0.10] hover:fill-white/[0.28] stroke-white/[0.05] hover:stroke-[#99CFDE]/40 transition-all duration-500 cursor-default select-none filter hover:drop-shadow-[0_0_90px_rgba(142,52,59,0.5)]"
            style={{
              fontSize: "260px",
              fontFamily: "'Newsreader', 'Instrument Serif', Georgia, serif",
              letterSpacing: "0.015em",
              fontWeight: 400,
            }}
          >
            DUSYANTH
          </text>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Bottom Bar / Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="font-editorial italic text-xl text-white/90">
            “Keep building. Keep exploring.”{" "}
            <span className="not-italic text-sm text-white/50 font-sans ml-2">
              — Dusyanth
            </span>
          </div>
          <div className="font-mono text-[11px] text-white/40 tracking-wide">
            © 2025 Dusyanth. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Terminal, Link as LinkIcon, Send, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    vector: "collab",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const formCard = formCardRef.current;
    if (!section || !leftCol || !formCard) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftCol,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftCol,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        formCard,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formCard,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransmitting(true);
    setTimeout(async () => {
      setTransmitting(false);
      setTransmitted(true);
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8E343B", "#356BCE", "#99CFDE", "#F2EFE7"],
        });
      } catch {
        // Fallback gracefully if canvas-confetti is not loaded
      }
    }, 800);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-20 w-full bg-[#0E1015] py-24 sm:py-32 border-t border-white/10 ambient-glow-mesh"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Heading & Direct Channels */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[#99CFDE] uppercase tracking-widest flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#99CFDE] animate-pulse" />
                <span>OPEN FREQUENCY // INITIATE TRANSMISSION</span>
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl text-white uppercase font-normal tracking-tight leading-tight">
                The next great idea
                <br />
                <span className="italic text-[#99CFDE]">could start here.</span>
              </h2>
              <p className="text-base sm:text-lg text-white/70 mt-6 max-w-xl leading-relaxed">
                Have something interesting in mind? Let&apos;s build something meaningful.
                Whether it&apos;s an autonomous AI system, a high-throughput backend,
                or a hackathon collaboration, my frequency is open.
              </p>
            </div>

            {/* Direct Contact Coordinates */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:dushyanthtanna@gmail.com"
                className="p-4 rounded-xl glass-card hover:border-[#99CFDE]/60 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-white/50 uppercase">
                    PRIMARY INBOX
                  </span>
                  <div className="text-sm font-semibold text-white group-hover:text-[#99CFDE] transition-colors mt-0.5">
                    dushyanthtanna@gmail.com
                  </div>
                </div>
                <Mail className="w-5 h-5 text-white/40 group-hover:text-[#99CFDE] transition-colors" />
              </a>

              <a
                href="tel:+917675993371"
                className="p-4 rounded-xl glass-card hover:border-[#99CFDE]/60 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-white/50 uppercase">
                    DIRECT VOICE
                  </span>
                  <div className="text-sm font-semibold text-white group-hover:text-[#99CFDE] transition-colors mt-0.5">
                    +91 7675993371
                  </div>
                </div>
                <Phone className="w-5 h-5 text-white/40 group-hover:text-[#99CFDE] transition-colors" />
              </a>

              <a
                href="https://github.com/dushu2006"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl glass-card hover:border-[#99CFDE]/60 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-white/50 uppercase">
                    CODE REPOSITORY
                  </span>
                  <div className="text-sm font-semibold text-white group-hover:text-[#99CFDE] transition-colors mt-0.5">
                    github.com/dushu2006
                  </div>
                </div>
                <Terminal className="w-5 h-5 text-white/40 group-hover:text-[#99CFDE] transition-colors" />
              </a>

              <a
                href="https://www.linkedin.com/in/tanna-dusyanth-5639a5429/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl glass-card hover:border-[#99CFDE]/60 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-white/50 uppercase">
                    PROFESSIONAL GRAPH
                  </span>
                  <div className="text-sm font-semibold text-white group-hover:text-[#99CFDE] transition-colors mt-0.5">
                    linkedin.com/in/tanna-dusyanth
                  </div>
                </div>
                <LinkIcon className="w-5 h-5 text-white/40 group-hover:text-[#99CFDE] transition-colors" />
              </a>
            </div>
          </div>

          {/* Right: Fast Transmit Form */}
          <div ref={formCardRef} className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6 font-mono text-xs text-white/40">
                <span className="text-[#99CFDE]">// FAST TRANSMIT BUFFER</span>
                <span>DIRECT.MSG</span>
              </div>

              {transmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#99CFDE]/10 border border-[#99CFDE]/40 flex items-center justify-center text-[#99CFDE]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Signal Transmitted
                  </h4>
                  <p className="font-mono text-xs text-[#99CFDE] max-w-xs">
                    // PAYLOAD ENQUEUED. Dusyanth will reply via frequency coordinates shortly.
                  </p>
                  <button
                    onClick={() => {
                      setTransmitted(false);
                      setFormData({ name: "", email: "", vector: "collab", message: "" });
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">
                      FULL NAME // CALLSIGN
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#99CFDE] focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#99CFDE] focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">
                      INQUIRY FOCUS / VECTOR
                    </label>
                    <select
                      value={formData.vector}
                      onChange={(e) =>
                        setFormData({ ...formData, vector: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#14151B] border border-white/15 focus:border-[#99CFDE] focus:outline-none text-white text-sm transition-colors"
                    >
                      <option value="collab">Autonomous AI Collaboration</option>
                      <option value="hackathon">Hackathon Teaming</option>
                      <option value="role">Engineering Role / Internship</option>
                      <option value="other">General Dialogue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">
                      PROJECT BRIEF / MESSAGE
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell me about what you're working on or want to build..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#99CFDE] focus:outline-none text-white text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={transmitting}
                    className="w-full py-3 rounded-lg bg-[#8E343B] hover:bg-[#a63d45] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(142,52,59,0.4)] hover:shadow-[0_0_30px_rgba(142,52,59,0.6)] active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>
                      {transmitting ? "Sending Transmission..." : "Send Transmission"}
                    </span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

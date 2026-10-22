"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");

  const updateActiveNav = useCallback(() => {
    // Check a point at 45% of viewport height to determine which section is currently viewed
    const viewportCheckY = window.innerHeight * 0.45;

    let current = "hero";
    // Iterate in reverse so that sections lower on the page take priority
    for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
      const item = NAV_ITEMS[i];
      const section = document.getElementById(item.id);
      if (section) {
        const rect = section.getBoundingClientRect();
        // If the section's top is above the check line, it's currently in view
        if (rect.top <= viewportCheckY && rect.bottom > viewportCheckY) {
          current = item.id;
          break;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav, { passive: true });
    updateActiveNav();
    return () => {
      window.removeEventListener("scroll", updateActiveNav);
      window.removeEventListener("resize", updateActiveNav);
    };
  }, [updateActiveNav]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string) => void } }).__lenis;
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el);
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-dock text-xs sm:text-[13px] font-medium tracking-wide">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={cn(
                "nav-item flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300",
                isActive
                  ? "text-white bg-[#8E343B]/90 shadow-[0_0_16px_rgba(142,52,59,0.6)] font-semibold"
                  : "text-white/70 hover:text-white"
              )}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}

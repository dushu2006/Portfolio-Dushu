"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export default function DecryptedText({
  text,
  speed = 30,
  maxIterations = 8,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className = "",
  parentClassName = "",
  encryptedClassName = "text-[#99CFDE] opacity-80",
  animateOn = "view",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const isRunningRef = useRef(false);

  const getNextChar = useCallback(
    (originalChar: string) => {
      if (originalChar === " " || originalChar === "\n") return originalChar;
      if (useOriginalCharsOnly) {
        const chars = text.replace(/\s/g, "");
        return chars[Math.floor(Math.random() * chars.length)] || originalChar;
      }
      return characters[Math.floor(Math.random() * characters.length)];
    },
    [characters, text, useOriginalCharsOnly]
  );

  const runDecryption = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsDecrypted(false);

    const charsArray = text.split("");
    const totalChars = charsArray.length;
    let iteration = 0;
    const totalIterations = Math.max(12, maxIterations * 3);

    const timer = setInterval(() => {
      iteration++;
      const progress = iteration / totalIterations;

      const updated = charsArray.map((char, i) => {
        if (char === " " || char === "\n") return char;

        // Sequential reveal logic
        if (sequential) {
          const charThreshold = (i + 1) / totalChars;
          if (progress >= charThreshold) {
            return char;
          }
        } else {
          if (progress >= 1) return char;
        }

        return getNextChar(char);
      });

      setDisplayText(updated.join(""));

      if (iteration >= totalIterations) {
        clearInterval(timer);
        setDisplayText(text);
        setIsDecrypted(true);
        isRunningRef.current = false;
      }
    }, speed);

    return () => {
      clearInterval(timer);
      isRunningRef.current = false;
    };
  }, [text, speed, maxIterations, sequential, getNextChar]);

  // Viewport Intersection Trigger
  useEffect(() => {
    if (animateOn !== "view") return;
    const el = containerRef.current;
    if (!el) return;

    let cleanupTimer: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            cleanupTimer = runDecryption();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (cleanupTimer) cleanupTimer();
    };
  }, [animateOn, runDecryption]);

  // Synchronize if text prop changes
  useEffect(() => {
    setDisplayText(text);
    hasAnimatedRef.current = false;
    if (animateOn === "view" && containerRef.current) {
      runDecryption();
    }
  }, [text, animateOn, runDecryption]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => {
        if (animateOn === "hover") {
          runDecryption();
        }
      }}
    >
      <span className={!isDecrypted ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
}

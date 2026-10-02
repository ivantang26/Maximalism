"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CALM_KEY } from "@/lib/calm";

/**
 * Calm mode (FR-3). The attribute on <html> is set before first paint by the inline
 * script in app/layout.tsx; this provider keeps React in sync, remembers the choice
 * for the session, and is the single motion guard for Framer Motion and parallax.
 */
interface CalmState {
  /** null until the client has read the initial state from <html>. */
  calm: boolean | null;
  setCalm: (on: boolean) => void;
  /** True only when neither calm mode nor prefers-reduced-motion is on. */
  motion: boolean;
}

const CalmContext = createContext<CalmState>({ calm: null, setCalm: () => {}, motion: false });

export function CalmProvider({ children }: { children: ReactNode }) {
  const [calm, setCalmState] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setCalmState(document.documentElement.hasAttribute("data-calm"));
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (calm === null) return;
    const root = document.documentElement;
    root.toggleAttribute("data-calm", calm);
    if (calm || reduced) root.setAttribute("data-motion", "off");
    else root.removeAttribute("data-motion");
  }, [calm, reduced]);

  const motion = calm === false && !reduced;

  // Pattern parallax: one passive listener writes the scroll offset to a CSS variable.
  useEffect(() => {
    const root = document.documentElement;
    if (!motion) {
      root.style.setProperty("--sy", "0");
      return;
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty("--sy", String(Math.round(window.scrollY)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [motion]);

  const setCalm = useCallback((on: boolean) => {
    setCalmState(on);
    try {
      sessionStorage.setItem(CALM_KEY, on ? "1" : "0");
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
  }, []);

  const value = useMemo(() => ({ calm, setCalm, motion }), [calm, setCalm, motion]);

  return (
    <CalmContext.Provider value={value}>
      <MotionConfig reducedMotion={motion ? "never" : "always"}>{children}</MotionConfig>
    </CalmContext.Provider>
  );
}

export const useCalm = () => useContext(CalmContext);

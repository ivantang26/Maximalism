"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCalm } from "./CalmProvider";

const WIPES = ["var(--hot-pink)", "var(--electric-orange)", "var(--cobalt)", "var(--acid-yellow)", "var(--leaf)"];
const HALF = 200; // cover 200ms + reveal 200ms = the 400ms wipe

/**
 * Full-screen colour wipe between pages. Internal link clicks are intercepted in the
 * capture phase, the screen is covered, then the route is pushed and uncovered once
 * the new pathname renders. Off entirely in calm mode and with reduced motion.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { motion } = useCalm();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const [colour, setColour] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!motion) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return;

      e.preventDefault();
      e.stopPropagation();
      setColour((c) => (c + 1) % WIPES.length);
      setPhase("cover");
      const href = url.pathname + url.search + url.hash;
      timers.current.push(window.setTimeout(() => router.push(href), HALF));
      // Never leave the screen covered if navigation stalls.
      timers.current.push(window.setTimeout(() => setPhase((p) => (p === "cover" ? "reveal" : p)), 4000));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [motion, router]);

  useEffect(() => {
    setPhase((p) => (p === "cover" ? "reveal" : p));
  }, [pathname]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => setPhase("idle"), HALF + 20);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  if (!motion && phase === "idle") return null;
  return <div aria-hidden="true" className={`wipe wipe--${phase}`} style={{ background: WIPES[colour] }} />;
}

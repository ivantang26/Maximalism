"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCalm } from "./CalmProvider";

export interface StickerSpec {
  text: string;
  sub?: string;
  shape: "burst" | "circle" | "rect" | "pill";
  tone: "yellow" | "cobalt" | "pink" | "orange" | "black" | "cream";
  /** Corner slot; each breakpoint places slots so they never cover the title or the button. */
  slot: "a" | "b" | "c";
  rot: number;
}

/**
 * Hero stickers. They peel on hover and, on desktop with a mouse, can be dragged
 * anywhere inside the hero. Positions are not saved: they snap back on reload.
 * Decorative only (the same facts live in the information panel).
 */
export default function Stickers({ stickers }: { stickers: StickerSpec[] }) {
  const { motion: motionOn } = useCalm();
  const [draggable, setDraggable] = useState(false);
  const bounds = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px) and (pointer: fine)");
    const sync = () => setDraggable(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="stickers" ref={bounds} data-decor aria-hidden="true">
      {stickers.map((s, i) => (
        <motion.div
          key={s.text}
          className={`sticker sticker--${s.shape} sticker--slot-${s.slot} ${draggable ? "sticker--draggable" : ""}`}
          style={{ rotate: s.rot }}
          drag={draggable}
          dragConstraints={bounds}
          dragElastic={0.18}
          dragMomentum={motionOn}
          whileDrag={{ scale: 1.08, rotate: s.rot + (i % 2 ? 6 : -6), zIndex: 30 }}
          transition={{ type: "spring", stiffness: 380, damping: 18 }}
        >
          <span className="sticker__face" data-tone={s.tone}>
            <span className="sticker__text">{s.text}</span>
            {s.sub && <span className="sticker__sub">{s.sub}</span>}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

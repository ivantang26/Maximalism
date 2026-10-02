"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Artwork from "../Artwork";
import ArtistCard from "./ArtistCard";
import { mediumGroups, type Artist, type MediumGroup } from "@/lib/content/types";

type Filter = "All" | MediumGroup;
const spring = { type: "spring", stiffness: 420, damping: 24, mass: 0.8 } as const;

/** Splits a name so the surname can take a second typeface. */
function Name({ name }: { name: string }) {
  const parts = name.split(" ");
  const last = parts.pop();
  return (
    <>
      <span className="wall__first">{parts.join(" ")}</span> <span className="wall__last">{last}</span>
    </>
  );
}

export default function ArtistWall({ artists }: { artists: Artist[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<number | null>(null);

  const visible = useMemo(() => (filter === "All" ? artists : artists.filter((a) => a.group === filter)), [artists, filter]);
  const counts = useMemo(() => Object.fromEntries(mediumGroups.map((g) => [g, artists.filter((a) => a.group === g).length])), [artists]);

  return (
    <div className="wall-wrap">
      <div className="wall__filters" role="group" aria-label="Filter artists by medium">
        {(["All", ...mediumGroups] as Filter[]).map((g) => (
          <button key={g} type="button" className="chip" aria-pressed={filter === g} onClick={() => setFilter(g)}>
            {g}
            <span className="chip__count" aria-hidden="true">
              {g === "All" ? artists.length : counts[g]}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filter === "All" ? `Showing all ${artists.length} artists` : `Showing ${visible.length} artists working in ${filter.toLowerCase()}`}
      </p>

      <LayoutGroup>
        <motion.ul className="wall" layout transition={spring}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((a, i) => (
              <motion.li
                key={a.slug}
                layout
                className={`wall__item wall__item--${a.size}`}
                initial={{ opacity: 0, scale: 0.4, rotate: i % 2 ? 10 : -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.4, rotate: i % 2 ? -12 : 12 }}
                transition={spring}
              >
                <button
                  type="button"
                  className="wall__tile"
                  data-tone={a.tone}
                  aria-haspopup="dialog"
                  onClick={() => setOpen(i)}
                >
                  <span className="wall__art" aria-hidden="true">
                    <Artwork work={a.works[0]} decorative />
                  </span>
                  <span className="wall__label">
                    <span className="wall__name">
                      <Name name={a.name} />
                    </span>
                    <span className="wall__meta f-mono">
                      Room {a.room} · {a.group}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      <ArtistCard
        artists={visible}
        index={open}
        onNavigate={setOpen}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

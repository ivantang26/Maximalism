"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Artwork from "../Artwork";
import { rooms } from "@/lib/content/rooms";
import type { Artist } from "@/lib/content/types";

interface Props {
  artists: Artist[];
  index: number | null;
  onNavigate: (i: number) => void;
  onClose: () => void;
}

/** Artist card (FR-5): a modal dialog, arrow keys and buttons on desktop, swipe on touch screens. */
export default function ArtistCard({ artists, index, onNavigate, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [direction, setDirection] = useState(1);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setTouch(mq.matches);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const artist = index !== null ? artists[index] : null;
  const room = artist ? rooms.find((r) => r.number === artist.room) : null;

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    setDirection(dir);
    onNavigate((index + dir + artists.length) % artists.length);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  const toRoom = (e: React.MouseEvent<HTMLAnchorElement>, n: number) => {
    e.preventDefault();
    ref.current?.close();
    requestAnimationFrame(() => {
      const target = document.getElementById(`room-${n}-title`);
      target?.scrollIntoView({ block: "start" });
      target?.focus({ preventScroll: true });
    });
  };

  return (
    <dialog
      ref={ref}
      className="artist-card"
      aria-labelledby="artist-card-name"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {artist && index !== null && (
        <div className="artist-card__frame">
          <div className="artist-card__bar">
            <p className="f-mono" aria-live="polite">
              <span className="sr-only">Artist </span>
              {String(index + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}
              <span className="sr-only">: {artist.name}</span>
            </p>
            <button type="button" className="artist-card__close" onClick={() => ref.current?.close()}>
              Close<span aria-hidden="true"> ✕</span>
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.article
              key={artist.slug}
              className="artist-card__body"
              data-tone={artist.tone}
              custom={direction}
              initial={{ x: direction * 120, opacity: 0, rotate: direction * 2 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: direction * -120, opacity: 0, rotate: direction * -2 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              drag={touch ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={onDragEnd}
            >
              <div className="artist-card__works">
                {artist.works.map((w) => (
                  <figure key={w.id} className="artist-card__work">
                    <div className="artist-card__art">
                      <Artwork work={w} />
                    </div>
                    <figcaption>
                      <span className="f-serif">{w.title}</span>, {w.year}
                      <br />
                      <span className="artist-card__medium">{w.medium}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="artist-card__info">
                <p className="artist-card__room f-mono">
                  <span data-tone="black">Room {artist.room}</span> {room?.title}
                </p>
                <h2 id="artist-card-name" className="artist-card__name">
                  {artist.name}
                </h2>
                <p className="artist-card__born f-mono">
                  {artist.born} · {artist.based}
                </p>
                <p className="artist-card__bio">{artist.bio}</p>
                <h3 className="f-mono artist-card__sub">In the show</h3>
                <ul className="artist-card__list">
                  {artist.works.map((w) => (
                    <li key={w.id}>
                      <em>{w.title}</em>, {w.year}. {w.medium}.
                    </li>
                  ))}
                </ul>
                <p>
                  <a href={`#room-${artist.room}`} onClick={(e) => toRoom(e, artist.room)}>
                    Go to Room {artist.room}: {room?.title}
                  </a>
                </p>
                {touch && (
                  <p className="artist-card__hint f-mono" aria-hidden="true">
                    Swipe for the next artist
                  </p>
                )}
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="artist-card__nav">
            <button type="button" className="btn btn--cream" onClick={() => go(-1)}>
              <span aria-hidden="true">←</span> Previous<span className="sr-only"> artist</span>
            </button>
            <button type="button" className="btn btn--yellow" onClick={() => go(1)}>
              Next<span className="sr-only"> artist</span> <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

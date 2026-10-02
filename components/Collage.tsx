import type { CSSProperties } from "react";
import Artwork from "./Artwork";
import { clusters, starPolygon, tornPolygon, type CollageClusterId } from "@/lib/collage";
import { getWork } from "@/lib/content/artists";

/**
 * A collage cluster: decorative, hidden from assistive tech, removed in calm mode.
 * Pieces carry a tier so the cluster compresses on smaller screens.
 */
export default function Collage({ id, className = "" }: { id: CollageClusterId; className?: string }) {
  const pieces = clusters[id];
  return (
    <div className={`collage ${className}`} data-decor aria-hidden="true">
      {pieces.map((p, i) => {
        const style: CSSProperties = {
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.w}%`,
          zIndex: "z" in p ? p.z : 1,
          ["--rot" as string]: `${p.rot}deg`,
        };
        const tier = `collage__piece--t${p.tier}`;
        if (p.kind === "tape") {
          return <span key={i} className={`collage__piece collage__tape collage__tape--${p.color} ${tier}`} style={style} />;
        }
        if (p.kind === "paper") {
          const clip = p.shape === "star" ? starPolygon : p.shape === "torn" ? tornPolygon(`${id}-${i}`, 6) : undefined;
          return (
            <span
              key={i}
              className={`collage__piece collage__paper collage__paper--${p.shape} ${tier}`}
              style={{ ...style, aspectRatio: `1 / ${p.ratio}`, background: `var(--c-${p.color})`, clipPath: clip }}
            />
          );
        }
        const { work } = getWork(p.work);
        return (
          <span key={i} className={`collage__piece collage__detail ${tier}`} style={style}>
            <span className="collage__paper-edge" style={{ clipPath: tornPolygon(`${id}-${i}-edge`, 3.5), aspectRatio: `1 / ${p.ratio}` }}>
              <span className="collage__cut" style={{ clipPath: tornPolygon(`${id}-${i}`, 3) }}>
                <Artwork work={work} crop={p.crop} decorative />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

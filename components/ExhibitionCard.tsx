import Link from "next/link";
import Artwork from "./Artwork";
import { patternStyle } from "@/lib/patterns";
import { getPreset } from "@/lib/presets";
import { exhibitionWork } from "@/lib/content/exhibitions";
import type { Exhibition } from "@/lib/content/types";
import { exhibitionStatus, formatRange } from "@/lib/format";

const statusLabel = { upcoming: "Coming soon", current: "On now", past: "Past" } as const;

export default function ExhibitionCard({ exhibition: ex, headingLevel = 3 }: { exhibition: Exhibition; headingLevel?: 2 | 3 }) {
  const preset = getPreset(ex.preset);
  const { work } = exhibitionWork(ex.works[0]);
  const H = headingLevel === 2 ? "h2" : "h3";
  const status = ex.end === null ? "Always on" : statusLabel[exhibitionStatus(ex.start, ex.end)];
  return (
    <Link href={ex.href} className="promo-card" data-tone={preset.tone}>
      <span className={`promo-card__visual ${preset.pattern ? "pattern" : ""}`} style={preset.pattern ? patternStyle(preset.pattern) : undefined}>
        <span className="promo-card__status f-mono" data-tone={preset.accentTone ?? "black"}>
          {status}
        </span>
        <span className="promo-card__art">
          <Artwork work={work} decorative />
        </span>
      </span>
      <span className="promo-card__body">
        <H className="promo-card__title f-serif">{ex.title}</H>
        <span className="promo-card__meta f-mono">
          {formatRange(ex.start, ex.end)} · {ex.where}
        </span>
        <span className="promo-card__summary">{ex.summary}</span>
        <span className="promo-card__admission">
          {ex.admission}
        </span>
      </span>
    </Link>
  );
}

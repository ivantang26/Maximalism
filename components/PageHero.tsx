import type { ReactNode } from "react";
import Collage from "./Collage";
import { patternStyle } from "@/lib/patterns";
import { getPreset, type PresetId } from "@/lib/presets";

interface Props {
  preset: PresetId;
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  lang?: string;
  children?: ReactNode;
}

/** Header band for inner pages: a preset's pattern with the title on a solid block. */
export default function PageHero({ preset: id, kicker, title, lede, lang, children }: Props) {
  const preset = getPreset(id);
  return (
    <section className={`page-hero ${preset.pattern ? "pattern" : ""}`} style={preset.pattern ? patternStyle(preset.pattern) : undefined} lang={lang}>
      {preset.collage && <Collage id={preset.collage} />}
      <div className="page-hero__inner">
        {kicker && (
          <p className="page-hero__kicker f-mono" data-tone={preset.accentTone ?? "black"}>
            {kicker}
          </p>
        )}
        <div>
          <h1 className="page-hero__title" data-tone={preset.tone}>
            {title}
          </h1>
        </div>
        {lede && (
          <div>
            <p className="page-hero__lede" data-tone="cream">
              {lede}
            </p>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

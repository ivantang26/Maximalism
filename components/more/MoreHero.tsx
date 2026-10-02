import Link from "next/link";
import Collage from "../Collage";
import Stickers, { type StickerSpec } from "../Stickers";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";
import { more } from "@/lib/content/site";

const stickers: StickerSpec[] = [
  { text: `${more.weeks} weeks only`, shape: "burst", tone: "yellow", slot: "a", rot: 12 },
  { text: `${more.artists} artists`, sub: "from 20 cities", shape: "circle", tone: "cobalt", slot: "b", rot: -10 },
  { text: "Summer 2027", shape: "rect", tone: "pink", slot: "c", rot: -5 },
];

export default function MoreHero() {
  const preset = presets["hero-clash"];
  return (
    <section className="hero pattern" style={patternStyle(preset.pattern)} aria-labelledby="hero-title">
      <Collage id="hero" />
      <div className="hero__inner">
        <p className="hero__kicker f-mono" data-tone="black">
          Loud House presents
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">MORE</span>
          <span className="hero__tiles" aria-hidden="true">
            <span className="hero__tile" data-tone="yellow">
              M
            </span>
            <span className="hero__tile" data-tone="cobalt">
              O
            </span>
            <span className="hero__tile" data-tone="cream">
              R
            </span>
            <span className="hero__tile" data-tone="black">
              <span className="accent">E</span>
            </span>
          </span>
        </h1>
        <p className="hero__strap f-serif" data-tone="cream">
          is more.
        </p>
        <div className="hero__meta">
          <p className="hero__dates f-mono" data-tone="black">
            <time dateTime={more.start}>20 June</time> – <time dateTime={more.end}>27 September 2027</time>
          </p>
          <Link href="/tickets" className="btn btn--yellow btn--big">
            Book tickets
          </Link>
        </div>
      </div>
      <Stickers stickers={stickers} />
    </section>
  );
}

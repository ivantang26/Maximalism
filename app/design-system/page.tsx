import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Collage from "@/components/Collage";
import CalmToggle from "@/components/CalmToggle";
import { galleryPanel } from "@/lib/content/site";
import { palette, cssVarFor, tones, MIN_CONTRAST, type PaletteName, type Tone } from "@/lib/tokens";
import { contrastRatio, formatRatio } from "@/lib/contrast";
import { patternNames, patternStyle, type PatternName } from "@/lib/patterns";
import { presets } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Design system",
  description: "The Loud House design system: palette, approved colour pairs, type roles, the pattern library, section presets, collage and calm mode.",
};

const tokenUse: Record<PaletteName, string> = {
  pink: "Primary exhibition colour",
  orange: "Clash accent",
  cobalt: "Clash accent, links on light panels, calm-mode accent",
  yellow: "Highlight blocks, stickers, the Tickets button",
  leaf: "Pattern fills only",
  black: "Text and outlines",
  cream: "Information panel and calm mode background",
};

const sampleColours: Record<PatternName, PaletteName[]> = {
  checks: ["pink", "orange"],
  squiggles: ["yellow", "pink", "cobalt"],
  dots: ["cobalt", "pink", "yellow"],
  stripes: ["orange", "pink"],
  leopard: ["orange", "black", "pink"],
  confetti: ["cream", "pink", "cobalt", "orange"],
  grid: ["black", "leaf", "cobalt"],
  zigzag: ["pink", "yellow", "cobalt"],
};

const rules = [
  "Text only ever sits on a solid tone block, never directly on a pattern, collage or artwork.",
  "At most three patterns and one collage cluster in any viewport (two clusters on wide screens).",
  "Essential information lives in the information panel: same content model, same place, every page.",
  "Editors choose section presets, not colours. Every preset is contrast-checked at build time.",
  "Up to four typefaces, each with one job. Body text and the information panel are always Inter.",
  "Clashes are deliberate: repeat a few motifs (checks, stickers, hard shadows) so the noise reads as one voice.",
  "Everything decorative is marked data-decor and disappears in calm mode.",
];

function ratioFor(tone: Tone, role: "fg" | "link" | "accent") {
  const t = tones[tone];
  return contrastRatio(palette[t[role]], palette[t.bg]);
}

export default function DesignSystemPage() {
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="hero-clash"
          kicker="Design system"
          title={
            <>
              <span className="f-display">More</span> <span className="f-serif">is more</span> <span className="f-mono">(with rules)</span>
            </>
          }
          lede="How the Loud House website lets designers break the rules safely: a loud frame of colour, pattern and collage around quiet, consistent facts."
        />
      }
    >
      <section className="band band--tight" aria-labelledby="ds-rules">
        <div className="wrap">
          <h2 id="ds-rules" className="section-title">
            <span className="f-serif">Rules for</span> <span className="f-display">breaking rules</span>
          </h2>
          <ol className="ds-rules">
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band--tight" data-tone="black" aria-labelledby="ds-colour">
        <div className="wrap">
          <h2 id="ds-colour" className="section-title">
            <span className="f-serif">Colour</span>
          </h2>
          <ul className="swatches">
            {(Object.keys(palette) as PaletteName[]).map((name) => (
              <li key={name} className="swatch">
                <span className="swatch__chip" style={{ background: palette[name] }} />
                <span className="swatch__name f-mono">{cssVarFor[name]}</span>
                <span className="swatch__hex">{palette[name]}</span>
                <span className="swatch__use">{tokenUse[name]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band--tight" aria-labelledby="ds-pairs">
        <div className="wrap">
          <h2 id="ds-pairs" className="section-title">
            <span className="f-serif">Approved</span> <span className="f-display">tones</span>
          </h2>
          <p className="measure">
            Every block of text sits on one of these six tones. Ratios are calculated from the tokens on every build; anything under {MIN_CONTRAST}:1 fails
            the build.
          </p>
          <ul className="tone-grid">
            {(Object.keys(tones) as Tone[]).map((tone) => (
              <li key={tone} className="block tone-card" data-tone={tone}>
                <p className="tone-card__name f-mono">{tone}</p>
                <p className="tone-card__sample f-serif">Aa</p>
                <dl className="tone-card__ratios">
                  <div>
                    <dt>Text</dt>
                    <dd>{formatRatio(ratioFor(tone, "fg"))}</dd>
                  </div>
                  <div>
                    <dt>
                      <a href="#ds-pairs">Links</a>
                    </dt>
                    <dd>{formatRatio(ratioFor(tone, "link"))}</dd>
                  </div>
                  <div>
                    <dt className="accent">Accent</dt>
                    <dd>{formatRatio(ratioFor(tone, "accent"))}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band--tight" data-tone="cream" aria-labelledby="ds-type">
        <div className="wrap">
          <h2 id="ds-type" className="section-title">
            <span className="f-serif">Four faces,</span> <span className="f-display">four jobs</span>
          </h2>
          <dl className="type-roles">
            <div>
              <dt className="f-mono">Exhibition title · Rubik Mono One · 64 → 220px</dt>
              <dd className="f-display type-roles__display">More</dd>
            </div>
            <div>
              <dt className="f-mono">Section headlines · Playfair Display Italic 900 · 32 → 96px</dt>
              <dd className="f-serif type-roles__serif">Too much colour</dd>
            </div>
            <div>
              <dt className="f-mono">Labels and stickers · Space Mono · 13 → 16px</dt>
              <dd className="f-mono type-roles__mono">Room 04 · Late · 14 weeks only</dd>
            </div>
            <div>
              <dt className="f-mono">Body and information panel · Inter · 16 → 18px</dt>
              <dd className="type-roles__sans">Arrive any time in your 30-minute slot, then stay as long as you like.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="band band--tight" aria-labelledby="ds-patterns">
        <div className="wrap">
          <h2 id="ds-patterns" className="section-title">
            <span className="f-serif">Eight</span> <span className="f-display">patterns</span>
          </h2>
          <p className="measure">Seamless SVG tiles drawn on a 100-unit grid, coloured from the palette, and served as data URIs of a few hundred bytes each.</p>
          <ul className="pattern-grid">
            {patternNames.map((name) => (
              <li key={name}>
                <span className="pattern-grid__tile pattern" style={patternStyle({ name, colors: sampleColours[name], scale: 80 })} />
                <span className="pattern-grid__name f-mono" data-tone="black">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band--tight" data-tone="black" aria-labelledby="ds-presets">
        <div className="wrap">
          <h2 id="ds-presets" className="section-title">
            <span className="f-serif">Section</span> <span className="f-display">presets</span>
          </h2>
          <p className="measure">What editors choose from in the CMS: a pattern, the tone that carries text over it, and an optional collage cluster.</p>
          <ul className="preset-grid">
            {Object.entries(presets).map(([id, p]) => {
              const ratio = contrastRatio(palette[tones[p.tone].fg], palette[tones[p.tone].bg]);
              return (
                <li key={id} className="preset-card">
                  <span className="preset-card__pattern pattern" style={p.pattern ? patternStyle({ ...p.pattern, scale: 60 }) : undefined}>
                    <span className="preset-card__block" data-tone={p.tone}>
                      Sample text {formatRatio(ratio)}
                    </span>
                  </span>
                  <span className="preset-card__label">
                    <strong>{p.label}</strong>
                    <span className="f-mono">
                      {id}
                      {p.collage ? ` · collage: ${p.collage}` : ""}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="band band--tight" aria-labelledby="ds-collage">
        <div className="wrap">
          <h2 id="ds-collage" className="section-title">
            <span className="f-serif">Collage</span> <span className="f-mono">&amp;</span> <span className="f-display">calm</span>
          </h2>
          <div className="split">
            <div className="ds-collage pattern" style={patternStyle({ name: "checks", colors: ["pink", "orange"], scale: 90 })}>
              <Collage id="hero" />
              <p className="ds-collage__label f-mono" data-tone="black">
                Cluster: hero · 4 / 6 / 8 pieces by screen size
              </p>
            </div>
            <div className="block" data-tone="cream">
              <h3 className="programme__title f-serif">Calm mode</h3>
              <p>
                One switch removes every pattern, collage piece, sticker and animation, and redraws every tone as black on cream with cobalt as the single
                accent. It turns on automatically for visitors who ask their device for more contrast, is remembered for the session, and can be linked to
                directly with <code>?calm=1</code>.
              </p>
              <CalmToggle variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

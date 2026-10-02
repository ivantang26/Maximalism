import type { PaletteName } from "./tokens";
import { rngFor, between, round } from "./rng";

/**
 * Collage clusters. A cluster is a composed group of cut-out artwork details, tape
 * strips and paper shapes. Each piece has a tier so the cluster compresses on
 * smaller screens without being redesigned:
 *   tier 1 → mobile (3–4 pieces), tier ≤ 2 → tablet (5–6), all tiers → desktop (6–8).
 * Positions and widths are percentages of the cluster's box.
 */
type Placement = { x: number; y: number; w: number; rot: number; tier: 1 | 2 | 3; z?: number };

export type CollagePiece =
  | (Placement & { kind: "detail"; work: string; crop: [number, number, number, number]; ratio: number })
  | (Placement & { kind: "tape"; color: "yellow" | "cream" | "pink" })
  | (Placement & { kind: "paper"; color: PaletteName; shape: "torn" | "circle" | "star" | "arch"; ratio: number });

export const clusters = {
  hero: [
    { kind: "detail", work: "ines-obrador-1", crop: [60, 80, 300, 340], ratio: 1.15, x: 1, y: 7, w: 30, rot: -6, tier: 1 },
    { kind: "detail", work: "noor-haddad-1", crop: [40, 60, 320, 320], ratio: 1, x: 69, y: 55, w: 29, rot: 5, tier: 1 },
    { kind: "tape", color: "yellow", x: 10, y: 5, w: 13, rot: -18, tier: 1, z: 3 },
    { kind: "detail", work: "yuki-harada-1", crop: [40, 40, 320, 400], ratio: 1.25, x: 75, y: 3, w: 21, rot: 8, tier: 1 },
    { kind: "detail", work: "tunde-bakare-1", crop: [80, 60, 240, 380], ratio: 1.35, x: 5, y: 58, w: 18, rot: 4, tier: 2 },
    { kind: "paper", color: "cobalt", shape: "circle", ratio: 1, x: 60, y: 10, w: 10, rot: 0, tier: 2 },
    { kind: "detail", work: "olu-adeyemi-1", crop: [0, 100, 400, 300], ratio: 0.75, x: 35, y: 74, w: 20, rot: -3, tier: 3 },
    { kind: "tape", color: "cream", x: 78, y: 53, w: 11, rot: 14, tier: 3, z: 3 },
  ],
  home: [
    { kind: "detail", work: "zanele-mokoena-1", crop: [40, 40, 320, 400], ratio: 1.25, x: 62, y: 6, w: 26, rot: 6, tier: 1 },
    { kind: "detail", work: "priya-ramanathan-1", crop: [0, 0, 300, 300], ratio: 1, x: 72, y: 56, w: 24, rot: -5, tier: 1 },
    { kind: "tape", color: "pink", x: 70, y: 4, w: 11, rot: 12, tier: 1, z: 3 },
    { kind: "paper", color: "yellow", shape: "star", ratio: 1, x: 88, y: 38, w: 11, rot: 10, tier: 1 },
    { kind: "detail", work: "the-confetti-collective-1", crop: [60, 60, 280, 280], ratio: 1, x: 48, y: 62, w: 18, rot: 3, tier: 2 },
    { kind: "paper", color: "orange", shape: "arch", ratio: 1.3, x: 54, y: 30, w: 10, rot: -8, tier: 2 },
    { kind: "detail", work: "noor-haddad-2", crop: [20, 60, 360, 300], ratio: 0.85, x: 86, y: 76, w: 14, rot: -10, tier: 3 },
    { kind: "tape", color: "yellow", x: 45, y: 60, w: 9, rot: -22, tier: 3, z: 3 },
  ],
  shop: [
    // Kept left of ~62% so nothing hides behind the desktop information panel.
    { kind: "paper", color: "yellow", shape: "star", ratio: 1, x: 52, y: -5, w: 12, rot: 12, tier: 1 },
    { kind: "detail", work: "hollis-grey-2", crop: [0, 200, 400, 300], ratio: 0.75, x: -2, y: 74, w: 20, rot: -7, tier: 1 },
    { kind: "tape", color: "cream", x: 4, y: 71, w: 10, rot: 20, tier: 1, z: 3 },
    { kind: "paper", color: "cobalt", shape: "torn", ratio: 0.5, x: 30, y: 88, w: 22, rot: 4, tier: 2 },
    { kind: "detail", work: "marcus-delacroix-bell-1", crop: [100, 100, 200, 200], ratio: 1, x: 40, y: 4, w: 8, rot: -12, tier: 3 },
  ],
} as const satisfies Record<string, readonly CollagePiece[]>;

export type CollageClusterId = keyof typeof clusters;

/** A torn-paper edge as a CSS clip-path polygon, deterministic per key. */
export function tornPolygon(key: string, jag = 3.2, stepsPerEdge = 11): string {
  const r = rngFor(key);
  const pts: string[] = [];
  const j = () => round(between(r, 0, jag));
  for (let i = 0; i < stepsPerEdge; i++) pts.push(`${round((i / stepsPerEdge) * 100)}% ${j()}%`);
  for (let i = 0; i < stepsPerEdge; i++) pts.push(`${round(100 - j())}% ${round((i / stepsPerEdge) * 100)}%`);
  for (let i = 0; i < stepsPerEdge; i++) pts.push(`${round(100 - (i / stepsPerEdge) * 100)}% ${round(100 - j())}%`);
  for (let i = 0; i < stepsPerEdge; i++) pts.push(`${j()}% ${round(100 - (i / stepsPerEdge) * 100)}%`);
  return `polygon(${pts.join(", ")})`;
}

export const starPolygon = (() => {
  const pts: string[] = [];
  const spikes = 12;
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? 50 : 36;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${round(50 + rad * Math.cos(a))}% ${round(50 + rad * Math.sin(a))}%`);
  }
  return `polygon(${pts.join(", ")})`;
})();

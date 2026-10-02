import type { PatternSpec } from "./patterns";
import type { Tone } from "./tokens";
import type { CollageClusterId } from "./collage";

/**
 * Approved section presets. In the CMS an editor never picks raw colours: they pick
 * one of these, which fixes the pattern, the solid text block that sits over it and
 * the collage cluster (if any). scripts/check-contrast.ts fails the build if any
 * preset puts text on a pairing below 4.5:1.
 */
export interface SectionPreset {
  label: string;
  pattern: PatternSpec | null;
  /** The solid block that carries text over the pattern. */
  tone: Tone;
  /** Optional second block (stickers, captions, labels). */
  accentTone?: Tone;
  collage: CollageClusterId | null;
}

export const presets = {
  "hero-clash": {
    label: "Hero: pink × orange checks",
    pattern: { name: "checks", colors: ["pink", "orange"], scale: 176 },
    tone: "yellow",
    accentTone: "cobalt",
    collage: "hero",
  },
  "home-clash": {
    label: "Home hero: cobalt × pink stripes",
    pattern: { name: "stripes", colors: ["cobalt", "pink"], scale: 140 },
    tone: "yellow",
    accentTone: "black",
    collage: "home",
  },
  "room-squiggle": {
    label: "Room: squiggles on yellow",
    pattern: { name: "squiggles", colors: ["yellow", "pink", "cobalt"], scale: 120 },
    tone: "pink",
    accentTone: "black",
    collage: null,
  },
  "room-dots": {
    label: "Room: pink dots on cobalt",
    pattern: { name: "dots", colors: ["cobalt", "pink", "yellow"], scale: 96 },
    tone: "cream",
    accentTone: "pink",
    collage: null,
  },
  "room-leopard": {
    label: "Room: electric leopard",
    pattern: { name: "leopard", colors: ["orange", "black", "pink"], scale: 150 },
    tone: "yellow",
    accentTone: "cobalt",
    collage: null,
  },
  "room-grid": {
    label: "Room: green grid at night",
    pattern: { name: "grid", colors: ["black", "leaf", "cobalt"], scale: 120 },
    tone: "pink",
    accentTone: "yellow",
    collage: null,
  },
  "room-stripes": {
    label: "Room: pink × orange stripes",
    pattern: { name: "stripes", colors: ["orange", "pink"], scale: 110 },
    tone: "black",
    accentTone: "yellow",
    collage: null,
  },
  "room-zigzag": {
    label: "Room: zigzag finale",
    pattern: { name: "zigzag", colors: ["pink", "yellow", "cobalt"], scale: 90 },
    tone: "cobalt",
    accentTone: "yellow",
    collage: null,
  },
  "events-confetti": {
    label: "Events: confetti on cream",
    pattern: { name: "confetti", colors: ["cream", "pink", "cobalt", "orange"], scale: 130 },
    tone: "black",
    accentTone: "yellow",
    collage: null,
  },
  "shop-dots": {
    label: "Shop: yellow dots on orange",
    pattern: { name: "dots", colors: ["orange", "yellow", "pink"], scale: 80 },
    tone: "cream",
    accentTone: "black",
    collage: "shop",
  },
  "member-zigzag": {
    label: "Membership: cobalt zigzag on yellow",
    pattern: { name: "zigzag", colors: ["yellow", "cobalt", "pink"], scale: 110 },
    tone: "black",
    accentTone: "pink",
    collage: null,
  },
  "footer-confetti": {
    label: "Footer: confetti on black",
    pattern: { name: "confetti", colors: ["black", "pink", "yellow", "cobalt"], scale: 110 },
    tone: "black",
    collage: null,
  },
  "quiet-grid": {
    label: "Quiet: fine grid on cream",
    pattern: { name: "grid", colors: ["cream", "cobalt", "pink"], scale: 140 },
    tone: "cobalt",
    accentTone: "cream",
    collage: null,
  },
  "leopard-pink": {
    label: "Leopard on pink",
    pattern: { name: "leopard", colors: ["pink", "black", "yellow"], scale: 140 },
    tone: "cream",
    accentTone: "black",
    collage: null,
  },
  "checks-cobalt": {
    label: "Cobalt × cream checks",
    pattern: { name: "checks", colors: ["cobalt", "cream"], scale: 120 },
    tone: "yellow",
    accentTone: "pink",
    collage: null,
  },
  "squiggle-leaf": {
    label: "Squiggles on green",
    pattern: { name: "squiggles", colors: ["leaf", "yellow", "pink"], scale: 110 },
    tone: "cream",
    accentTone: "cobalt",
    collage: null,
  },
} as const satisfies Record<string, SectionPreset>;

export type PresetId = keyof typeof presets;

export function getPreset(id: PresetId): SectionPreset {
  return presets[id];
}

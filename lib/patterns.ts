import type { CSSProperties } from "react";
import { palette, type PaletteName } from "./tokens";

/**
 * The pattern library: eight seamless SVG tiles, drawn on a 100×100 grid and
 * coloured from the palette. Tiles are served as data URIs so a whole page of
 * pattern costs a few hundred bytes each.
 */
export const patternNames = ["checks", "squiggles", "dots", "stripes", "leopard", "confetti", "grid", "zigzag"] as const;
export type PatternName = (typeof patternNames)[number];

export interface PatternSpec {
  name: PatternName;
  /** [background, ink, ink2?, ink3?] */
  colors: readonly PaletteName[];
  /** Tile size in px at desktop; mobile uses a larger multiple so it reads as one bold texture. */
  scale: number;
}

type Tile = (c: string[]) => string;

const tiles: Record<PatternName, Tile> = {
  checks: ([bg, a]) =>
    `<rect width='100' height='100' fill='${bg}'/><path d='M0 0h50v50H0zM50 50h50v50H50z' fill='${a}'/>`,

  squiggles: ([bg, a, b = a]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<path d='M0 25Q12.5 5 25 25T50 25T75 25T100 25' fill='none' stroke='${a}' stroke-width='8' stroke-linecap='round'/>` +
    `<path d='M0 75Q12.5 55 25 75T50 75T75 75T100 75' fill='none' stroke='${b}' stroke-width='8' stroke-linecap='round'/>`,

  dots: ([bg, a, b = a]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<circle cx='25' cy='25' r='13' fill='${a}'/><circle cx='75' cy='75' r='13' fill='${a}'/>` +
    `<circle cx='75' cy='25' r='5' fill='${b}'/><circle cx='25' cy='75' r='5' fill='${b}'/>`,

  stripes: ([bg, a]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<path d='M0 0h25L0 25zM50 0h25L0 75V50zM100 0v25L25 100H0zM100 50v25L75 100H50z' fill='${a}'/>`,

  leopard: ([bg, ring, spot = bg]) => {
    const spots: [number, number, number, number, number][] = [
      [22, 20, 11, 8, 20],
      [70, 28, 9, 12, -30],
      [40, 62, 13, 9, 45],
      [82, 76, 8, 10, 10],
      [14, 84, 7, 6, -15],
    ];
    return (
      `<rect width='100' height='100' fill='${bg}'/>` +
      spots
        .map(
          ([x, y, rx, ry, rot]) =>
            `<g transform='rotate(${rot} ${x} ${y})'><ellipse cx='${x}' cy='${y}' rx='${rx - 3}' ry='${ry - 3}' fill='${spot}'/>` +
            `<ellipse cx='${x}' cy='${y}' rx='${rx}' ry='${ry}' fill='none' stroke='${ring}' stroke-width='4.5' stroke-linecap='round' stroke-dasharray='13 6 18 7'/></g>`,
        )
        .join("")
    );
  },

  confetti: ([bg, a, b = a, c = b]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<rect x='8' y='10' width='14' height='5' fill='${a}' transform='rotate(25 15 12)'/>` +
    `<circle cx='52' cy='14' r='4' fill='${b}'/>` +
    `<path d='M78 8l9 14h-18z' fill='${c}'/>` +
    `<rect x='30' y='40' width='14' height='5' fill='${b}' transform='rotate(-35 37 42)'/>` +
    `<circle cx='82' cy='48' r='4' fill='${a}'/>` +
    `<path d='M10 58l9 14h-18z' fill='${b}' transform='rotate(20 10 65)'/>` +
    `<rect x='56' y='68' width='14' height='5' fill='${c}' transform='rotate(60 63 70)'/>` +
    `<circle cx='28' cy='88' r='4' fill='${c}'/>` +
    `<rect x='80' y='86' width='12' height='5' fill='${a}' transform='rotate(-10 86 88)'/>`,

  grid: ([bg, a, b = a]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<path d='M25 0v100M75 0v100M0 25h100M0 75h100' stroke='${b}' stroke-width='1.5'/>` +
    `<path d='M50 0v100M0 50h100' stroke='${a}' stroke-width='4'/>`,

  zigzag: ([bg, a, b = a]) =>
    `<rect width='100' height='100' fill='${bg}'/>` +
    `<path d='M0 40L25 12L50 40L75 12L100 40' fill='none' stroke='${a}' stroke-width='10' stroke-linejoin='miter'/>` +
    `<path d='M0 90L25 62L50 90L75 62L100 90' fill='none' stroke='${b}' stroke-width='10' stroke-linejoin='miter'/>`,
};

export function patternSvg(spec: Pick<PatternSpec, "name" | "colors">): string {
  const hex = spec.colors.map((c) => palette[c]);
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'>${tiles[spec.name](hex)}</svg>`;
}

export function patternUrl(spec: Pick<PatternSpec, "name" | "colors">): string {
  return `url("data:image/svg+xml,${encodeURIComponent(patternSvg(spec))}")`;
}

/**
 * Inline style for an element carrying a pattern. The background colour is the
 * tile's own ground, so calm mode only has to drop the image.
 */
export function patternStyle(spec: PatternSpec): CSSProperties {
  return {
    ["--pattern" as string]: patternUrl(spec),
    ["--pattern-size" as string]: `${spec.scale}px`,
    ["--pattern-ground" as string]: palette[spec.colors[0]],
  };
}

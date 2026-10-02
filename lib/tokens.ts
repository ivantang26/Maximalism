/**
 * Design tokens. The CSS custom properties in app/globals.css mirror these values;
 * scripts/check-contrast.ts reads them to validate every approved text pairing.
 */
export const palette = {
  pink: "#FF3EA5",
  orange: "#FF6A13",
  cobalt: "#1F3FFF",
  yellow: "#F4FF3E",
  leaf: "#00A86B",
  black: "#111111",
  cream: "#FFF6E6",
} as const;

export type PaletteName = keyof typeof palette;

export const cssVarFor: Record<PaletteName, string> = {
  pink: "--hot-pink",
  orange: "--electric-orange",
  cobalt: "--cobalt",
  yellow: "--acid-yellow",
  leaf: "--leaf",
  black: "--black",
  cream: "--cream",
};

/** Plain-language colour names, used when writing and checking alt text. */
export const colourName: Record<PaletteName, string> = {
  pink: "hot pink",
  orange: "orange",
  cobalt: "cobalt blue",
  yellow: "acid yellow",
  leaf: "green",
  black: "black",
  cream: "cream",
};

/**
 * Solid blocks that text is allowed to sit on. Text never sits directly on a pattern
 * or collage: it always sits on one of these tones.
 *  - fg: body text
 *  - link: inline links
 *  - accent: headline highlights and small emphasis
 */
export const tones = {
  pink: { bg: "pink", fg: "black", link: "black", accent: "black" },
  orange: { bg: "orange", fg: "black", link: "black", accent: "black" },
  yellow: { bg: "yellow", fg: "black", link: "cobalt", accent: "cobalt" },
  cobalt: { bg: "cobalt", fg: "cream", link: "cream", accent: "yellow" },
  cream: { bg: "cream", fg: "black", link: "cobalt", accent: "cobalt" },
  black: { bg: "black", fg: "cream", link: "yellow", accent: "pink" },
} as const satisfies Record<string, { bg: PaletteName; fg: PaletteName; link: PaletteName; accent: PaletteName }>;

export type Tone = keyof typeof tones;

export const MIN_CONTRAST = 4.5;

/** Deterministic randomness so server and client render identical artwork and collage. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof mulberry32>;

export function rngFor(key: string): Rng {
  return mulberry32(hashString(key));
}

export const between = (r: Rng, min: number, max: number) => min + r() * (max - min);
export const pick = <T,>(r: Rng, items: readonly T[]): T => items[Math.floor(r() * items.length)];
export const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;

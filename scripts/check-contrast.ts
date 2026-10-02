/**
 * Automated contrast check for every text-on-colour pairing the CMS can produce.
 * Runs before every build (npm run build) and exits non-zero on any failure.
 *
 *   npm run check:contrast
 */
import { palette, tones, MIN_CONTRAST, type Tone } from "../lib/tokens";
import { presets } from "../lib/presets";
import { contrastRatio, formatRatio } from "../lib/contrast";

type Row = { where: string; pair: string; ratio: number };
const rows: Row[] = [];

function checkTone(where: string, tone: Tone) {
  const t = tones[tone];
  for (const role of ["fg", "link", "accent"] as const) {
    rows.push({
      where,
      pair: `${t[role]} on ${t.bg} (${role})`,
      ratio: contrastRatio(palette[t[role]], palette[t.bg]),
    });
  }
}

for (const tone of Object.keys(tones) as Tone[]) checkTone(`tone:${tone}`, tone);
for (const [id, preset] of Object.entries(presets)) {
  checkTone(`preset:${id}`, preset.tone);
  if ("accentTone" in preset && preset.accentTone) checkTone(`preset:${id} (accent block)`, preset.accentTone);
}
// Calm mode: black text and cobalt links/accents on cream.
rows.push({ where: "calm", pair: "black on cream", ratio: contrastRatio(palette.black, palette.cream) });
rows.push({ where: "calm", pair: "cobalt on cream", ratio: contrastRatio(palette.cobalt, palette.cream) });
// The information panel.
rows.push({ where: "info panel", pair: "black on cream", ratio: contrastRatio(palette.black, palette.cream) });
rows.push({ where: "info panel", pair: "cobalt links on cream", ratio: contrastRatio(palette.cobalt, palette.cream) });
rows.push({ where: "info panel", pair: "cream on black (button)", ratio: contrastRatio(palette.cream, palette.black) });

const failures = rows.filter((r) => r.ratio < MIN_CONTRAST);
const unique = new Map(rows.map((r) => [r.pair, r.ratio]));

console.log(`Checked ${rows.length} pairings (${unique.size} distinct) against ${MIN_CONTRAST}:1`);
for (const [pair, ratio] of [...unique].sort((a, b) => a[1] - b[1])) {
  console.log(`  ${ratio >= MIN_CONTRAST ? "pass" : "FAIL"}  ${formatRatio(ratio).padStart(6)}  ${pair}`);
}

if (failures.length) {
  console.error(`\n${failures.length} pairing(s) below ${MIN_CONTRAST}:1:`);
  for (const f of failures) console.error(`  ${f.where}: ${f.pair} = ${formatRatio(f.ratio)}`);
  process.exit(1);
}
console.log("All text-on-colour pairings pass.");

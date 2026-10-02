/**
 * Generates public/access/sensory-map.pdf: a one-page, high-contrast floor plan of
 * MORE showing where rooms are loud, bright, dark or busy and where to find quiet
 * seating. Regenerate with `npm run make:access-docs` when the layout changes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "access", "sensory-map.pdf");

const black = rgb(0.067, 0.067, 0.067);
const cream = rgb(1, 0.965, 0.902);
const white = rgb(1, 1, 1);
const cobalt = rgb(0.122, 0.247, 1);

const rooms = [
  { n: 1, title: "Too Much Colour", x: 60, y: 430, w: 220, h: 150, sound: "Medium", light: "Bright", busy: "Busy at weekends", seat: true },
  { n: 2, title: "Pattern Recognition", x: 290, y: 430, w: 220, h: 150, sound: "Quiet", light: "Bright", busy: "Moderate", seat: true },
  { n: 3, title: "Soft & Loud", x: 520, y: 430, w: 260, h: 150, sound: "Fans every 20 min", light: "Bright", busy: "Moderate", seat: true },
  { n: 4, title: "Night Bloom", x: 520, y: 250, w: 260, h: 170, sound: "Low music", light: "Dark, slow changes", busy: "Moderate", seat: true, quiet: true },
  { n: 5, title: "Crowd Scenes", x: 290, y: 250, w: 220, h: 170, sound: "Medium", light: "Bright", busy: "Busy afternoons", seat: true },
  { n: 6, title: "Everything, Everywhere", x: 60, y: 250, w: 220, h: 170, sound: "Loud at weekends", light: "Bright", busy: "Busiest room", seat: true },
];

const doc = await PDFDocument.create();
doc.setTitle("MORE sensory map, Loud House");
doc.setAuthor("Loud House");
doc.setSubject("Where MORE is loud, bright, dark or busy, and where to find quiet seating");
doc.setLanguage("en-GB");
const page = doc.addPage([842, 595]); // A4 landscape
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const regular = await doc.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 0, width: 842, height: 595, color: cream });
page.drawText("MORE: sensory map", { x: 60, y: 540, size: 30, font: bold, color: black });
page.drawText("Loud House, Galleries 1 & 2. Route runs Room 1 to Room 6. Seating in every room. Quiet hours: Tue & Sun 10:00-11:00.", {
  x: 60,
  y: 514,
  size: 12,
  font: regular,
  color: black,
});

for (const r of rooms) {
  page.drawRectangle({ x: r.x, y: r.y, width: r.w, height: r.h, color: white, borderColor: black, borderWidth: 3 });
  page.drawText(`Room ${r.n}`, { x: r.x + 12, y: r.y + r.h - 26, size: 16, font: bold, color: black });
  page.drawText(r.title, { x: r.x + 12, y: r.y + r.h - 44, size: 12, font: bold, color: black });
  const lines = [`Sound: ${r.sound}`, `Light: ${r.light}`, `People: ${r.busy}`, r.seat ? "Seating: yes" : ""];
  lines.forEach((line, i) => page.drawText(line, { x: r.x + 12, y: r.y + r.h - 66 - i * 16, size: 11, font: regular, color: black }));
  if (r.quiet) {
    page.drawRectangle({ x: r.x + r.w - 96, y: r.y + 10, width: 86, height: 26, color: cobalt });
    page.drawText("Quiet corner", { x: r.x + r.w - 90, y: r.y + 19, size: 11, font: bold, color: white });
  }
}

// Entrance, exit and facilities
page.drawRectangle({ x: 60, y: 120, width: 720, height: 110, borderColor: black, borderWidth: 3, color: white });
page.drawText("Ground floor: entrance, information desk, lifts, toilets", { x: 72, y: 204, size: 14, font: bold, color: black });
const facts = [
  "Entrance on Dye Works Yard: level threshold. Lifts to Galleries 1 & 2 beside the information desk.",
  "Accessible toilets on every floor. Changing Places toilet on the ground floor, next to the canteen.",
  "Ear defenders, folding stools and wheelchairs to borrow at the information desk.",
  "The Quiet Room (Gallery 4, ground floor) is a low-stimulation space open to everyone.",
];
facts.forEach((f, i) => page.drawText(f, { x: 72, y: 182 - i * 16, size: 11, font: regular, color: black }));
page.drawText("Loud House is fictional; this map accompanies a design study.", { x: 60, y: 90, size: 9, font: regular, color: black });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, await doc.save());
console.log(`Wrote ${out}`);

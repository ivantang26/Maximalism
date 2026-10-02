import type { Exhibition, Work } from "./types";
import { getWork } from "./artists";

type Featured = Work & { artist: string };

/** Works shown for exhibitions other than MORE (fictional, like everything else). */
const featured: Record<string, Featured> = {
  "sm-1": { id: "sm-1", artist: "Ada Okonkwo-Price", title: "Punch Card Weather", year: 2026, medium: "Jacquard weaving and conductive thread", template: "quilt", palette: ["cobalt", "cream", "yellow", "black"], alt: "A woven grid of diagonal triangles in cobalt blue, cream, acid yellow and black, joined by dashed black stitching." },
  "sm-2": { id: "sm-2", artist: "Mirela Stan", title: "Soft Circuit", year: 2027, medium: "Machine knitting and LEDs", template: "waves", palette: ["cream", "cobalt", "leaf", "pink"], alt: "Vertical wavy stripes of cobalt blue, green and hot pink knitted across a cream ground." },
  "qr-1": { id: "qr-1", artist: "Marguerite Owusu (1931–2012)", title: "Still Water, Early", year: 1998, medium: "Oil on canvas", template: "target", palette: ["cream", "cobalt", "cream", "cobalt"], alt: "Soft concentric rings of cobalt blue and cream, gently off-centre, like a ripple spreading across still water." },
  "ns-1": { id: "ns-1", artist: "Tomás Ruiz", title: "Bakery, 3am", year: 2027, medium: "Archival pigment print", template: "halftone", palette: ["black", "yellow"], alt: "Acid-yellow dots swell and shrink across a black field like a grainy night photograph." },
  "ns-2": { id: "ns-2", artist: "Ifeoma Nwachukwu", title: "Cab Rank, Lagos Island", year: 2026, medium: "Archival pigment print", template: "neon", palette: ["orange", "cobalt", "pink"], alt: "Looping trails of glowing orange, cobalt-blue and hot-pink light against a black background." },
};

/** Resolves an exhibition's work reference: MORE works by id, others from the featured list. */
export function exhibitionWork(id: string): { work: Work; artistName: string } {
  const f = featured[id];
  if (f) return { work: f, artistName: f.artist };
  const { work, artist } = getWork(id);
  return { work, artistName: artist.name };
}

export const exhibitions: Exhibition[] = [
  {
    slug: "more",
    title: "MORE",
    subtitle: "Thirty artists. Six rooms. No restraint.",
    start: "2027-06-20",
    end: "2027-09-27",
    where: "Galleries 1 & 2",
    admission: "From £9. Members and under-12s free.",
    summary: "Our summer exhibition of maximalist art: colour, pattern, excess and joy, from painting at full volume to a collage that grows every day.",
    body: [],
    preset: "hero-clash",
    works: ["ines-obrador-1", "noor-haddad-1"],
    href: "/more",
  },
  {
    slug: "soft-machines",
    title: "Soft Machines",
    subtitle: "Knitting, weaving and the robots that learned from them",
    start: "2027-03-12",
    end: "2027-08-29",
    where: "Gallery 3",
    admission: "Free",
    summary: "Jacquard looms were the first programmable machines. Five artists take the thread back: knitted circuits, woven code and a loom that improvises.",
    body: [
      "Before computers had screens, they had punch cards, and the punch cards came from weaving. The Jacquard loom of 1804 read patterns from a chain of cards; a century and a half later, programmers were still using the same idea.",
      "Soft Machines brings five artists back to the loom. There is a knitted circuit board that really works, a tapestry that records the gallery's footfall, and a loom that improvises its own pattern every afternoon at 15:00.",
      "Visitors can try a small hand loom in the gallery. Please ask an invigilator.",
    ],
    preset: "checks-cobalt",
    works: ["sm-1", "sm-2"],
    href: "/exhibitions/soft-machines",
  },
  {
    slug: "the-quiet-room",
    title: "The Quiet Room",
    subtitle: "One painting, eight chairs, no hurry",
    start: "2026-01-10",
    end: null,
    where: "Gallery 4",
    admission: "Free",
    summary: "A permanent space for slow looking: one large painting from the Loud House collection, soft light, eight chairs and no audio. The calm counterpart to everything else.",
    body: [
      "Every gallery needs a place to recover. The Quiet Room holds a single work from our collection, rehung twice a year, in soft and steady light.",
      "There is no audio guide, no wall text beyond a small label, and no time limit. Visitors are asked to keep voices low. It is a good place to sit before or after MORE.",
      "The Quiet Room is step-free, has a level-access bench and is on the sensory map as a low-stimulation space.",
    ],
    preset: "quiet-grid",
    works: ["qr-1"],
    href: "/exhibitions/the-quiet-room",
  },
  {
    slug: "night-shift",
    title: "Night Shift",
    subtitle: "Photographs from 24-hour cities",
    start: "2027-10-22",
    end: "2028-01-16",
    where: "Galleries 1 & 2",
    admission: "From £12. Members free.",
    summary: "Bakers, cleaners, cab drivers and DJs: a portrait of the people who keep cities running while everyone else is asleep.",
    body: [
      "Night Shift follows MORE into Galleries 1 and 2 this autumn. Twelve photographers from Lagos, Mumbai, Mexico City, Seoul and London spent a year on the night shift.",
      "Tickets go on sale to members on 1 September 2027 and to everyone else on 15 September 2027.",
    ],
    preset: "squiggle-leaf",
    works: ["ns-1", "ns-2"],
    href: "/exhibitions/night-shift",
  },
];

export function getExhibition(slug: string) {
  return exhibitions.find((e) => e.slug === slug);
}

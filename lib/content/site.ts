import type { InfoPanelData, InfoRow } from "./types";

export const site = {
  name: "Loud House",
  tagline: "Contemporary art, at volume.",
  address: ["Loud House", "3 Dye Works Yard", "London E9 5LH"],
  phone: "020 7946 0000",
  email: "hello@loudhouse.example",
  shopUrl: "https://shop.loudhouse.example",
  quietHours: "Tuesdays and Sundays, 10:00 – 11:00",
} as const;

export const openingHours: InfoRow[] = [
  { label: "Every day", value: "10:00 – 18:00" },
  { label: "Fridays", value: "10:00 – 21:00" },
  { label: "Quiet hours", value: "Tue & Sun, 10:00 – 11:00" },
];

export const more = {
  slug: "more",
  title: "MORE",
  start: "2027-06-20",
  end: "2027-09-27",
  dates: "20 June – 27 September 2027",
  artists: 30,
  rooms: 6,
  weeks: 14,
  curator: { name: "Dr Ama Okafor-Reyes", role: "Senior Curator, Loud House" },
  prices: [
    { label: "Adult", value: "£18" },
    { label: "Concessions", value: "£9", note: "Students, 65+, jobseekers, disabled visitors" },
    { label: "Under-12s", value: "Free" },
    { label: "Members", value: "Free" },
    { label: "Carers", value: "Free", note: "One per disabled visitor" },
  ] satisfies InfoRow[],
  intro: [
    "For most of the last century, the gallery wall was supposed to be white, the room quiet and the visitor a little intimidated. Good taste meant restraint. More was vulgar.",
    "This exhibition disagrees. MORE brings together thirty artists from twenty cities who work with too much on purpose: too much colour, too much pattern, too many objects, too many people. They borrow from market stalls and parade umbrellas, cinema posters and grandmothers' looms, seaside postcards and shop signs. Their excess is not decoration. It is memory, community and a kind of joy that is hard to find in a beige room.",
    "The show moves through six rooms, from painting at full volume to a finale that grows every day with paper donated by visitors. Some of it is loud. Some of it glows. One piece breathes. You are allowed to feel overwhelmed; there is seating in every room, and quiet hours twice a week.",
    "We hope you leave with your eyes a little tired and your head a little fuller. That is the point. Less was never more. More is more.",
  ],
};

export const morePanel: InfoPanelData = {
  eyebrow: "Exhibition",
  title: "MORE",
  dates: more.dates,
  hoursHeading: "Opening hours",
  hours: openingHours,
  pricesHeading: "Tickets",
  prices: more.prices.slice(0, 4),
  cta: { label: "Book tickets", href: "/tickets" },
  secondary: { label: "Members go free: join", href: "/membership" },
  accessHeading: "Access",
  access: [
    { label: "Access information", href: "/visit#access" },
    { label: "Sensory map (PDF)", href: "/access/sensory-map.pdf" },
    { label: "Large-print guide", href: "/visit/large-print" },
  ],
  addressHeading: "Getting here",
  address: ["3 Dye Works Yard, London E9 5LH", "Hackney Wick Overground, 4 min walk"],
  barLabel: "Visit info & tickets",
  closeLabel: "Close",
};

/** General panel for pages that are not about a single exhibition. */
export const galleryPanel: InfoPanelData = {
  ...morePanel,
  eyebrow: "Visit Loud House",
  title: "Open today",
  dates: "Free entry to the gallery. MORE is ticketed.",
  pricesHeading: "MORE tickets",
  secondary: { label: "Plan your visit", href: "/visit" },
};

export const membershipTiers = [
  {
    id: "individual",
    name: "Individual",
    price: 72,
    monthly: 6,
    tone: "pink",
    perks: ["Free, unlimited entry to MORE and every exhibition", "Book priority slots, including the members' half hour at 09:30", "10% off in the shop and canteen", "Members' preview evenings"],
  },
  {
    id: "joint",
    name: "Joint",
    price: 110,
    monthly: 9.5,
    tone: "yellow",
    perks: ["Everything in Individual, for two adults at one address", "Bring up to four under-18s free", "Two guest passes a year"],
  },
  {
    id: "young",
    name: "Young (16–25)",
    price: 30,
    monthly: 2.5,
    tone: "cobalt",
    perks: ["Free, unlimited entry to every exhibition", "Priority slots and the members' half hour", "Free entry to MORE Lates for you and a friend"],
  },
] as const;

export type MembershipTierId = (typeof membershipTiers)[number]["id"];

export const shopItems = [
  { id: "catalogue", name: "MORE: the catalogue", price: "£35", detail: "320 pages, 6 fold-outs, 1 sticker sheet", work: "the-confetti-collective-2" },
  { id: "print", name: "Limited print: Mediodía", price: "£60", detail: "Giclée on cotton rag, edition of 250", work: "ines-obrador-1" },
  { id: "tote", name: "MORE is more tote", price: "£15", detail: "Heavy canvas, screen-printed in London", work: "olu-adeyemi-1" },
] as const;

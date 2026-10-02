import type { PaletteName, Tone } from "../tokens";
import type { PresetId } from "../presets";

export type ArtworkTemplate =
  | "bands"
  | "memphis"
  | "quilt"
  | "target"
  | "face"
  | "blobs"
  | "neon"
  | "totem"
  | "sunburst"
  | "halftone"
  | "checkwarp"
  | "waves";

export interface Work {
  id: string;
  title: string;
  year: number;
  medium: string;
  template: ArtworkTemplate;
  palette: PaletteName[];
  /** Curator-written description of the work for screen reader users. */
  alt: string;
}

export const mediumGroups = [
  "Painting",
  "Textile & print",
  "Sculpture",
  "Light & installation",
  "Photography",
  "Collage & mixed media",
] as const;
export type MediumGroup = (typeof mediumGroups)[number];

export type TileSize = "lg" | "tall" | "wide" | "md" | "sm";

export interface Artist {
  slug: string;
  name: string;
  born: string;
  based: string;
  group: MediumGroup;
  room: number;
  bio: string;
  size: TileSize;
  tone: Tone;
  works: Work[];
}

export interface Room {
  number: number;
  title: string;
  kicker: string;
  text: string;
  preset: PresetId;
  keyWork: string;
  note?: string;
}

export type EventType = "talk" | "late" | "family" | "access";

export interface GalleryEvent {
  slug: string;
  type: EventType;
  title: string;
  date: string;
  start: string;
  end: string;
  summary: string;
  price: string;
  where: string;
  bookable: boolean;
}

export interface InfoRow {
  label: string;
  value: string;
  note?: string;
}

/** The calm information panel. Everything a visitor needs, the same shape on every page. */
export interface InfoPanelData {
  lang?: string;
  eyebrow: string;
  title: string;
  dates?: string;
  hoursHeading: string;
  hours: InfoRow[];
  pricesHeading: string;
  prices: InfoRow[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  accessHeading: string;
  access: { label: string; href: string }[];
  addressHeading: string;
  address: string[];
  /** Label for the mobile sticky bar and sheet. */
  barLabel: string;
  closeLabel: string;
}

export interface Exhibition {
  slug: string;
  title: string;
  subtitle: string;
  start: string;
  end: string | null;
  where: string;
  admission: string;
  summary: string;
  body: string[];
  preset: PresetId;
  works: string[];
  href: string;
}

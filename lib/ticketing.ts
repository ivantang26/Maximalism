import { more } from "./content/site";
import { events } from "./content/events";
import { addDays, weekdayIndex } from "./format";
import { hashString, mulberry32 } from "./rng";

/**
 * Ticketing domain model and a deterministic mock of the cultural-sector ticketing
 * platform. The API routes under app/api/ticketing call these functions; swapping
 * in the real platform means replacing this module, not the booking UI.
 */
export const ticketTypes = [
  { id: "adult", label: "Adult", price: 18, note: "16 and over" },
  { id: "concession", label: "Concession", price: 9, note: "Students, 65+, jobseekers, disabled visitors" },
  { id: "child", label: "Under-12", price: 0, note: "With an adult" },
  { id: "member", label: "Member", price: 0, note: "Membership number needed" },
  { id: "carer", label: "Carer", price: 0, note: "One per disabled visitor" },
] as const;

export type TicketTypeId = (typeof ticketTypes)[number]["id"];
export type Quantities = Record<TicketTypeId, number>;
export const emptyQuantities = (): Quantities => ({ adult: 0, concession: 0, child: 0, member: 0, carer: 0 });

export const MAX_TICKETS = 10;
export const SLOT_CAPACITY = 120;
export const MEMBER_SLOT_CAPACITY = 60;
export const MEMBER_NUMBER = /^LH-\d{6}$/i;

export type SlotKind = "members" | "standard" | "event";

export interface Slot {
  time: string;
  kind: SlotKind;
  capacity: number;
  remaining: number;
  label?: string;
}

export type DayAvailability = "good" | "limited" | "sold-out" | "closed";

export const runStart = more.start;
export const runEnd = more.end;

export function isOpenDay(iso: string) {
  return iso >= runStart && iso <= runEnd;
}

/** In-memory sales on top of the simulated baseline demand (per server process). */
const sold = new Map<string, number>();
const key = (date: string, time: string) => `${date}T${time}`;

function times(from: string, to: string): string[] {
  const out: string[] = [];
  let [h, m] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  while (h < th || (h === th && m <= tm)) {
    out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m === 60) {
      h += 1;
      m = 0;
    }
  }
  return out;
}

/** Simulated demand: weekends and midday are busier; opening week and the last fortnight busiest. */
function baselineSold(date: string, time: string, capacity: number): number {
  const r = mulberry32(hashString(key(date, time)))();
  const wd = weekdayIndex(date);
  const weekend = wd === 0 || wd === 6 ? 0.28 : 0;
  const hour = Number(time.slice(0, 2));
  const midday = hour >= 12 && hour <= 15 ? 0.18 : 0;
  const late = hour >= 18 ? 0.1 : 0;
  const edge = date < addDays(runStart, 7) || date > addDays(runEnd, -14) ? 0.22 : 0;
  const demand = Math.min(1, 0.22 + weekend + midday + late + edge + r * 0.4);
  return Math.round(capacity * demand);
}

export function slotsFor(date: string): Slot[] {
  if (!isOpenDay(date)) return [];
  const friday = weekdayIndex(date) === 5;
  const regular = times("10:00", friday ? "20:30" : "17:30");
  const make = (time: string, kind: SlotKind, capacity: number, label?: string): Slot => {
    const taken = baselineSold(date, time, capacity) + (sold.get(key(date, time)) ?? 0);
    return { time, kind, capacity, remaining: Math.max(0, capacity - taken), label };
  };
  const slots: Slot[] = [make("09:30", "members", MEMBER_SLOT_CAPACITY, "Members' half hour")];
  for (const t of regular) slots.push(make(t, "standard", SLOT_CAPACITY));
  for (const e of events.filter((ev) => ev.date === date && ev.bookable)) {
    const existing = slots.find((s) => s.time === e.start);
    if (existing) existing.label = e.title;
    else slots.push(make(e.start, "event", 40, e.title));
  }
  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

export function availabilityFor(date: string): DayAvailability {
  if (!isOpenDay(date)) return "closed";
  const standard = slotsFor(date).filter((s) => s.kind === "standard");
  const remaining = standard.reduce((n, s) => n + s.remaining, 0);
  const capacity = standard.reduce((n, s) => n + s.capacity, 0);
  if (remaining === 0) return "sold-out";
  return remaining / capacity < 0.25 ? "limited" : "good";
}

export function totalTickets(q: Quantities) {
  return Object.values(q).reduce((a, b) => a + b, 0);
}

export function orderTotal(q: Quantities) {
  return ticketTypes.reduce((sum, t) => sum + t.price * q[t.id], 0);
}

/** Business rules shared by the booking UI and the order endpoint. Returns a list of problems. */
export function validateTickets(q: Quantities, slot: Pick<Slot, "kind" | "remaining"> | null, memberNumber?: string): string[] {
  const problems: string[] = [];
  const count = totalTickets(q);
  if (count === 0) problems.push("Choose at least one ticket.");
  if (count > MAX_TICKETS) problems.push(`You can book up to ${MAX_TICKETS} tickets at a time.`);
  if (q.child > 0 && q.adult + q.concession + q.member + q.carer === 0) problems.push("Under-12s need to come with an adult.");
  if (q.carer > q.concession) problems.push("Carer tickets go with a concession ticket for the disabled visitor they are accompanying.");
  if (q.member > 2) problems.push("Each membership covers up to two member tickets.");
  if (q.member > 0 && !MEMBER_NUMBER.test(memberNumber ?? "")) problems.push("Enter a membership number in the format LH-123456.");
  if (slot?.kind === "members" && q.member === 0) problems.push("The 09:30 half hour is for members and their guests. Add a member ticket, or choose another time.");
  if (slot && count > slot.remaining) problems.push(`Only ${slot.remaining} tickets are left in this slot.`);
  return problems;
}

export interface OrderRequest {
  date: string;
  time: string;
  quantities: Quantities;
  name: string;
  email: string;
  memberNumber?: string;
  event?: string;
}

export interface Order extends OrderRequest {
  ref: string;
  total: number;
  createdAt: string;
}

export function placeOrder(req: OrderRequest): { ok: true; order: Order } | { ok: false; problems: string[] } {
  const slot = slotsFor(req.date).find((s) => s.time === req.time) ?? null;
  const problems = slot ? validateTickets(req.quantities, slot, req.memberNumber) : ["That entry slot is not available."];
  if (!req.name.trim()) problems.push("Enter the lead booker's name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.email)) problems.push("Enter an email address so we can send your tickets.");
  if (problems.length) return { ok: false, problems };

  const k = key(req.date, req.time);
  sold.set(k, (sold.get(k) ?? 0) + totalTickets(req.quantities));
  const ref = `MORE-${req.date.slice(5).replace("-", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  return { ok: true, order: { ...req, ref, total: orderTotal(req.quantities), createdAt: new Date().toISOString() } };
}

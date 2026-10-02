/** Dates are stored as ISO days (YYYY-MM-DD) and always formatted in UTC so server and client agree. */
export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIsoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = parseDay(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toIsoDay(d);
}

const fmt = (opts: Intl.DateTimeFormatOptions, locale = "en-GB") => new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opts });

export const formatLongDate = (iso: string) => fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(parseDay(iso));
export const formatShortDate = (iso: string) => fmt({ weekday: "short", day: "numeric", month: "short" }).format(parseDay(iso));
export const formatDayMonth = (iso: string) => fmt({ day: "numeric", month: "long" }).format(parseDay(iso));
export const formatMonthYear = (iso: string) => fmt({ month: "long", year: "numeric" }).format(parseDay(iso));
export const weekdayShort = (iso: string) => fmt({ weekday: "short" }).format(parseDay(iso));
export const dayOfMonth = (iso: string) => parseDay(iso).getUTCDate();
export const monthShort = (iso: string) => fmt({ month: "short" }).format(parseDay(iso));
/** 0 = Sunday … 6 = Saturday */
export const weekdayIndex = (iso: string) => parseDay(iso).getUTCDay();

export function formatRange(start: string, end: string | null): string {
  if (!end) return `Since ${formatDayMonth(start)} ${parseDay(start).getUTCFullYear()}`;
  const s = parseDay(start);
  const e = parseDay(end);
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const startText = sameYear ? formatDayMonth(start) : `${formatDayMonth(start)} ${s.getUTCFullYear()}`;
  return `${startText} – ${formatDayMonth(end)} ${e.getUTCFullYear()}`;
}

export function formatPrice(pounds: number): string {
  if (pounds === 0) return "Free";
  return Number.isInteger(pounds) ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}

export function exhibitionStatus(start: string, end: string | null, today = toIsoDay(new Date())): "upcoming" | "current" | "past" {
  if (today < start) return "upcoming";
  if (end && today > end) return "past";
  return "current";
}

"use client";

import { useMemo, useState } from "react";
import EventCard from "../EventCard";
import { eventTypeLabel } from "@/lib/content/events";
import type { EventType, GalleryEvent } from "@/lib/content/types";
import { formatLongDate, formatMonthYear } from "@/lib/format";

const types = Object.keys(eventTypeLabel) as EventType[];

/** Events calendar (FR-6): filter by type and by month or a single date. */
export default function EventsBrowser({ events, initialType }: { events: GalleryEvent[]; initialType?: EventType }) {
  const [selected, setSelected] = useState<EventType[]>(initialType ? [initialType] : []);
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("");

  const months = useMemo(() => Array.from(new Set(events.map((e) => e.date.slice(0, 7)))), [events]);
  const first = events[0]?.date;
  const last = events[events.length - 1]?.date;

  const filtered = events.filter(
    (e) => (selected.length === 0 || selected.includes(e.type)) && (month === "all" || e.date.startsWith(month)) && (!day || e.date === day),
  );

  const groups = months
    .map((m) => ({ month: m, items: filtered.filter((e) => e.date.startsWith(m)) }))
    .filter((g) => g.items.length > 0);

  const toggle = (t: EventType) => setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const clear = () => {
    setSelected([]);
    setMonth("all");
    setDay("");
  };
  const filtering = selected.length > 0 || month !== "all" || day !== "";

  return (
    <div className="events-browser">
      <div className="filters" data-tone="black">
        <fieldset className="filters__group">
          <legend className="f-mono">Type</legend>
          <div className="filters__chips">
            {types.map((t) => (
              <button key={t} type="button" className="chip" aria-pressed={selected.includes(t)} onClick={() => toggle(t)}>
                {eventTypeLabel[t]}
                <span className="chip__count" aria-hidden="true">
                  {events.filter((e) => e.type === t).length}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="filters__group filters__dates">
          <div className="form-field">
            <label htmlFor="filter-month" className="f-mono">
              Month
            </label>
            <select
              id="filter-month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setDay("");
              }}
            >
              <option value="all">All dates</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonthYear(`${m}-01`)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="filter-day" className="f-mono">
              Or a date
            </label>
            <input
              id="filter-day"
              type="date"
              min={first}
              max={last}
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                setMonth("all");
              }}
            />
          </div>
          {filtering && (
            <button type="button" className="btn btn--cream filters__clear" onClick={clear}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="events-browser__count" role="status">
        {filtered.length === 0
          ? "No events match. Try another type or date."
          : `${filtered.length} ${filtered.length === 1 ? "event" : "events"}${day ? ` on ${formatLongDate(day)}` : ""}`}
      </p>

      {groups.map((g) => (
        <section key={g.month} className="events-month" aria-labelledby={`month-${g.month}`}>
          <h2 id={`month-${g.month}`} className="events-month__title">
            <span className="f-serif">{formatMonthYear(`${g.month}-01`).split(" ")[0]}</span>{" "}
            <span className="f-mono">{g.month.slice(0, 4)}</span>
          </h2>
          <ul className="events-grid">
            {g.items.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

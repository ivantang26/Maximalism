import Link from "next/link";
import { bookingHref, eventTypeLabel, eventTypeTone } from "@/lib/content/events";
import type { GalleryEvent } from "@/lib/content/types";
import { dayOfMonth, formatLongDate, monthShort, weekdayShort } from "@/lib/format";

export default function EventCard({ event, headingLevel = 3 }: { event: GalleryEvent; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`event-card event-card--${event.type}`} data-tone={eventTypeTone[event.type]}>
      <p className="event-card__type f-mono">{eventTypeLabel[event.type]}</p>
      <p className="event-card__date">
        <time dateTime={`${event.date}T${event.start}`}>
          <span className="event-card__day f-display">{dayOfMonth(event.date)}</span>
          <span className="event-card__month f-mono">
            {monthShort(event.date)} · {weekdayShort(event.date)}
          </span>
          <span className="sr-only">{formatLongDate(event.date)}</span>
        </time>
      </p>
      <H className="event-card__title f-serif">{event.title}</H>
      <p className="event-card__when">
        {event.start}–{event.end} · {event.where}
      </p>
      <p className="event-card__summary">{event.summary}</p>
      <p className="event-card__price">{event.price}</p>
      {event.bookable && (
        <Link href={bookingHref(event)} className="btn btn--black event-card__cta">
          Book<span className="sr-only">: {event.title}</span>
        </Link>
      )}
    </article>
  );
}

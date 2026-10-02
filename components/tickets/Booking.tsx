"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_TICKETS,
  emptyQuantities,
  orderTotal,
  runEnd,
  runStart,
  ticketTypes,
  totalTickets,
  validateTickets,
  type DayAvailability,
  type Order,
  type Quantities,
  type Slot,
  type TicketTypeId,
} from "@/lib/ticketing";
import { addDays, formatLongDate, formatMonthYear, formatPrice, formatShortDate, parseDay, weekdayIndex } from "@/lib/format";
import { site } from "@/lib/content/site";

type Step = "date" | "time" | "tickets" | "details" | "done";
const steps: { id: Exclude<Step, "done">; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "tickets", label: "Tickets" },
  { id: "details", label: "Details & payment" },
];

const statusText: Record<DayAvailability, string> = {
  good: "good availability",
  limited: "limited availability",
  "sold-out": "sold out",
  closed: "not open for MORE",
};

export interface BookingInitial {
  date?: string;
  time?: string;
  member?: string;
  event?: { slug: string; title: string; date: string; start: string } | null;
}

interface Confirmation {
  order: Order;
  qrSvg: string;
}

function monthsOfRun(): string[] {
  const out: string[] = [];
  for (let d = runStart.slice(0, 7); d <= runEnd.slice(0, 7); ) {
    out.push(d);
    const [y, m] = d.split("-").map(Number);
    d = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  }
  return out;
}

function icsFor(order: Order): string {
  const [h, m] = order.time.split(":").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = order.date.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Loud House//MORE tickets//EN",
    "BEGIN:VEVENT",
    `UID:${order.ref}@loudhouse.example`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/London:${day}T${pad(h)}${pad(m)}00`,
    `DTEND;TZID=Europe/London:${day}T${pad(h + 2)}${pad(m)}00`,
    "SUMMARY:MORE at Loud House",
    `LOCATION:${site.address.join("\\, ")}`,
    `DESCRIPTION:Booking ${order.ref}. Arrive any time in your 30-minute entry slot.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function Booking({ initial }: { initial: BookingInitial }) {
  const months = useMemo(monthsOfRun, []);
  const validInitialDate = initial.date && initial.date >= runStart && initial.date <= runEnd ? initial.date : undefined;

  const [step, setStep] = useState<Step>("date");
  const [monthIdx, setMonthIdx] = useState(() => Math.max(0, months.indexOf((validInitialDate ?? runStart).slice(0, 7))));
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Quantities>(() => ({ ...emptyQuantities(), ...(initial.member ? { member: 1 } : { adult: 1 }) }));
  const [memberNumber, setMemberNumber] = useState(initial.member ?? "");
  const [ticketsTouched, setTicketsTouched] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [walletNote, setWalletNote] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const month = months[monthIdx];
  const slot = slots?.find((s) => s.time === time) ?? null;
  const count = totalTickets(quantities);
  const total = orderTotal(quantities);
  const ticketProblems = validateTickets(quantities, slot, memberNumber);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ticketing/availability?month=${month}`)
      .then((r) => r.json())
      .then((d: { days: { date: string; status: DayAvailability }[] }) => {
        if (!cancelled) setAvailability((prev) => ({ ...prev, ...Object.fromEntries(d.days.map((x) => [x.date, x.status])) }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [month]);

  // Deep links from events: ?date=…&time=…
  useEffect(() => {
    if (!validInitialDate) return;
    void chooseDate(validInitialDate, initial.time);
  }, []); // run once on mount

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  async function chooseDate(iso: string, preferredTime?: string) {
    setDate(iso);
    setTime(null);
    setSlots(null);
    setStep("time");
    const res = await fetch(`/api/ticketing/slots?date=${iso}`);
    const data: { slots: Slot[] } = await res.json();
    setSlots(data.slots);
    const wanted = preferredTime && data.slots.find((s) => s.time === preferredTime && s.remaining > 0);
    if (wanted) {
      setTime(wanted.time);
      setStep("tickets");
    }
  }

  function bump(id: TicketTypeId, delta: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, q[id] + delta) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return;
    setSubmitting(true);
    setProblems([]);
    try {
      const res = await fetch("/api/ticketing/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, quantities, name, email, memberNumber: quantities.member ? memberNumber : undefined, event: initial.event?.slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProblems(data.problems ?? ["Something went wrong. Please try again."]);
        return;
      }
      setConfirmation({ order: data.order, qrSvg: data.qrSvg });
      setStep("done");
    } catch {
      setProblems(["We couldn't reach the ticketing system. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = steps.findIndex((s) => s.id === step);

  if (step === "done" && confirmation) {
    const { order, qrSvg } = confirmation;
    return (
      <div className="booking">
        <h2 ref={headingRef} tabIndex={-1} className="booking__heading">
          <span className="f-serif">You&rsquo;re going to</span> <span className="f-display">More</span>
        </h2>
        <p className="lede">
          Your e-tickets are on their way to <strong>{order.email}</strong>. Show the QR code on your phone or printed at the entrance.
        </p>
        <article className="eticket" aria-label="Your e-ticket">
          <div className="eticket__main" data-tone="yellow">
            <p className="f-mono">Loud House · e-ticket</p>
            <p className="eticket__title f-display">More</p>
            <dl className="facts">
              <div>
                <dt>Date</dt>
                <dd>{formatLongDate(order.date)}</dd>
              </div>
              <div>
                <dt>Entry slot</dt>
                <dd>
                  {order.time} – {addMinutes(order.time, 30)}
                </dd>
              </div>
              <div>
                <dt>Tickets</dt>
                <dd>
                  {ticketTypes
                    .filter((t) => order.quantities[t.id] > 0)
                    .map((t) => `${order.quantities[t.id]} × ${t.label}`)
                    .join(", ")}
                </dd>
              </div>
              <div>
                <dt>Paid</dt>
                <dd>{order.total === 0 ? "Free" : formatPrice(order.total)}</dd>
              </div>
              <div>
                <dt>Booking</dt>
                <dd className="f-mono">{order.ref}</dd>
              </div>
            </dl>
          </div>
          <div className="eticket__stub" data-tone="cream">
            <div className="eticket__qr" role="img" aria-label={`QR code for booking ${order.ref}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <p className="f-mono">{order.ref}</p>
          </div>
        </article>
        <div className="booking__actions">
          <button type="button" className="btn btn--black" onClick={() => setWalletNote("apple")}>
            Add to Apple Wallet
          </button>
          <button type="button" className="btn btn--black" onClick={() => setWalletNote("google")}>
            Add to Google Wallet
          </button>
          <a className="btn btn--cream" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(icsFor(order))}`} download={`loud-house-${order.ref}.ics`}>
            Add to calendar
          </a>
          <button type="button" className="btn btn--cream" onClick={() => window.print()}>
            Print
          </button>
        </div>
        <p role="status" className="booking__note">
          {walletNote &&
            `Demo: in the live site our ticketing partner issues a signed ${walletNote === "apple" ? "Apple Wallet" : "Google Wallet"} pass here. No pass is created in this study.`}
        </p>
        <div className="block booking__next" data-tone="cream">
          <h3 className="f-serif">Before you come</h3>
          <ul>
            <li>Arrive any time in your 30-minute slot, then stay as long as you like.</li>
            <li>
              Want it quieter? Book a Tuesday or Sunday at 10:00 for <Link href="/visit#access">quiet hours</Link>, and download the{" "}
              <a href="/access/sensory-map.pdf">sensory map (PDF)</a>.
            </li>
            <li>
              <Link href="/visit#getting">Getting here</Link>: Hackney Wick Overground is 4 minutes&rsquo; walk, step-free.
            </li>
          </ul>
        </div>
        <p className="booking__demo form-hint">This is a design study: no payment was taken and no email was sent.</p>
      </div>
    );
  }

  return (
    <div className="booking">
      <ol className="booking__steps" aria-label="Booking steps">
        {steps.map((s, i) => (
          <li key={s.id} aria-current={s.id === step ? "step" : undefined} className={i < stepIndex ? "is-done" : ""}>
            <span className="f-mono">{i + 1}</span> {s.label}
          </li>
        ))}
      </ol>

      {initial.event && (
        <p className="booking__event" data-tone="pink">
          <strong>Booking for {initial.event.title}</strong>, {formatShortDate(initial.event.date)} at {initial.event.start}. Your ticket includes entry to MORE.
        </p>
      )}

      {/* Summary of choices so far */}
      {stepIndex > 0 && (
        <dl className="booking__summary">
          {date && (
            <div>
              <dt>Date</dt>
              <dd>
                {formatLongDate(date)}{" "}
                <button type="button" className="linklike" onClick={() => setStep("date")}>
                  Change<span className="sr-only"> date</span>
                </button>
              </dd>
            </div>
          )}
          {time && stepIndex > 1 && (
            <div>
              <dt>Entry</dt>
              <dd>
                {time}
                {slot?.label ? ` · ${slot.label}` : ""}{" "}
                <button type="button" className="linklike" onClick={() => setStep("time")}>
                  Change<span className="sr-only"> time</span>
                </button>
              </dd>
            </div>
          )}
          {stepIndex > 2 && (
            <div>
              <dt>Tickets</dt>
              <dd>
                {count} · {total === 0 ? "Free" : formatPrice(total)}{" "}
                <button type="button" className="linklike" onClick={() => setStep("tickets")}>
                  Change<span className="sr-only"> tickets</span>
                </button>
              </dd>
            </div>
          )}
        </dl>
      )}

      {step === "date" && (
        <section aria-labelledby="step-heading">
          <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="booking__heading">
            <span className="f-serif">Choose a</span> <span className="f-display">date</span>
          </h2>
          <div className="cal">
            <div className="cal__nav">
              <button type="button" className="btn btn--cream" disabled={monthIdx === 0} onClick={() => setMonthIdx((i) => i - 1)}>
                <span aria-hidden="true">←</span>
                <span className="sr-only">Previous month</span>
              </button>
              <h3 className="cal__month f-serif" aria-live="polite">
                {formatMonthYear(`${month}-01`)}
              </h3>
              <button type="button" className="btn btn--cream" disabled={monthIdx === months.length - 1} onClick={() => setMonthIdx((i) => i + 1)}>
                <span aria-hidden="true">→</span>
                <span className="sr-only">Next month</span>
              </button>
            </div>
            <div className="cal__grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="cal__dow f-mono" aria-hidden="true">
                  {d}
                </span>
              ))}
              {Array.from({ length: (weekdayIndex(`${month}-01`) + 6) % 7 }, (_, i) => (
                <span key={`blank-${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth(month) }, (_, i) => {
                const iso = `${month}-${String(i + 1).padStart(2, "0")}`;
                const status = availability[iso] ?? (iso >= runStart && iso <= runEnd ? "good" : "closed");
                const unavailable = status === "closed" || status === "sold-out";
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`cal__day cal__day--${status}`}
                    aria-pressed={date === iso}
                    aria-label={`${formatLongDate(iso)}, ${statusText[status]}`}
                    disabled={unavailable}
                    onClick={() => chooseDate(iso)}
                  >
                    <span>{i + 1}</span>
                    <span className="cal__dot" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <ul className="cal__legend" aria-label="Key">
              <li>
                <span className="cal__dot cal__dot--good" aria-hidden="true" /> Good availability
              </li>
              <li>
                <span className="cal__dot cal__dot--limited" aria-hidden="true" /> Limited
              </li>
              <li>
                <span className="cal__dot cal__dot--sold-out" aria-hidden="true" /> Sold out
              </li>
            </ul>
            <p className="form-hint">
              Quiet hours: Tuesdays and Sundays, 10:00 – 11:00. Fridays open until 21:00. Members can also book the 09:30 members&rsquo; half hour.
            </p>
          </div>
        </section>
      )}

      {step === "time" && (
        <section aria-labelledby="step-heading">
          <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="booking__heading">
            <span className="f-serif">Pick an</span> <span className="f-display">entry time</span>
          </h2>
          <p>Arrive any time in your 30-minute slot and stay as long as you like.</p>
          {!slots && <p role="status">Loading times…</p>}
          {slots && (
            <ul className="slots">
              {slots.map((s) => {
                const soldOut = s.remaining === 0;
                const quiet = s.time === "10:00" && date !== null && [0, 2].includes(weekdayIndex(date));
                return (
                  <li key={s.time}>
                    <button
                      type="button"
                      className={`slot slot--${s.kind} ${soldOut ? "is-sold-out" : ""}`}
                      aria-pressed={time === s.time}
                      disabled={soldOut}
                      onClick={() => {
                        setTime(s.time);
                        setStep("tickets");
                      }}
                    >
                      <span className="slot__time f-display">{s.time}</span>
                      <span className="slot__info">
                        {s.label && <span className="slot__label">{s.label}</span>}
                        {quiet && <span className="slot__label">Quiet hour</span>}
                        <span className="slot__left">{soldOut ? "Sold out" : `${s.remaining} of ${s.capacity} left`}</span>
                      </span>
                      <span className="slot__bar" aria-hidden="true">
                        <span style={{ width: `${Math.round((1 - s.remaining / s.capacity) * 100)}%` }} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {step === "tickets" && (
        <section aria-labelledby="step-heading">
          <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="booking__heading">
            <span className="f-serif">How</span> <span className="f-display">many?</span>
          </h2>
          <div className="qty-list">
            {ticketTypes.map((t) => (
              <div className="qty" key={t.id}>
                <div className="qty__text">
                  <p className="qty__label" id={`qty-${t.id}`}>
                    {t.label}
                  </p>
                  <p className="qty__note">{t.note}</p>
                </div>
                <p className="qty__price">{formatPrice(t.price)}</p>
                <div className="qty__stepper" role="group" aria-labelledby={`qty-${t.id}`}>
                  <button type="button" aria-label={`One fewer ${t.label} ticket`} disabled={quantities[t.id] === 0} onClick={() => bump(t.id, -1)}>
                    −
                  </button>
                  <output aria-live="polite" aria-label={`${t.label} tickets`}>
                    {quantities[t.id]}
                  </output>
                  <button type="button" aria-label={`One more ${t.label} ticket`} disabled={count >= MAX_TICKETS} onClick={() => bump(t.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          {quantities.member > 0 && (
            <div className="form-field booking__member">
              <label htmlFor="member-number">Membership number</label>
              <input
                id="member-number"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value.toUpperCase())}
                placeholder="LH-123456"
                autoComplete="off"
                inputMode="text"
                aria-describedby="member-hint"
              />
              <p id="member-hint" className="form-hint">
                On your card and in your welcome email. In this demo, any number in the format LH-123456 works.
              </p>
            </div>
          )}
          <p className="booking__total">
            Total: <strong>{total === 0 ? "Free" : formatPrice(total)}</strong> for {count} {count === 1 ? "ticket" : "tickets"}
          </p>
          {ticketsTouched && ticketProblems.length > 0 && (
            <div className="form-errors" role="alert">
              <ul>
                {ticketProblems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            className="btn btn--yellow btn--big"
            onClick={() => {
              setTicketsTouched(true);
              if (ticketProblems.length === 0) setStep("details");
            }}
          >
            Continue
          </button>
        </section>
      )}

      {step === "details" && (
        <section aria-labelledby="step-heading">
          <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="booking__heading">
            <span className="f-serif">Your</span> <span className="f-display">details</span>
          </h2>
          <form onSubmit={submit} noValidate>
            <div className="form-field">
              <label htmlFor="lead-name">Lead booker&rsquo;s name</label>
              <input id="lead-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="lead-email">Email for your e-tickets</label>
              <input id="lead-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="block booking__pay" data-tone="cream">
              <h3 className="f-mono">Payment</h3>
              <p>
                {total === 0
                  ? "Nothing to pay: members, under-12s and carers go free."
                  : `Payment of ${formatPrice(total)} is taken securely by our ticketing partner.`}
              </p>
              <p className="form-hint">Design study: this button simulates payment. No card details are asked for or taken.</p>
            </div>
            {problems.length > 0 && (
              <div className="form-errors" role="alert">
                <ul>
                  {problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            <button type="submit" className="btn btn--yellow btn--big" disabled={submitting}>
              {submitting ? "Booking…" : total === 0 ? "Confirm free booking" : `Pay ${formatPrice(total)}`}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

function daysInMonth(month: string) {
  const d = parseDay(`${month}-01`);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
}

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

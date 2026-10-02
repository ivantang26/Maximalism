import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Booking, { type BookingInitial } from "@/components/tickets/Booking";
import { events } from "@/lib/content/events";
import { morePanel } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Tickets for MORE",
  description: "Book timed tickets for MORE at Loud House: choose a date and a 30-minute entry slot. Adults £18, concessions £9, under-12s, carers and members free.",
};

const ticketsPanel = {
  ...morePanel,
  cta: { label: "Plan your visit", href: "/visit" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function TicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const event = events.find((e) => e.slug === one(sp.event));
  const initial: BookingInitial = {
    date: one(sp.date),
    time: one(sp.time),
    member: one(sp.member),
    event: event ? { slug: event.slug, title: event.title, date: event.date, start: event.start } : null,
  };

  return (
    <PageShell
      panel={ticketsPanel}
      hero={
        <PageHero
          preset="checks-cobalt"
          kicker="Tickets"
          title={
            <>
              <span className="f-serif">Book</span> <span className="f-display">More</span>
            </>
          }
          lede="Timed entry, 30-minute slots, stay as long as you like. Members, under-12s and carers go free."
        />
      }
    >
      <section className="band band--tight" aria-label="Booking">
        <div className="wrap">
          <Booking key={JSON.stringify(initial)} initial={initial} />
        </div>
      </section>
    </PageShell>
  );
}

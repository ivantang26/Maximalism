import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import EventsBrowser from "@/components/events/EventsBrowser";
import { events, eventTypeLabel } from "@/lib/content/events";
import { morePanel } from "@/lib/content/site";
import type { EventType } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Lates, talks, family days and access events during MORE at Loud House, including BSL-interpreted, audio-described and relaxed sessions.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const { type } = await searchParams;
  const initialType = typeof type === "string" && type in eventTypeLabel ? (type as EventType) : undefined;

  return (
    <PageShell
      panel={morePanel}
      hero={
        <PageHero
          preset="events-confetti"
          kicker="Events"
          title={
            <>
              <span className="f-serif">Lates, talks</span> <span className="f-mono">&amp;</span> <span className="f-display">days out</span>
            </>
          }
          lede="Every event is included with a MORE ticket. Access events are free for carers, and relaxed openings start an hour before the doors."
        />
      }
    >
      <section className="band band--tight" aria-label="Event listings">
        <div className="wrap">
          <EventsBrowser key={initialType ?? "all"} events={events} initialType={initialType} />
        </div>
      </section>
    </PageShell>
  );
}

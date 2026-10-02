import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import MoreHero from "@/components/more/MoreHero";
import CuratorIntro from "@/components/more/CuratorIntro";
import ArtistWall from "@/components/more/ArtistWall";
import RoomBand from "@/components/more/RoomBand";
import ShopTeaser from "@/components/more/ShopTeaser";
import MembershipBlock from "@/components/MembershipBlock";
import EventCard from "@/components/EventCard";
import { artists } from "@/lib/content/artists";
import { rooms } from "@/lib/content/rooms";
import { events } from "@/lib/content/events";
import { morePanel } from "@/lib/content/site";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";

export const metadata: Metadata = {
  title: "MORE",
  description: "MORE is more: thirty artists, six rooms and no restraint. Loud House, 20 June – 27 September 2027. Timed tickets from £9; members and under-12s free.",
};

/** A mix of event types for the exhibition page: lates, talks and family days first. */
const featured = ["clash-night", "curators-tour-why-more", "pattern-party", "relaxed-opening-july", "soft-and-loud-conversation", "night-bloom-late"];

export default function MorePage() {
  const moreEvents = featured.map((slug) => events.find((e) => e.slug === slug)!);

  return (
    <PageShell panel={morePanel} hero={<MoreHero />}>
      <CuratorIntro />

      <section id="artists" className="band wall-section" data-tone="black" aria-labelledby="artists-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="artists-title" className="section-title">
              <span className="f-display">30</span> <span className="f-serif">artists,</span> <span className="f-mono">one wall</span>
            </h2>
            <p>Painters, weavers, sculptors, photographers and one collective of eleven. Choose an artist to meet them and see their work.</p>
          </div>
          <ArtistWall artists={artists} />
        </div>
      </section>

      <section className="band rooms-intro" data-tone="pink" aria-labelledby="rooms-title">
        <div className="wrap">
          <h2 id="rooms-title" className="section-title">
            <span className="f-mono">Six rooms</span>
            <br />
            <span className="f-serif">Room by</span> <span className="f-display">room</span>
          </h2>
          <ol className="rooms-intro__list">
            {rooms.map((r) => (
              <li key={r.number}>
                <a href={`#room-${r.number}`}>
                  <span className="f-display">{String(r.number).padStart(2, "0")}</span> {r.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {rooms.map((room) => (
        <RoomBand key={room.number} room={room} />
      ))}

      <section className="band pattern" style={patternStyle(presets["events-confetti"].pattern)} aria-labelledby="events-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="events-title" className="section-title headline-block" data-tone="black">
              <span className="f-serif">Lates, talks</span> <span className="f-mono">&amp;</span> <span className="f-display">family days</span>
            </h2>
          </div>
          <ul className="events-grid events-grid--3">
            {moreEvents.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
          <p className="events-more">
            <Link href="/events" className="btn btn--yellow">
              All {events.length} events
            </Link>
          </p>
        </div>
      </section>

      <ShopTeaser />
      <MembershipBlock />
    </PageShell>
  );
}

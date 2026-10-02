import Link from "next/link";
import PageShell from "@/components/PageShell";
import Collage from "@/components/Collage";
import ExhibitionCard from "@/components/ExhibitionCard";
import EventCard from "@/components/EventCard";
import MembershipBlock from "@/components/MembershipBlock";
import CalmToggle from "@/components/CalmToggle";
import { exhibitions } from "@/lib/content/exhibitions";
import { events } from "@/lib/content/events";
import { galleryPanel, more } from "@/lib/content/site";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";

function HomeHero() {
  const preset = presets["home-clash"];
  return (
    <section className="home-hero pattern" style={patternStyle(preset.pattern)} aria-labelledby="home-title">
      <Collage id="home" />
      <div className="home-hero__inner">
        <h1 id="home-title" className="home-hero__title">
          <span className="home-hero__line f-mono" data-tone="black">
            Contemporary
          </span>{" "}
          <span className="home-hero__line f-serif" data-tone="yellow">
            art, at
          </span>{" "}
          <span className="home-hero__line f-display" data-tone="pink">
            full
          </span>{" "}
          <span className="home-hero__line f-serif" data-tone="cream">
            volume.
          </span>
        </h1>
        <div className="home-hero__promo" data-tone="black">
          <p className="f-mono accent">Summer exhibition · {more.dates}</p>
          <p className="home-hero__more">
            <span className="f-display">More</span> <span className="f-serif">is more</span>
          </p>
          <p>Thirty artists from twenty cities. Six rooms. No restraint whatsoever.</p>
          <div className="home-hero__actions">
            <Link href="/tickets" className="btn btn--yellow">
              Book tickets
            </Link>
            <Link href="/more" className="text-link">
              Explore MORE <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const upcoming = events.slice(0, 4);
  return (
    <PageShell panel={galleryPanel} hero={<HomeHero />}>
      <section className="band" aria-labelledby="whats-on-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="whats-on-title" className="section-title">
              <span className="f-serif">What&rsquo;s</span> <span className="f-display">on</span>
            </h2>
            <p>Entry to Loud House is free. MORE is ticketed; everything else is just a walk in.</p>
          </div>
          <ul className="card-grid">
            {exhibitions.map((ex) => (
              <li key={ex.slug}>
                <ExhibitionCard exhibition={ex} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" data-tone="black" aria-labelledby="home-events-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="home-events-title" className="section-title">
              <span className="f-mono accent">Coming up</span>
              <br />
              <span className="f-serif">Lates, talks</span> <span className="f-display">&amp; more</span>
            </h2>
            <Link href="/events" className="btn btn--yellow">
              All events
            </Link>
          </div>
          <ul className="events-grid">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band calm-promo" data-tone="cream" aria-labelledby="calm-title">
        <div className="wrap calm-promo__grid">
          <div>
            <p className="f-mono accent">Loud frame, quiet facts</p>
            <h2 id="calm-title" className="section-title">
              <span className="f-serif">Too much?</span> <span className="f-display">Go calm.</span>
            </h2>
          </div>
          <div className="measure">
            <p className="lede">
              Calm mode turns this whole website into black text on cream: no patterns, no collage, no movement. It stays on while you browse.
            </p>
            <p>
              In the building, quiet hours run on Tuesdays and Sundays from 10:00 to 11:00, and the <Link href="/visit#access">sensory map</Link> shows where
              every room is loud, bright or busy.
            </p>
            <CalmToggle variant="inline" />
          </div>
        </div>
      </section>

      <MembershipBlock />
    </PageShell>
  );
}

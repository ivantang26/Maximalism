import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { galleryPanel, site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Learning",
  description: "Free school workshops, family days, the Loud Crew for 14 to 21 year olds and evening courses at Loud House.",
};

const programmes = [
  {
    id: "schools",
    tone: "yellow",
    kicker: "Ages 4–18",
    title: "Schools",
    text: "Free, artist-led workshops for primary and secondary schools, in the galleries and the print studio. Every MORE workshop ends with a pattern your class designed together. SEND sessions are available on Tuesday mornings during quiet hours.",
    action: { label: "Email the schools team", href: `mailto:schools@loudhouse.example` },
  },
  {
    id: "families",
    tone: "pink",
    kicker: "Ages 3 and up",
    title: "Families",
    text: "Monthly family days during MORE, plus free Pattern Packs to borrow at the entrance: a backpack with ear defenders, a sensory fidget, a sketchbook and a MORE spotting game.",
    action: { label: "See family days", href: "/events?type=family" },
  },
  {
    id: "loud-crew",
    tone: "cobalt",
    kicker: "Ages 14–21",
    title: "Loud Crew",
    text: "Our paid youth collective meets every Thursday evening. This summer the Crew is programming the last MORE Late, from the DJs to the drinks menu. Applications open in January.",
    action: { label: "Find out about the Crew", href: `mailto:crew@loudhouse.example` },
  },
  {
    id: "adults",
    tone: "orange",
    kicker: "Adults",
    title: "Evening courses",
    text: "Six-week courses in screen printing, collage and pattern design, taught by artists from MORE. Materials included. Concession places are available on every course.",
    action: { label: "Ask about courses", href: `mailto:${site.email}` },
  },
] as const;

export default function LearningPage() {
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="room-squiggle"
          kicker="Learning"
          title={
            <>
              <span className="f-serif">Make</span> <span className="f-display">noise</span>
            </>
          }
          lede="Workshops, courses and collectives for every age. Most of it is free, and all of it is hands-on."
        />
      }
    >
      <section className="band" aria-label="Programmes">
        <div className="wrap">
          <ul className="card-grid">
            {programmes.map((p) => (
              <li key={p.id} id={p.id} className="block programme" data-tone={p.tone}>
                <p className="f-mono">{p.kicker}</p>
                <h2 className="programme__title f-serif">{p.title}</h2>
                <p>{p.text}</p>
                <p>
                  <Link href={p.action.href} className="text-link">
                    {p.action.label}
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import ExhibitionCard from "@/components/ExhibitionCard";
import { exhibitions } from "@/lib/content/exhibitions";
import { galleryPanel } from "@/lib/content/site";
import { exhibitionStatus } from "@/lib/format";

export const metadata: Metadata = {
  title: "Exhibitions",
  description: "Exhibitions at Loud House: MORE, Soft Machines, The Quiet Room and what's coming next.",
};

const groups = [
  { id: "current", title: "On now", test: (s: string, end: string | null) => s === "current" && end !== null },
  { id: "always", title: "Always on", test: (_: string, end: string | null) => end === null },
  { id: "upcoming", title: "Coming soon", test: (s: string, end: string | null) => s === "upcoming" && end !== null },
  { id: "past", title: "Recently closed", test: (s: string, end: string | null) => s === "past" && end !== null },
];

export const revalidate = 86400; // statuses change with the calendar

export default function ExhibitionsPage() {
  const withStatus = exhibitions.map((ex) => ({ ex, status: exhibitionStatus(ex.start, ex.end) }));
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="leopard-pink"
          kicker="Exhibitions"
          title={
            <>
              <span className="f-serif">Everything</span> <span className="f-display">on</span>
            </>
          }
          lede="Free to enter, except MORE. Four galleries, one quiet room, and one very loud summer."
        />
      }
    >
      {groups.map((g) => {
        const items = withStatus.filter(({ ex, status }) => g.test(status, ex.end));
        if (items.length === 0) return null;
        return (
          <section key={g.id} className="band band--tight" aria-labelledby={`ex-${g.id}`}>
            <div className="wrap">
              <h2 id={`ex-${g.id}`} className="section-title">
                <span className="f-serif">{g.title}</span>
              </h2>
              <ul className="card-grid ex-grid">
                {items.map(({ ex }) => (
                  <li key={ex.slug}>
                    <ExhibitionCard exhibition={ex} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </PageShell>
  );
}

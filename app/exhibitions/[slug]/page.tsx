import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Artwork from "@/components/Artwork";
import { exhibitionWork, exhibitions, getExhibition } from "@/lib/content/exhibitions";
import { galleryPanel } from "@/lib/content/site";
import type { InfoPanelData } from "@/lib/content/types";
import { formatRange } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return exhibitions.filter((e) => e.slug !== "more").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const ex = getExhibition((await params).slug);
  return ex ? { title: ex.title, description: ex.summary } : {};
}

export default async function ExhibitionPage({ params }: { params: Params }) {
  const ex = getExhibition((await params).slug);
  if (!ex || ex.slug === "more") notFound();

  const free = ex.admission === "Free";
  const panel: InfoPanelData = {
    ...galleryPanel,
    eyebrow: "Exhibition",
    title: ex.title,
    dates: `${formatRange(ex.start, ex.end)} · ${ex.where}`,
    pricesHeading: "Admission",
    prices: [{ label: "Admission", value: ex.admission }],
    cta: free ? { label: "Plan your visit", href: "/visit" } : { label: "Members book first", href: "/membership" },
    secondary: { label: "See MORE, our summer show", href: "/more" },
  };

  return (
    <PageShell
      panel={panel}
      hero={
        <PageHero
          preset={ex.preset}
          kicker={`${formatRange(ex.start, ex.end)} · ${ex.where}`}
          title={<span className="f-serif">{ex.title}</span>}
          lede={ex.subtitle}
        />
      }
    >
      <section className="band" aria-label="About the exhibition">
        <div className="wrap split">
          <div className="prose">
            <p className="lede">{ex.summary}</p>
            {ex.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p>
              <strong>Admission:</strong> {ex.admission}
            </p>
            <p>
              <Link href="/exhibitions">All exhibitions</Link>
            </p>
          </div>
          <div className="ex-works">
            {ex.works.map((id) => {
              const { work, artistName } = exhibitionWork(id);
              return (
                <figure key={id} className="ex-works__item">
                  <div className="room__frame">
                    <Artwork work={work} />
                  </div>
                  <figcaption data-tone="black">
                    <span className="f-serif">{work.title}</span>, {work.year}. {artistName}. {work.medium}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

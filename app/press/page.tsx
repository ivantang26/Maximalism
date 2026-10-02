import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Artwork from "@/components/Artwork";
import { galleryPanel } from "@/lib/content/site";
import { getWork } from "@/lib/content/artists";

export const metadata: Metadata = {
  title: "Press",
  description: "Press releases, images and contacts for Loud House and MORE.",
};

const releases = [
  {
    date: "2027-03-02",
    title: "Loud House announces MORE, its biggest exhibition yet",
    text: "Thirty artists from twenty cities fill Galleries 1 and 2 with maximalist painting, textiles, sculpture, light and photography from 20 June to 27 September 2027. Tickets go on sale to members on 1 April and to everyone on 15 April.",
  },
  {
    date: "2027-04-15",
    title: "MORE tickets on sale, with quiet hours and a calm-mode website",
    text: "Timed tickets start at £9, with free entry for under-12s, carers and members. Quiet hours run on Tuesdays and Sundays, and the exhibition website includes a low-stimulation calm mode.",
  },
  {
    date: "2027-05-20",
    title: "The Confetti Collective invites visitors to add to MORE",
    text: "Room 6 of MORE will grow every day as visitors bring offcuts of paper for the Manchester collective's room-sized collage, Everything Must Stay.",
  },
];

const images = ["ines-obrador-1", "noor-haddad-1", "tunde-bakare-1", "zanele-mokoena-1", "the-confetti-collective-1", "priya-ramanathan-1"];

export default function PressPage() {
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="quiet-grid"
          kicker="Press"
          title={
            <>
              <span className="f-serif">Press</span> <span className="f-display">room</span>
            </>
          }
          lede="Releases, images and interviews. The MORE press view is on Thursday 17 June 2027, 10:00 – 13:00."
        />
      }
    >
      <section className="band band--tight" aria-labelledby="releases-title">
        <div className="wrap">
          <h2 id="releases-title" className="section-title">
            <span className="f-serif">Releases</span>
          </h2>
          <ul className="releases">
            {releases.map((r) => (
              <li key={r.date} className="block" data-tone="cream">
                <p className="f-mono">
                  <time dateTime={r.date}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(r.date))}</time>
                </p>
                <h3 className="releases__title">{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="band band--tight" data-tone="black" aria-labelledby="images-title">
        <div className="wrap">
          <h2 id="images-title" className="section-title">
            <span className="f-serif">Images</span>
          </h2>
          <p className="measure">
            High-resolution images are available for press use during the exhibition, credited as shown. Email the press office with the images you need and
            your publication.
          </p>
          <ul className="press-images">
            {images.map((id) => {
              const { work, artist } = getWork(id);
              return (
                <li key={id}>
                  <figure>
                    <div className="press-images__art">
                      <Artwork work={work} />
                    </div>
                    <figcaption>
                      {artist.name}, <em>{work.title}</em>, {work.year}. Courtesy the artist and Loud House.
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="band band--tight" aria-labelledby="contact-title">
        <div className="wrap">
          <div className="block" data-tone="yellow">
            <h2 id="contact-title" className="f-serif programme__title">
              Press office
            </h2>
            <p>
              <a href="mailto:press@loudhouse.example">press@loudhouse.example</a> · <a href="tel:02079460001">020 7946 0001</a>
            </p>
            <p>Monday to Friday, 09:30 – 17:30. Out of hours for urgent enquiries only.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

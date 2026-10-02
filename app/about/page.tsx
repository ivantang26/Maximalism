import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { galleryPanel, site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Loud House is a free contemporary art gallery in a former dye works in Hackney Wick, east London.",
};

const values = [
  { tone: "yellow", title: "Free to enter", text: "The gallery, the Quiet Room and most of our programme cost nothing. We charge for one big exhibition a year so the rest can stay free." },
  { tone: "pink", title: "Loud on purpose", text: "We show art that is joyful, crowded, colourful and a bit too much, and we think that deserves the same seriousness as anything minimal." },
  { tone: "cobalt", title: "Calm when you need it", text: "Quiet hours, a sensory map, a quiet room and a calm mode for this website. The facts are always easy to find." },
  { tone: "black", title: "Artists get paid", text: "Every artist in every show receives a fee, above the industry guidelines, whether their work is for sale or not." },
] as const;

export default function AboutPage() {
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="leopard-pink"
          kicker="About"
          title={
            <>
              <span className="f-serif">A loud house</span> <span className="f-display">for art</span>
            </>
          }
          lede="Since 2019, a free gallery in a Victorian dye works by the canal in Hackney Wick."
        />
      }
    >
      <section className="band" aria-labelledby="story-title">
        <div className="wrap split">
          <div className="prose">
            <h2 id="story-title" className="f-serif">
              The building still has colour in its walls
            </h2>
            <p>
              From 1889 to 1971 this building dyed cloth for half of east London. When we stripped the plaster back in 2018 the brick underneath was stained pink,
              orange and blue. We kept it.
            </p>
            <p>
              Loud House opened in 2019 with four galleries, a print studio, a learning space and a canteen. Around 300,000 people visit each year. Entry is
              free; one exhibition a year, like MORE, is ticketed.
            </p>
            <p>
              Loud House is a registered charity, funded by ticket sales, members, trusts and foundations, and our shop and canteen. Every membership keeps the
              doors free for someone else.
            </p>
          </div>
          <div className="block principle" data-tone="yellow">
            <p className="f-mono">Our design principle</p>
            <h2 className="principle__title">
              <span className="f-display">Loud</span> <span className="f-serif">frame,</span>
              <br />
              <span className="f-mono">quiet facts</span>
            </h2>
            <p>
              Around the edges, as much colour, pattern and noise as the art deserves. In the middle, a calm, consistent panel with the dates, prices,
              opening hours and access information, the same on every page. You can find it on the right of this page, or in the bar at the bottom of your
              phone.
            </p>
            <p>
              <Link href="/design-system">See how the website&rsquo;s design system works</Link>
            </p>
          </div>
        </div>
      </section>
      <section className="band band--tight" aria-labelledby="values-title">
        <div className="wrap">
          <h2 id="values-title" className="section-title">
            <span className="f-serif">What we</span> <span className="f-display">believe</span>
          </h2>
          <ul className="card-grid values">
            {values.map((v) => (
              <li key={v.title} className="block" data-tone={v.tone}>
                <h3 className="programme__title f-serif">{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
          <p className="about__contact">
            General enquiries: <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a> ·{" "}
            <Link href="/press">Press</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

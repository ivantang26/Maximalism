import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { galleryPanel } from "@/lib/content/site";

export default function NotFound() {
  return (
    <PageShell
      panel={galleryPanel}
      hero={
        <PageHero
          preset="leopard-pink"
          kicker="Error 404"
          title={
            <>
              <span className="f-serif">Less</span> <span className="f-display">here</span>
            </>
          }
          lede="There's nothing at this address. For once, we have less to show you."
        >
          <p className="not-found__actions">
            <Link href="/more" className="btn btn--yellow">
              See MORE
            </Link>
            <Link href="/visit" className="btn btn--cream">
              Plan your visit
            </Link>
          </p>
        </PageHero>
      }
    >
      <div />
    </PageShell>
  );
}

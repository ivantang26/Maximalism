import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import MembershipFlow from "@/components/membership/MembershipFlow";
import { galleryPanel, membershipTiers } from "@/lib/content/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Membership",
  description: "Loud House members go free to MORE and every exhibition, book priority slots including the 09:30 members' half hour, and get 10% off.",
};

const panel = { ...galleryPanel, cta: { label: "Book tickets", href: "/tickets" }, secondary: { label: "Plan your visit", href: "/visit" } };

export default function MembershipPage() {
  return (
    <PageShell
      panel={panel}
      hero={
        <PageHero
          preset="member-zigzag"
          kicker="Membership"
          title={
            <>
              <span className="f-serif">Members go</span> <span className="f-display">free</span>
            </>
          }
          lede="Unlimited entry to MORE and every exhibition, priority slots, the members' half hour at 09:30, and 10% off in the shop and canteen."
        />
      }
    >
      <section className="band band--tight" aria-labelledby="tiers-title">
        <div className="wrap">
          <h2 id="tiers-title" className="section-title">
            <span className="f-serif">Pick your</span> <span className="f-display">volume</span>
          </h2>
          <ul className="tiers">
            {membershipTiers.map((t) => (
              <li key={t.id} className="tier" data-tone={t.tone}>
                <h3 className="tier__name f-serif">{t.name}</h3>
                <p className="tier__price">
                  <span className="f-display">{formatPrice(t.price)}</span> <span className="f-mono">a year</span>
                </p>
                <p className="tier__monthly">or {formatPrice(t.monthly)} a month by Direct Debit</p>
                <ul className="tier__perks">
                  {t.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="band band--tight" aria-label="Join or renew">
        <div className="wrap">
          <MembershipFlow />
        </div>
      </section>
    </PageShell>
  );
}

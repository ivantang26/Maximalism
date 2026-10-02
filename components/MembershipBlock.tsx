import Link from "next/link";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";

export default function MembershipBlock() {
  const preset = presets["member-zigzag"];
  return (
    <section className="band member pattern" style={patternStyle(preset.pattern)} aria-labelledby="member-title">
      <div className="wrap">
        <div className="member__card" data-tone="black">
          <p className="f-mono accent">Membership</p>
          <h2 id="member-title" className="member__title">
            <span className="f-serif">Members go</span> <span className="f-display">free.</span>
            <span className="f-serif member__small"> Every day.</span>
          </h2>
          <ul className="member__perks">
            <li>Unlimited free entry to MORE and every exhibition</li>
            <li>Priority slots, including the members&rsquo; half hour at 09:30</li>
            <li>10% off in the shop and canteen</li>
            <li>Preview evenings before shows open</li>
          </ul>
          <div className="member__actions">
            <Link href="/membership" className="btn btn--yellow">
              Join from £30 a year
            </Link>
            <Link href="/membership#renew">Already a member? Renew</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

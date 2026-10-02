import Link from "next/link";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";
import { site, openingHours } from "@/lib/content/site";
import { visitCopy, visitLangs } from "@/lib/content/visit";
import { primaryNav, secondaryNav } from "@/lib/nav";

export default function Footer() {
  const confetti = presets["footer-confetti"].pattern;
  return (
    <footer className="site-footer" data-tone="black">
      <div className="site-footer__edge pattern" style={patternStyle(confetti)} aria-hidden="true" />
      <div className="site-footer__inner">
        <section aria-labelledby="footer-visit">
          <h2 id="footer-visit" className="site-footer__heading">
            Visit
          </h2>
          <address>
            {site.address.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
          <dl className="site-footer__hours">
            {openingHours.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p>
            <Link href="/visit">Plan your visit</Link> · <Link href="/visit#access">Access</Link>
          </p>
        </section>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="site-footer__heading">
            Explore
          </h2>
          <ul>
            {[...primaryNav, { href: "/tickets", label: "Tickets" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={site.shopUrl} target="_blank" rel="noopener">
                Shop<span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-more">
          <h2 id="footer-more" className="site-footer__heading">
            Loud House
          </h2>
          <ul>
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-lang">
          <h2 id="footer-lang" className="site-footer__heading">
            Visitor information
          </h2>
          <ul>
            {visitLangs.map((l) => (
              <li key={l}>
                <Link href={visitCopy[l].path} lang={visitCopy[l].htmlLang} hrefLang={visitCopy[l].htmlLang}>
                  {visitCopy[l].endonym}
                </Link>
              </li>
            ))}
          </ul>
          <p className="site-footer__contact">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </nav>
      </div>
      <p className="site-footer__wordmark" aria-hidden="true">
        <span>Loud</span> <span>House</span>
      </p>
      <p className="site-footer__legal">
        Loud House and MORE are fictional, made as a design study. Every artist, artwork and event on this site is invented. Payments, emails and wallet passes are simulated.
      </p>
    </footer>
  );
}

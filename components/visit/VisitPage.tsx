import Link from "next/link";
import PageShell from "../PageShell";
import PageHero from "../PageHero";
import CalmToggle from "../CalmToggle";
import { visitCopy, visitLangs, galleryAddress, type VisitLang } from "@/lib/content/visit";

function MapSketch() {
  // Decorative orientation sketch; the directions beside it carry the information.
  return (
    <svg viewBox="0 0 400 260" className="visit-map" aria-hidden="true" data-decor>
      <rect width="400" height="260" fill="#FFF6E6" />
      <path d="M-10 190C80 160 140 220 230 190S360 150 410 170" fill="none" stroke="#1F3FFF" strokeWidth="26" />
      <path d="M40 0V260M0 70H400M150 0V260M260 0V260M0 130H400" stroke="#111" strokeWidth="3" strokeDasharray="2 8" />
      <path d="M0 40L400 100" stroke="#FF6A13" strokeWidth="10" />
      <circle cx="96" cy="54" r="16" fill="#FF6A13" stroke="#111" strokeWidth="4" />
      <path d="M96 54L150 66L205 70" fill="none" stroke="#111" strokeWidth="5" strokeDasharray="10 7" />
      <path d="M205 44l7 16 17 1-13 11 4 17-15-9-15 9 4-17-13-11 17-1z" fill="#FF3EA5" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
      <rect x="226" y="30" width="118" height="30" fill="#111" />
      <text x="236" y="51" fill="#F4FF3E" fontFamily="monospace" fontWeight="700" fontSize="15">LOUD HOUSE</text>
      <rect x="40" y="82" width="118" height="26" fill="#111" />
      <text x="48" y="100" fill="#FFF6E6" fontFamily="monospace" fontSize="13">HACKNEY WICK</text>
      <text x="270" y="212" fill="#FFF6E6" fontFamily="monospace" fontSize="13" fontWeight="700">CANAL</text>
    </svg>
  );
}

export default function VisitPage({ lang }: { lang: VisitLang }) {
  const t = visitCopy[lang];
  return (
    <PageShell
      panel={t.panel}
      hero={
        <PageHero preset="squiggle-leaf" kicker="Loud House · Hackney Wick" title={<span className="f-serif">{t.title}</span>} lede={t.intro} lang={t.htmlLang}>
          <nav className="lang-switch" aria-label={t.languageLabel} data-tone="black">
            <span className="f-mono lang-switch__label">{t.languageLabel}</span>
            <ul>
              {visitLangs.map((l) => (
                <li key={l}>
                  <Link
                    href={visitCopy[l].path}
                    lang={visitCopy[l].htmlLang}
                    hrefLang={visitCopy[l].htmlLang}
                    aria-current={l === lang ? "page" : undefined}
                  >
                    {visitCopy[l].endonym}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </PageHero>
      }
    >
      <div lang={t.htmlLang} className="visit">
        <nav className="band band--tight visit-toc" aria-label={t.title}>
          <div className="wrap">
            <ul>
              {(Object.keys(t.toc) as (keyof typeof t.toc)[]).map((k) => (
                <li key={k}>
                  <a href={`#${k}`} className="chip">
                    {t.toc[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <section id="hours" className="band band--tight" aria-labelledby="hours-title">
          <div className="wrap split">
            <div className="block" data-tone="cream">
              <h2 id="hours-title" className="visit__h2 f-serif">
                {t.toc.hours}
              </h2>
              <dl className="facts">
                {t.hours.rows.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="visit__note">{t.hours.note}</p>
            </div>
            <div id="tickets" className="block" data-tone="yellow">
              <h2 className="visit__h2 f-serif">{t.toc.tickets}</h2>
              <p>{t.tickets.intro}</p>
              <dl className="facts">
                {t.tickets.rows.map((r) => (
                  <div key={r.label}>
                    <dt>
                      {r.label}
                      {r.note && <span className="facts__note">{r.note}</span>}
                    </dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="visit__actions">
                <Link href="/tickets" className="btn btn--black">
                  {t.tickets.cta}
                </Link>
              </p>
              <p>
                {t.tickets.members} <Link href="/membership">{t.tickets.membersCta}</Link>
              </p>
            </div>
          </div>
        </section>

        <section id="getting" className="band band--tight" aria-labelledby="getting-title">
          <div className="wrap split">
            <div className="block" data-tone="cream">
              <h2 id="getting-title" className="visit__h2 f-serif">
                {t.toc.getting}
              </h2>
              <h3 className="f-mono visit__h3">{t.getting.addressLabel}</h3>
              <address className="visit__address">
                {galleryAddress.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
              <dl className="facts">
                {t.getting.items.map((i) => (
                  <div key={i.title} className="facts--stack">
                    <dt>{i.title}</dt>
                    <dd>{i.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="visit__map">
              <MapSketch />
            </div>
          </div>
        </section>

        <section id="access" className="band band--tight" aria-labelledby="access-title">
          <div className="wrap">
            <div className="block" data-tone="cobalt">
              <h2 id="access-title" className="visit__h2 f-serif">
                {t.toc.access}
              </h2>
              <p className="lede">{t.access.intro}</p>
            </div>
            <ul className="access-grid">
              {t.access.items.map((item) => (
                <li key={item.id} id={item.id} className="block" data-tone="cream">
                  <h3 className="access-grid__title">{item.title}</h3>
                  <p>{item.text}</p>
                  {item.link && (
                    <p>
                      <a href={item.link.href} className="text-link">
                        {item.link.label}
                      </a>
                    </p>
                  )}
                </li>
              ))}
              <li id="calm-mode" className="block access-grid__calm" data-tone="black">
                <h3 className="access-grid__title">{t.access.calmTitle}</h3>
                <p>{t.access.calmText}</p>
                <CalmToggle variant="inline" onLabel={t.access.calmOn} offLabel={t.access.calmOff} />
              </li>
            </ul>
          </div>
        </section>

        <section id="cafe" className="band band--tight" aria-labelledby="cafe-title">
          <div className="wrap">
            <div className="block visit__cafe" data-tone="pink">
              <h2 id="cafe-title" className="visit__h2">
                <span className="f-mono">{t.toc.cafe}</span> <span className="f-serif">{t.cafe.name}</span>
              </h2>
              <p className="lede">{t.cafe.text}</p>
              <p>
                <strong>{t.cafe.hours}</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

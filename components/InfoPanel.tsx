import Link from "next/link";
import type { InfoPanelData, InfoRow } from "@/lib/content/types";

function Rows({ rows }: { rows: InfoRow[] }) {
  return (
    <dl className="info-panel__rows">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>
            {row.value}
            {row.note && <span className="info-panel__note">{row.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The calm information panel (FR-4): cream, black Inter, a 2px border and nothing else.
 * Same structure on every page, whatever is happening around it.
 */
export default function InfoPanel({ data, headingId }: { data: InfoPanelData; headingId: string }) {
  return (
    <div className="info-panel" lang={data.lang}>
      <p className="info-panel__eyebrow">{data.eyebrow}</p>
      <h2 id={headingId} className="info-panel__title">
        {data.title}
      </h2>
      {data.dates && <p className="info-panel__dates">{data.dates}</p>}

      <h3 className="info-panel__heading">{data.hoursHeading}</h3>
      <Rows rows={data.hours} />

      <h3 className="info-panel__heading">{data.pricesHeading}</h3>
      <Rows rows={data.prices} />

      <Link href={data.cta.href} className="btn btn--black btn--block info-panel__cta">
        {data.cta.label}
      </Link>
      {data.secondary && (
        <p className="info-panel__secondary">
          <Link href={data.secondary.href}>{data.secondary.label}</Link>
        </p>
      )}

      <h3 className="info-panel__heading">{data.accessHeading}</h3>
      <ul className="info-panel__links">
        {data.access.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>

      <h3 className="info-panel__heading">{data.addressHeading}</h3>
      <p className="info-panel__address">
        {data.address.map((line, i) => (
          <span key={line}>
            {line}
            {i < data.address.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

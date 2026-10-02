"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import InfoPanel from "./InfoPanel";
import type { InfoPanelData } from "@/lib/content/types";

/** Mobile and tablet: a sticky bar at the bottom that opens the panel as a full-height sheet. */
export default function InfoSheet({ data }: { data: InfoPanelData }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const first = data.hours[0];

  return (
    <>
      <div className="infobar" lang={data.lang}>
        <button type="button" className="infobar__open" aria-haspopup="dialog" onClick={() => ref.current?.showModal()}>
          <span className="infobar__label">{data.barLabel}</span>
          <span className="infobar__summary">
            {first.label} {first.value}
          </span>
          <span className="infobar__chevron" aria-hidden="true">
            ↑
          </span>
        </button>
        <Link href={data.cta.href} className="btn btn--black infobar__cta">
          {data.cta.label}
        </Link>
      </div>
      <dialog
        ref={ref}
        className="sheet"
        aria-labelledby="sheet-title"
        onClick={(e) => {
          const target = e.target as Element;
          if (target === e.currentTarget || target.closest("a")) ref.current?.close();
        }}
      >
        <div className="sheet__body">
          <button type="button" className="sheet__close" onClick={() => ref.current?.close()}>
            {data.closeLabel}
            <span aria-hidden="true"> ✕</span>
          </button>
          <InfoPanel data={data} headingId="sheet-title" />
        </div>
      </dialog>
    </>
  );
}

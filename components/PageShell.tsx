import type { ReactNode } from "react";
import InfoPanel from "./InfoPanel";
import InfoSheet from "./InfoSheet";
import type { InfoPanelData } from "@/lib/content/types";

/**
 * Every page is built on this shell so the information panel sits in the same place
 * everywhere: a sticky right-hand sidebar on desktop, a sticky bottom bar and sheet
 * below 1200px. Sections inside the shell reserve space for the sidebar themselves.
 */
export default function PageShell({ panel, hero, children }: { panel: InfoPanelData; hero?: ReactNode; children: ReactNode }) {
  return (
    <>
      {hero}
      <InfoSheet data={panel} />
      <div className="shell">
        <aside className="shell__aside" aria-labelledby="panel-title">
          <div className="shell__sticky">
            <InfoPanel data={panel} headingId="panel-title" />
          </div>
        </aside>
        {children}
      </div>
    </>
  );
}

import { NextResponse, type NextRequest } from "next/server";
import { isOpenDay, slotsFor } from "@/lib/ticketing";

/** GET /api/ticketing/slots?date=2027-07-02 → 30-minute entry slots with live capacity. */
export function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  if (!isOpenDay(date)) return NextResponse.json({ date, slots: [] });
  return NextResponse.json({ date, slots: slotsFor(date) });
}

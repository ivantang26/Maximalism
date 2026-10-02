import { NextResponse, type NextRequest } from "next/server";
import { availabilityFor } from "@/lib/ticketing";
import { addDays } from "@/lib/format";

/** GET /api/ticketing/availability?month=2027-07 → availability for every day in that month. */
export function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ error: "month must be YYYY-MM" }, { status: 400 });

  const days: { date: string; status: ReturnType<typeof availabilityFor> }[] = [];
  for (let d = `${month}-01`; d.startsWith(month); d = addDays(d, 1)) {
    days.push({ date: d, status: availabilityFor(d) });
  }
  return NextResponse.json({ month, days });
}

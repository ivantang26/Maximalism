import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { emptyQuantities, placeOrder, ticketTypes, type OrderRequest, type Quantities } from "@/lib/ticketing";

function readQuantities(input: unknown): Quantities {
  const q = emptyQuantities();
  if (input && typeof input === "object") {
    for (const t of ticketTypes) {
      const n = Number((input as Record<string, unknown>)[t.id]);
      q[t.id] = Number.isInteger(n) && n > 0 ? n : 0;
    }
  }
  return q;
}

/**
 * POST /api/ticketing/orders
 * In production this calls the ticketing platform, which takes payment, emails the
 * e-ticket and issues Apple and Google wallet passes. Here it validates, reserves
 * capacity in memory and returns the QR code for the e-ticket.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ problems: ["Could not read the booking."] }, { status: 400 });
  }

  const request: OrderRequest = {
    date: String(body.date ?? ""),
    time: String(body.time ?? ""),
    quantities: readQuantities(body.quantities),
    name: String(body.name ?? "").slice(0, 120),
    email: String(body.email ?? "").slice(0, 200),
    memberNumber: body.memberNumber ? String(body.memberNumber).toUpperCase() : undefined,
    event: body.event ? String(body.event) : undefined,
  };

  const result = placeOrder(request);
  if (!result.ok) return NextResponse.json({ problems: result.problems }, { status: 422 });

  const { order } = result;
  const qrSvg = await QRCode.toString(`LOUDHOUSE|${order.ref}|${order.date}|${order.time}`, {
    type: "svg",
    margin: 1,
    color: { dark: "#111111", light: "#FFF6E6" },
    errorCorrectionLevel: "M",
  });

  return NextResponse.json({
    order: { ...order, email: order.email },
    qrSvg,
    wallet: { apple: "simulated", google: "simulated" },
  });
}

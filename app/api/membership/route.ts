import { NextResponse } from "next/server";
import { membershipTiers } from "@/lib/content/site";
import { MEMBER_NUMBER } from "@/lib/ticketing";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/membership: join or renew (FR-2). A stand-in for the CRM and payment
 * provider; membership numbers use the same LH-123456 format the ticketing flow checks.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const problems: string[] = [];

  if (body.action === "join") {
    const tier = membershipTiers.find((t) => t.id === body.tier);
    if (!tier) problems.push("Choose a membership.");
    if (!body.name?.trim()) problems.push("Enter your name.");
    if (!EMAIL.test(body.email ?? "")) problems.push("Enter an email address.");
    if (problems.length || !tier) return NextResponse.json({ problems }, { status: 422 });
    const number = `LH-${String(Math.floor(100000 + Math.random() * 900000))}`;
    return NextResponse.json({ action: "join", number, tier: tier.name, name: body.name.trim(), validUntil: oneYearFromNow() });
  }

  if (body.action === "renew") {
    if (!MEMBER_NUMBER.test(body.number ?? "")) problems.push("Enter your membership number in the format LH-123456.");
    if (!EMAIL.test(body.email ?? "")) problems.push("Enter the email address on your membership.");
    if (problems.length) return NextResponse.json({ problems }, { status: 422 });
    return NextResponse.json({ action: "renew", number: body.number.toUpperCase(), validUntil: oneYearFromNow() });
  }

  return NextResponse.json({ problems: ["Unknown action."] }, { status: 400 });
}

function oneYearFromNow() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

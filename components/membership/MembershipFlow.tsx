"use client";

import Link from "next/link";
import { useState } from "react";
import { membershipTiers, type MembershipTierId } from "@/lib/content/site";
import { formatLongDate, formatPrice } from "@/lib/format";

type Result =
  | { action: "join"; number: string; tier: string; name: string; validUntil: string }
  | { action: "renew"; number: string; validUntil: string };

/** Join or renew (FR-2). Joining returns a membership number that works straight away in ticket booking. */
export default function MembershipFlow() {
  const [tier, setTier] = useState<MembershipTierId>("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [renewNumber, setRenewNumber] = useState("");
  const [renewEmail, setRenewEmail] = useState("");
  const [problems, setProblems] = useState<{ form: "join" | "renew"; list: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function send(form: "join" | "renew", body: Record<string, string>) {
    setBusy(true);
    setProblems(null);
    try {
      const res = await fetch("/api/membership", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) setProblems({ form, list: data.problems ?? ["Something went wrong."] });
      else setResult(data);
    } catch {
      setProblems({ form, list: ["We couldn't reach the membership system. Please try again."] });
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="member-done block" data-tone="yellow" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="f-mono">{result.action === "join" ? "Welcome to Loud House" : "Membership renewed"}</p>
        <h2 className="member-done__title">
          <span className="f-serif">{result.action === "join" ? `Hello, ${result.name.split(" ")[0]}.` : "See you soon."}</span>
        </h2>
        <dl className="facts">
          <div>
            <dt>Membership number</dt>
            <dd className="f-mono">{result.number}</dd>
          </div>
          {result.action === "join" && (
            <div>
              <dt>Membership</dt>
              <dd>{result.tier}</dd>
            </div>
          )}
          <div>
            <dt>Valid until</dt>
            <dd>{formatLongDate(result.validUntil)}</dd>
          </div>
        </dl>
        <p className="member-done__actions">
          <Link href={`/tickets?member=${encodeURIComponent(result.number)}`} className="btn btn--black">
            Book your free MORE tickets
          </Link>
        </p>
        <p className="form-hint">Design study: no payment was taken and no card will be posted.</p>
      </div>
    );
  }

  const errorsFor = (form: "join" | "renew") =>
    problems?.form === form && (
      <div className="form-errors" role="alert">
        <ul>
          {problems.list.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    );

  const chosen = membershipTiers.find((t) => t.id === tier)!;

  return (
    <div className="member-flow">
      <form
        id="join"
        className="block member-flow__form"
        data-tone="cream"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void send("join", { action: "join", tier, name, email });
        }}
      >
        <h2 className="member-flow__title">
          <span className="f-serif">Join</span> <span className="f-display">today</span>
        </h2>
        <fieldset className="tier-picker">
          <legend className="f-mono">Choose a membership</legend>
          {membershipTiers.map((t) => (
            <label key={t.id} className="tier-option" data-tone={tier === t.id ? t.tone : "cream"}>
              <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => setTier(t.id)} />
              <span className="tier-option__name">{t.name}</span>
              <span className="tier-option__price">
                {formatPrice(t.price)} a year <span className="tier-option__monthly">or {formatPrice(t.monthly)} a month</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="form-field">
          <label htmlFor="join-name">Full name</label>
          <input id="join-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="join-email">Email</label>
          <input id="join-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {errorsFor("join")}
        <button type="submit" className="btn btn--yellow btn--big" disabled={busy}>
          {busy ? "Joining…" : `Join for ${formatPrice(chosen.price)}`}
        </button>
        <p className="form-hint">Payment is simulated in this design study.</p>
      </form>

      <form
        id="renew"
        className="block member-flow__form"
        data-tone="black"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void send("renew", { action: "renew", number: renewNumber, email: renewEmail });
        }}
      >
        <h2 className="member-flow__title">
          <span className="f-serif">Renew</span>
        </h2>
        <p>Your membership number is on your card and in your welcome email.</p>
        <div className="form-field">
          <label htmlFor="renew-number">Membership number</label>
          <input
            id="renew-number"
            placeholder="LH-123456"
            autoComplete="off"
            value={renewNumber}
            onChange={(e) => setRenewNumber(e.target.value.toUpperCase())}
          />
        </div>
        <div className="form-field">
          <label htmlFor="renew-email">Email on your membership</label>
          <input id="renew-email" type="email" autoComplete="email" value={renewEmail} onChange={(e) => setRenewEmail(e.target.value)} />
        </div>
        {errorsFor("renew")}
        <button type="submit" className="btn btn--yellow" disabled={busy}>
          {busy ? "Renewing…" : "Renew membership"}
        </button>
      </form>
    </div>
  );
}

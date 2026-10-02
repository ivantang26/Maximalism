import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { rooms } from "@/lib/content/rooms";
import { artistsInRoom } from "@/lib/content/artists";
import { more } from "@/lib/content/site";
import { visitCopy } from "@/lib/content/visit";

export const metadata: Metadata = {
  title: "Large-print guide to MORE",
  description: "Every wall text from MORE in large print: the curator's introduction, all six rooms and all thirty artists.",
};

/** Large-print guide (FR-7). Deliberately plain: no patterns, large Inter, generous spacing, prints cleanly. */
export default function LargePrint() {
  return (
    <PageShell panel={visitCopy.en.panel}>
      <article className="large-print wrap" aria-labelledby="lp-title">
        <p className="large-print__back">
          <Link href="/visit#access">← Back to access information</Link>
        </p>
        <h1 id="lp-title">MORE: large-print guide</h1>
        <p>
          {more.dates}. Galleries 1 and 2. This guide contains every wall text in the exhibition, in the order you will meet them. Printed copies in
          24-point type are at the entrance.
        </p>

        <h2>Curator&rsquo;s introduction</h2>
        {more.intro.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
        <p>
          {more.curator.name}, {more.curator.role}
        </p>

        {rooms.map((room) => (
          <section key={room.number} aria-labelledby={`lp-room-${room.number}`}>
            <h2 id={`lp-room-${room.number}`}>
              Room {room.number}: {room.title}
            </h2>
            <p>
              <strong>{room.kicker}.</strong> {room.text}
            </p>
            {room.note && <p>Good to know: {room.note}</p>}
            {artistsInRoom(room.number).map((a) => (
              <section key={a.slug} aria-labelledby={`lp-${a.slug}`}>
                <h3 id={`lp-${a.slug}`}>
                  {a.name} ({a.born}, {a.based})
                </h3>
                <p>{a.bio}</p>
                <ul>
                  {a.works.map((w) => (
                    <li key={w.id}>
                      <strong>{w.title}</strong>, {w.year}. {w.medium}. <span className="large-print__desc">{w.alt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </section>
        ))}
      </article>
    </PageShell>
  );
}

import Artwork from "../Artwork";
import { patternStyle } from "@/lib/patterns";
import { getPreset } from "@/lib/presets";
import { artistsInRoom, getWork } from "@/lib/content/artists";
import type { Room } from "@/lib/content/types";

/** One room of MORE: a full-width band with its own pattern preset and key artwork. */
export default function RoomBand({ room }: { room: Room }) {
  const preset = getPreset(room.preset);
  const { work, artist } = getWork(room.keyWork);
  const titleId = `room-${room.number}-title`;
  const flip = room.number % 2 === 0;

  return (
    <section
      id={`room-${room.number}`}
      className={`room ${preset.pattern ? "pattern" : ""} ${flip ? "room--flip" : ""}`}
      style={preset.pattern ? patternStyle(preset.pattern) : undefined}
      aria-labelledby={titleId}
    >
      <div className="wrap room__grid">
        <p className="room__number" data-tone={preset.accentTone ?? "black"}>
          <span className="f-mono">Room</span>
          <span className="f-display">{String(room.number).padStart(2, "0")}</span>
        </p>
        <figure className="room__art">
          <div className="room__frame">
            <Artwork work={work} />
          </div>
          <figcaption data-tone="black">
            <span className="f-serif">{work.title}</span>, {work.year}
            <br />
            {artist.name}. {work.medium}
          </figcaption>
        </figure>
        <div className="room__text" data-tone={preset.tone}>
          <p className="room__kicker f-mono">{room.kicker}</p>
          <h3 id={titleId} className="room__title f-serif" tabIndex={-1}>
            {room.title}
          </h3>
          <p>{room.text}</p>
          {room.note && (
            <p className="room__note">
              <strong>Good to know:</strong> {room.note}
            </p>
          )}
          <h4 className="room__sub f-mono">In this room</h4>
          <ul className="room__artists">
            {artistsInRoom(room.number).map((a) => (
              <li key={a.slug}>{a.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

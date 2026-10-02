"use client";

import { useCalm } from "./CalmProvider";

interface Props {
  variant?: "header" | "inline";
  onLabel?: string;
  offLabel?: string;
}

export default function CalmToggle({ variant = "header", onLabel = "Turn calm mode on", offLabel = "Turn calm mode off" }: Props) {
  const { calm, setCalm } = useCalm();
  const pressed = calm === true;

  if (variant === "inline") {
    return (
      <button type="button" className="btn btn--black" aria-pressed={pressed} onClick={() => setCalm(!pressed)}>
        {pressed ? offLabel : onLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="calm-toggle"
      aria-pressed={pressed}
      onClick={() => setCalm(!pressed)}
      title="Calm mode removes patterns, collage and motion"
    >
      <span className="calm-toggle__track" aria-hidden="true">
        <span className="calm-toggle__thumb" />
      </span>
      <span className="calm-toggle__label">
        Calm<span className="calm-toggle__long"> mode</span>
      </span>
    </button>
  );
}

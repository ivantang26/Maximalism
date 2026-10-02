import { more } from "@/lib/content/site";

export default function CuratorIntro() {
  return (
    <section className="band intro" data-tone="cobalt" aria-labelledby="intro-title">
      <div className="wrap intro__grid">
        <div className="intro__head">
          <p className="f-mono accent">Curator&rsquo;s introduction</p>
          <h2 id="intro-title" className="section-title">
            <span className="f-serif">Less was never</span> <span className="f-display accent">more</span>
            <span className="f-serif accent">.</span>
          </h2>
        </div>
        <div className="intro__text">
          {more.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="intro__sig">
            <span className="f-serif">{more.curator.name}</span>
            <br />
            <span className="f-mono">{more.curator.role}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

import Artwork from "../Artwork";
import Collage from "../Collage";
import { patternStyle } from "@/lib/patterns";
import { presets } from "@/lib/presets";
import { getWork } from "@/lib/content/artists";
import { shopItems, site } from "@/lib/content/site";

export default function ShopTeaser() {
  const preset = presets["shop-dots"];
  return (
    <section className="band shop pattern" style={patternStyle(preset.pattern)} aria-labelledby="shop-title">
      <Collage id="shop" />
      <div className="wrap shop__inner">
        <div className="section-head">
          <h2 id="shop-title" className="section-title headline-block" data-tone="cream">
            <span className="f-serif">Take some</span> <span className="f-display">more</span> <span className="f-serif">home</span>
          </h2>
        </div>
        <ul className="shop__grid">
          {shopItems.map((item) => {
            const { work } = getWork(item.work);
            return (
              <li key={item.id} className={`shop__item shop__item--${item.id}`} data-tone="cream">
                <div className={`shop__visual shop__visual--${item.id}`} aria-hidden="true">
                  <span className="shop__tape" data-decor />
                  <span className="shop__object">
                    <Artwork work={work} decorative />
                    {item.id === "catalogue" && <span className="shop__cover-title f-display">More</span>}
                    {item.id === "tote" && <span className="shop__tote-text f-serif">is more</span>}
                  </span>
                </div>
                <h3 className="shop__name">{item.name}</h3>
                <p className="shop__detail">{item.detail}</p>
                <p className="shop__price f-mono">{item.price}</p>
              </li>
            );
          })}
        </ul>
        <p className="shop__cta">
          <a href={site.shopUrl} className="btn btn--black" target="_blank" rel="noopener">
            Visit the shop<span aria-hidden="true"> ↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}

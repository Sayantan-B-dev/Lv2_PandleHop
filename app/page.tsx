import Link from "next/link";
import FoodCard from "@/components/FoodCard";
import Icon from "@/components/Icon";
import Marquee from "@/components/Marquee";
import PandalCard from "@/components/PandalCard";
import { getData } from "@/lib/data";
import { fmtClock, fmtDur, fmtKm, fmtRupees } from "@/lib/format";
import { generatePass } from "@/lib/itinerary";

export default function HomePage() {
  const data = getData();
  const pass = generatePass(data, data.defaultPrefs);
  const picks = data.home.pickIds
    .map((id) => data.pandals.find((pandal) => pandal.id === id))
    .filter((pandal): pandal is NonNullable<typeof pandal> => Boolean(pandal));
  const preview = pass.items.filter((item) => item.kind !== "leg").slice(0, 4);
  const teaserFoods = data.foods.slice(0, data.home.foodCount);

  return (
    <>
      <section className="hero-home">
        <div className="shell hero-home__grid">
          <div className="hero-copy">
            <p className="eyebrow">Kolkata · {data.site.festival} planner</p>
            <h1>
              Your Pujo night,
              <br />
              <em>perfectly plotted.</em>
            </h1>
            <p className="lead">
              Tell us where you&apos;re starting and how you like to roam. PandalPass stitches the pandals, food
              stops and travel legs into one easy night out.
            </p>
            <div className="hero-copy__actions">
              <Link className="btn btn--wine" href="/planner">Build my route</Link>
              <Link className="btn btn--ghost-light" href="/explore">Explore pandals</Link>
            </div>
            <p className="note">{data.site.planningNote}</p>
          </div>

          <div className="hero-visual">
            <div className="hero-visual__glow" aria-hidden="true" />
            <div className="route-preview">
              <div className="route-preview__head">
                <span className="chip">Tonight&apos;s route</span>
                <span>{pass.pandalIds.length} stops · {data.defaultPrefs.hours} hours</span>
              </div>
              <ol className="route-preview__list">
                {preview.map((item, index) => {
                  if (item.kind === "start") {
                    return (
                      <li key={`preview-${index}`}>
                        <span className="route-preview__dot" />
                        <div>
                          <strong>Start · {item.name}</strong>
                          <small>{fmtClock(item.time)} · meeting point</small>
                        </div>
                      </li>
                    );
                  }
                  if (item.kind === "pandal") {
                    const pandal = data.pandals.find((entry) => entry.id === item.pandalId);
                    if (!pandal) return null;
                    return (
                      <li key={`preview-${index}`}>
                        <span className="route-preview__dot" />
                        <div>
                          <strong>{pandal.name}</strong>
                          <small>{pandal.tagline}</small>
                        </div>
                      </li>
                    );
                  }
                  if (item.kind === "food") {
                    const food = data.foods.find((entry) => entry.id === item.foodId);
                    if (!food) return null;
                    return (
                      <li key={`preview-${index}`}>
                        <span className="route-preview__dot route-preview__dot--gold" />
                        <div>
                          <strong>{food.name}</strong>
                          <small>{food.kind}</small>
                        </div>
                      </li>
                    );
                  }
                  return null;
                })}
              </ol>
              <div className="route-preview__foot">
                <span>{fmtDur(pass.totalMins)}</span>
                <span>{fmtKm(pass.walkKm)} walk</span>
                <span>{fmtRupees(pass.cost)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shell hero-stats">
          <div className="stat">
            <span className="stat__num">{data.pandals.length}</span>
            <span className="stat__label">Pandals</span>
          </div>
          <div className="stat">
            <span className="stat__num">{data.starts.length}</span>
            <span className="stat__label">Start points</span>
          </div>
          <div className="stat">
            <span className="stat__num">{data.foods.length}</span>
            <span className="stat__label">Food stops</span>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          data.site.festival,
          `${data.pandals.length} pandals`,
          `${data.starts.length} start points`,
          `${data.foods.length} food stops`,
        ]}
      />

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2>Three calm steps to a big Pujo night.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-card__num">01</span>
              <h3>Set your start</h3>
              <p>Pick a launch point, from Barasat to Behala, and tell us how long you have.</p>
            </article>
            <article className="step-card">
              <span className="step-card__num">02</span>
              <h3>Pick your vibe</h3>
              <p>Iconic, Instagram-ready, low-crowd, family friendly or full of energy. Mix and match.</p>
            </article>
            <article className="step-card">
              <span className="step-card__num">03</span>
              <h3>Follow the pass</h3>
              <p>Get a timed route with travel legs, wait times and a food stop in the right place.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">Pandal radar</p>
              <h2>Tonight&apos;s picks</h2>
            </div>
            <Link className="link-arrow" href="/explore">
              See all {data.pandals.length} pandals <Icon name="arrowRight" size={13} />
            </Link>
          </div>
          <div className="card-grid card-grid--picks">
            {picks.map((pandal) => (
              <PandalCard
                key={pandal.id}
                pandal={pandal}
                glyph={data.pandalGlyphs[pandal.id % data.pandalGlyphs.length]}
                crowdLabel={data.crowdLabels[pandal.crowd]}
                tagLabels={data.tagLabels}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell food-teaser">
          <div>
            <p className="eyebrow">Fuel the crawl</p>
            <h2>Food stops between the lights.</h2>
            <p>
              Bhog, phuchka, rolls, mishti and late-night cha, tucked into your route so nobody gets hangry.
            </p>
            <Link className="btn btn--ghost" href="/food">Browse food stops</Link>
          </div>
          <div className="food-teaser__list">
            {teaserFoods.map((food) => (
              <FoodCard food={food} key={food.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2>Let&apos;s map your Pujo night.</h2>
          </div>
          <Link className="btn btn--gold" href="/planner">Start planning</Link>
        </div>
      </section>
    </>
  );
}

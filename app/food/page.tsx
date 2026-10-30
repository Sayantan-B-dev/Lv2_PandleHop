import type { Metadata } from "next";
import Link from "next/link";
import FoodCard from "@/components/FoodCard";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Food Stops",
  description: "Food stops for a Kolkata Pujo night: bhog, phuchka, rolls, mishti and late-night cha.",
};

export default function FoodPage() {
  const data = getData();
  return (
    <div className="page food-page">
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">Food stops</p>
          <h1>Refuel between pandals</h1>
          <p>
            Bhog, phuchka, kathi rolls, mishti and late-night cha, the edible side of a Pujo crawl.
          </p>
        </div>
        <p className="note">Prices are rough per-person estimates.</p>
        <div className="card-grid card-grid--food">
          {data.foods.map((food) => (
            <FoodCard food={food} key={food.id} />
          ))}
        </div>
        <div className="page-cta">
          <Link className="btn btn--wine" href="/planner">Add food to my route</Link>
        </div>
      </div>
    </div>
  );
}

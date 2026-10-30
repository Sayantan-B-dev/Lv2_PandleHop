import type { Metadata } from "next";
import ExploreClient from "@/components/ExploreClient";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore Pandals",
  description: "Browse Kolkata's pandals by vibe, with crowd estimates and neighbourhood guides.",
};

export default function ExplorePage() {
  const data = getData();
  return (
    <div className="page">
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">Pandal directory</p>
          <h1>Explore pandals</h1>
          <p>Filter the city by the kind of night you want.</p>
        </div>
        <ExploreClient data={data} />
      </div>
    </div>
  );
}

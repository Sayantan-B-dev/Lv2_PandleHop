import type { Metadata } from "next";
import PassClient from "@/components/PassClient";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Your Pujo Pass",
  description: "Your generated Pujo Pass: a timed pandal-hopping itinerary with travel legs, food stop and night summary.",
};

export default function PassPage() {
  const data = getData();
  return <PassClient data={data} />;
}

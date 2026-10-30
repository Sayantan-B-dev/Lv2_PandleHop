import type { Metadata } from "next";
import RouteClient from "@/components/RouteClient";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Route Map",
  description: "See your Pujo route on a stylised Kolkata map with numbered stops, crowd estimates and metro lines.",
};

export default function RoutePage() {
  const data = getData();
  return (
    <div className="page">
      <RouteClient data={data} />
    </div>
  );
}

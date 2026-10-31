"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import RouteMap, { type RouteSelection } from "@/components/RouteMap";
import Toast from "@/components/Toast";
import { fmtDur, fmtKm } from "@/lib/format";
import { generatePass, normalizePrefs } from "@/lib/itinerary";
import { loadPass, loadPrefs, savePass } from "@/lib/storage";
import type { PandalPassData, Pass } from "@/lib/types";

function validPass(value: Pass | null): value is Pass {
  return Boolean(value && Array.isArray(value.items) && Array.isArray(value.pandalIds));
}

export default function RouteClient({ data }: { data: PandalPassData }) {
  const [pass, setPass] = useState<Pass | null | undefined>(undefined);
  const [selection, setSelection] = useState<RouteSelection>(null);
  const [located, setLocated] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stored = loadPass(data.site.storage.pass);
    if (validPass(stored)) {
      setPass(stored);
      return;
    }
    const prefs = normalizePrefs(data, loadPrefs(data.site.storage.prefs));
    const generated = generatePass(data, prefs);
    savePass(data.site.storage.pass, generated);
    setPass(generated);
  }, [data]);

  function showToast(message: string) {
    setToast(message);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2400);
  }

  function select(nextSelection: RouteSelection) {
    setSelection(nextSelection);
    if (window.innerWidth <= 1020) {
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
  }

  function locate() {
    if (!pass) return;
    setLocated(true);
    showToast(`Centred on ${pass.startPoint.name}`);
    window.setTimeout(() => setLocated(false), 1400);
  }

  if (pass === undefined) {
    return (
      <div className="page">
        <div className="shell">
          <p className="panel" aria-busy="true">Loading your route map.</p>
        </div>
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="page">
        <div className="shell empty-state">
          <p className="eyebrow">Route map</p>
          <h1>No route yet.</h1>
          <p>Generate a PandalHoppers Pass and the map will fill in with your stops.</p>
          <Link className="btn btn--wine" href="/planner">Open the PandalHoppers planner</Link>
        </div>
      </div>
    );
  }

  const selectedPandal = selection?.kind === "pandal"
    ? data.pandals.find((pandal) => pandal.id === selection.id) ?? null
    : null;
  const selectedOrder = selectedPandal ? pass.pandalIds.indexOf(selectedPandal.id) : -1;
  const isStart = selection?.kind === "start";

  return (
    <>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">Route map</p>
          <h1>Your night, on the map</h1>
          <p>
            {pass.pandalIds.length} pandals A? {fmtDur(pass.totalMins)} A? {fmtKm(pass.walkKm)} walking A? crowd,
            time and cost are estimates.
          </p>
        </div>

        <div className="route-layout">
          <section className="map-card" aria-label="Stylised Kolkata PandalHoppers route map">
            <RouteMap data={data} pass={pass} selected={selection} located={located} onSelect={select} />

            <div className="legend" aria-label="Map legend">
              <div className="legend__title">Estimated crowd</div>
              <div className="legend__row"><span className="legend__dot legend__dot--low" />Low</div>
              <div className="legend__row"><span className="legend__dot legend__dot--moderate" />Moderate</div>
              <div className="legend__row"><span className="legend__dot legend__dot--heavy" />Heavy</div>
              <hr />
              <div className="legend__title">Metro</div>
              <div className="legend__row"><span className="legend__line legend__line--blue" />Blue Line</div>
              <div className="legend__row"><span className="legend__line legend__line--green" />Green Line</div>
            </div>

            <button className="map-btn" type="button" aria-label="Centre on your start point" onClick={locate}>
              <Icon name="locate" size={22} />
            </button>
          </section>

          <aside className="route-aside">
            <section className="panel stop-detail" aria-live="polite" ref={detailRef}>
              <p className="eyebrow">Selected stop</p>
              <h2 className="panel__title">
                {selectedPandal?.name ?? (isStart ? pass.startPoint.name : "Tap a marker")}
              </h2>
              <p className="muted">
                {selectedPandal?.area ?? (isStart ? "Meeting point" : "Every stop on the map has a story.")}
              </p>
              <p className="note">
                {selectedPandal?.tagline ??
                  (isStart
                    ? "Your night begins here. Gather the group and head to the first pandal."
                    : "Choose any numbered marker to see its area, theme and crowd estimate.")}
              </p>
              <div className="stop-detail__row">
                <span>
                  {selectedPandal ? (
                    <span className={`badge badge--${selectedPandal.crowd}`}>
                      {data.crowdLabels[selectedPandal.crowd]}
                    </span>
                  ) : null}
                  {isStart ? <span className="badge badge--food">Start point</span> : null}
                </span>
                {selectedPandal || isStart ? (
                  <span className="stop-detail__order">
                    {isStart
                      ? "Meeting point"
                      : selectedOrder !== -1
                        ? `Stop ${selectedOrder + 1} on your route`
                        : "Not on your route"}
                  </span>
                ) : null}
              </div>
            </section>

            <section className="panel">
              <h3 className="panel__title">Your stops</h3>
              <ol className="route-list">
                <li>
                  <button
                    type="button"
                    className={isStart ? "is-active" : ""}
                    onClick={() => select({ kind: "start" })}
                  >
                    <span className="route-list__num">S</span>
                    <span>
                      <strong>{pass.startPoint.name}</strong>
                      <small>Start A? meeting point</small>
                    </span>
                  </button>
                </li>
                {pass.pandalIds.map((id, index) => {
                  const pandal = data.pandals.find((entry) => entry.id === id);
                  if (!pandal) return null;
                  const active = selection?.kind === "pandal" && selection.id === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={active ? "is-active" : ""}
                        onClick={() => select({ kind: "pandal", id })}
                      >
                        <span className="route-list__num">{index + 1}</span>
                        <span>
                          <strong>{pandal.name}</strong>
                          <small>{pandal.area}</small>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          </aside>
        </div>
      </div>
      <Toast message={toast} visible={toastVisible} />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const windowHeight = window.innerHeight;
      if (rect.bottom < 0 || rect.top > windowHeight) return;

      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      const translateY = progress * 90;
      const opacity = 1 - progress * 0.6;

      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      element.style.opacity = String(opacity);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="hero-image">
      <div className="hero-image__layer" ref={ref} aria-hidden="true" />
      <span className="sr-only">
        Kumartuli Park Durga Puja pandal at night, illuminated with traditional lighting and artistic
        decorations. Photo by Tanuj Adhikary (@_tanuj_) on Unsplash.
      </span>
    </div>
  );
}
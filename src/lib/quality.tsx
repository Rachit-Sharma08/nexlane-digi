"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Quality = "low" | "mid" | "high";

/**
 * SSR/first render always reports "low" so the server HTML and the first
 * client render match. The real tier is measured after hydration (AGENTS.md §11.1).
 */
const QualityContext = createContext<Quality>("low");

type NavigatorExtras = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function detectQuality(): Quality {
  const connection = (navigator as NavigatorExtras).connection;
  const memory = (navigator as NavigatorExtras).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const width = window.innerWidth;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    connection?.saveData ||
    memory <= 2 ||
    cores <= 2 ||
    width < 768
  ) {
    return "low";
  }

  // Tablets (coarse pointer) stay on CSS-only depth even at 1024px.
  if (width >= 1024 && cores >= 4 && window.matchMedia("(pointer: fine)").matches) {
    return "high";
  }

  return "mid";
}

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<Quality>("low");

  useEffect(() => {
    const update = () => setQuality(detectQuality());
    update();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      reduced.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // CSS reads this for the page transition and the static-depth fallbacks.
  useEffect(() => {
    document.documentElement.dataset.quality = quality;
  }, [quality]);

  return <QualityContext.Provider value={quality}>{children}</QualityContext.Provider>;
}

export function useQuality() {
  return useContext(QualityContext);
}

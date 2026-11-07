"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollControls() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty("transform", `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`);
        setShowTop(window.scrollY > 520);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          })
        }
        className={`back-to-top ${showTop ? "is-visible" : ""}`}
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

/**
 * Loads the chat widget well after the page has settled, so its ~600ms chunk
 * never lands inside the hydration/TBT window (speed rule: 90+ Lighthouse):
 * 6s after `load` (past Lighthouse's 5s network-quiet window), or sooner once
 * the visitor shows intent (tap / key / scroll), whichever comes first.
 */
export default function ChatbotLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    let timer = 0;

    const start = () => {
      if (done) return;
      done = true;
      const cb = () => setReady(true);
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => cb(), { timeout: 2000 });
      } else {
        window.setTimeout(cb, 800);
      }
    };

    // Fallback: passive visitors get the widget a few seconds after load.
    const armFallback = () => {
      timer = window.setTimeout(start, 6000);
    };
    if (document.readyState === "complete") armFallback();
    else window.addEventListener("load", armFallback, { once: true });

    // Intent: someone who interacts gets it soon (still on idle, no jank).
    const onIntent = () => {
      window.clearTimeout(timer);
      start();
    };
    const intents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "wheel"];
    intents.forEach((e) => window.addEventListener(e, onIntent, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", armFallback);
      intents.forEach((e) => window.removeEventListener(e, onIntent));
    };
  }, []);

  return ready ? <Chatbot /> : null;
}

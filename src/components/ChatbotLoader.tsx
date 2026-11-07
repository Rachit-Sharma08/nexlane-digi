"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

/**
 * Loads the chat widget only after the browser is idle, so the chatbot chunk
 * never competes with the first paint (speed rule: 90+ Lighthouse).
 */
export default function ChatbotLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start: (cb: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(() => cb())
        : (cb) => window.setTimeout(cb, 1500);
    start(() => setReady(true));
  }, []);

  return ready ? <Chatbot /> : null;
}

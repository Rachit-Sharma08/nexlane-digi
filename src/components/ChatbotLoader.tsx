"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

/**
 * Defers the chat chunk until the page is idle, while keeping the launcher
 * available near the start of a visit instead of waiting for a scroll.
 */
export default function ChatbotLoader() {
  const [ready, setReady] = useState(false);
  const [openRequest, setOpenRequest] = useState(0);

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

    // Fallback: passive visitors see the launcher shortly after first paint.
    const armFallback = () => {
      timer = window.setTimeout(start, 1000);
    };
    if (document.readyState === "complete") armFallback();
    else window.addEventListener("load", armFallback, { once: true });

    // Intent: someone who interacts gets it soon (still on idle, no jank).
    const onIntent = () => {
      window.clearTimeout(timer);
      start();
    };
    const onOpenChat = () => {
      setOpenRequest((request) => request + 1);
      start();
    };
    const intents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "wheel"];
    intents.forEach((e) => window.addEventListener(e, onIntent, { passive: true }));
    window.addEventListener("nexlane:open-chat", onOpenChat);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", armFallback);
      intents.forEach((e) => window.removeEventListener(e, onIntent));
      window.removeEventListener("nexlane:open-chat", onOpenChat);
    };
  }, []);

  return ready ? <Chatbot openRequest={openRequest} /> : null;
}

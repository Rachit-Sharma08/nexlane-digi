"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(() => import("./Chatbot"));

/** Server-render the launcher so it is visible on the first screen. */
export default function ChatbotLoader() {
  const [openRequest, setOpenRequest] = useState(0);

  useEffect(() => {
    const onOpenChat = () => setOpenRequest((request) => request + 1);
    window.addEventListener("nexlane:open-chat", onOpenChat);
    return () => window.removeEventListener("nexlane:open-chat", onOpenChat);
  }, []);

  return <Chatbot openRequest={openRequest} />;
}

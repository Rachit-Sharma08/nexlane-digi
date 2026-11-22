"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { askBot, suggestQuestions, type ChatMessage } from "@/lib/chatbot";

const chips = suggestQuestions();

/**
 * CSS-3D robot mascot (AGENTS §11.3 — CSS 3D everywhere, WebGL only in the
 * hero). All sizes in `em`, so `text-[Npx]` on the root scales the whole bot.
 */
function RobotHead({ className = "" }: { className?: string }) {
  return (
    <span className={`robot ${className}`} aria-hidden="true">
      <span className="robot-antenna">
        <i />
      </span>
      <span className="robot-head">
        <span className="robot-ear robot-ear-l" />
        <span className="robot-ear robot-ear-r" />
        <span className="robot-face">
          <span className="robot-visor">
            <i className="robot-eye" />
            <i className="robot-eye" />
          </span>
          <span className="robot-mouth" />
        </span>
      </span>
    </span>
  );
}

/**
 * Floating site chat — bottom-right, stacked under WhatsApp/back-to-top.
 * Phase 1: local answers from src/lib/chatbot.ts, clearly labelled as a
 * preview until the Grok API lands in Phase 2.
 */
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi! Ask me anything about Nexlane Digital — services, pricing, SEO, or how to start.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // The WhatsApp float sits in the slot the chat panel opens over.
  useEffect(() => {
    document.documentElement.dataset.chatOpen = String(open);
  }, [open]);

  // Close when clicking outside the panel (owner request 2026-11-08).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || fabRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing, open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || typing) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setTyping(true);
    const reply = await askBot(question);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await new Promise((r) => setTimeout(r, 420));
    }
    setTyping(false);
    setMessages((m) => [...m, { role: "bot", text: reply }]);
  }

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  return (
    <>
      <button
        type="button"
        ref={fabRef}
        data-open={open}
        data-typing={typing}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat with Nexlane Digital"}
        className={`chat-fab fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full ${focusRing}`}
      >
        <RobotHead className="text-[32px]" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Nexlane Digital"
          className="chat-panel fixed bottom-24 left-4 right-4 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50 sm:left-auto sm:right-5 sm:w-[24rem]"
        >
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--card-border)] bg-[rgba(9,38,72,0.75)]"
            >
              <RobotHead className="text-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-white">Nexlane Digital</p>
              <p className="mt-0.5 inline-flex w-fit rounded-full border border-[var(--accent)]/30 bg-[rgba(30,211,242,0.08)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--accent)]">
                Preview · AI answers coming soon
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className={`ml-auto rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-[rgba(30,211,242,0.1)] hover:text-white ${focusRing}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60"
          />

          <div
            ref={listRef}
            className="chat-scroll flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble max-w-[85%] break-words whitespace-pre-wrap px-3.5 py-2 text-sm leading-relaxed text-white ${
                  m.role === "user"
                    ? "ml-auto rounded-2xl rounded-tr-md bg-[linear-gradient(135deg,#0461d6,#0572f5)] shadow-[0_6px_18px_rgba(4,80,190,0.35)]"
                    : "rounded-2xl rounded-tl-md border border-[var(--card-border)] bg-[rgba(9,38,72,0.65)]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div
                className="chat-bubble w-fit rounded-2xl rounded-tl-md border border-[var(--card-border)] bg-[rgba(9,38,72,0.65)] px-4 py-3"
                aria-label="Nexlane is typing"
              >
                <span className="chat-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>

          <div className="chat-chips flex gap-2 overflow-x-auto border-t border-[var(--card-border)] px-3 py-2.5">
            {chips.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className={`whitespace-nowrap rounded-full border border-[var(--card-border)] bg-[rgba(9,38,72,0.5)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)]/50 hover:bg-[rgba(30,211,242,0.08)] hover:text-white ${focusRing}`}
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="flex gap-2 border-t border-[var(--card-border)] p-3"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-full border border-[var(--card-border)] bg-[rgba(9,38,72,0.5)] px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:bg-[rgba(9,38,72,0.75)] focus:ring-2 focus:ring-[var(--accent)]/25"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim() || typing}
              className={`chat-send grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${focusRing}`}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

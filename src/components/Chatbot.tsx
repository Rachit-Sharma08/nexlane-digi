"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { askBot, suggestQuestions, type ChatMessage } from "@/lib/chatbot";

const chips = suggestQuestions();

/**
 * Floating site chat (bottom-left, away from WhatsApp/back-to-top on the right).
 * Phase 1: local answers from src/lib/chatbot.ts — clearly labelled as preview.
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat with Nexlane Digital"}
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--brand)] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Nexlane Digital"
          className="fixed bottom-24 left-4 right-4 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[rgba(4,20,40,0.97)] shadow-2xl shadow-black/50 sm:right-auto sm:left-5 sm:w-96"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--card-border)] px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">Nexlane Digital</p>
              <p className="text-[11px] uppercase tracking-wider text-[var(--accent)]">Preview · AI answers coming soon</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--brand)] text-white"
                    : "border border-[var(--card-border)] bg-[rgba(9,38,72,0.6)] text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble w-fit rounded-2xl border border-[var(--card-border)] bg-[rgba(9,38,72,0.6)] px-3.5 py-2 text-sm text-[var(--muted)]">
                typing…
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-[var(--card-border)] px-3 py-2">
            {chips.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="whitespace-nowrap rounded-full border border-[var(--card-border)] bg-[rgba(9,38,72,0.5)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)]/50 hover:text-white"
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
              className="min-w-0 flex-1 rounded-full border border-[var(--card-border)] bg-[rgba(9,38,72,0.5)] px-4 py-2 text-sm text-white outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-white transition-transform hover:scale-105 disabled:opacity-50"
              disabled={!draft.trim() || typing}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

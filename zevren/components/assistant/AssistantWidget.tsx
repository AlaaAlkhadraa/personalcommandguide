"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { adsConfigured } from "@/lib/analytics/google-ads";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";
import { useCsrfToken } from "@/lib/use-csrf-token";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * The site assistant, as a floating button that unfolds into a small panel.
 *
 * It deliberately looks like the rest of the site rather than like a chat
 * product bolted on: same navy surfaces, same hairline borders, same rounded
 * language as the cards. Conversation state lives in memory only; nothing
 * about the visitor is stored on their machine.
 *
 * The outer component owns only the open flag and the transcript, so a
 * closed and reopened panel keeps its conversation. Everything that costs
 * anything, including the CSRF token fetch, lives in the panel and therefore
 * does not run for the large majority of visitors who never open the chat.
 */
export function AssistantWidget({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["assistant"];
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // On a phone the cookie bar and this launcher share the same bottom edge,
  // and the bar sits on top: a first-time visitor could see a chat button
  // they cannot press. So the corner holds one thing at a time; the launcher
  // waits until the cookie question is answered. Starts false and is decided
  // in an effect, because the server cannot read the consent cookie state.
  const [cornerFree, setCornerFree] = useState(false);

  useEffect(() => {
    if (!adsConfigured() || readConsent() !== "unknown") {
      setCornerFree(true);
      return;
    }
    const onChoice = () => setCornerFree(true);
    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => window.removeEventListener(CONSENT_EVENT, onChoice);
  }, []);

  if (!cornerFree) return null;

  return (
    <>
      {/* Launcher. Hidden while the panel is open: one affordance at a time. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={dict.label}
          className="fixed bottom-5 end-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-glow transition-all duration-200 hover:bg-primary-light active:scale-95"
        >
          <ChatIcon className="h-6 w-6" />
        </button>
      )}

      {open && (
        <AssistantPanel
          locale={locale}
          dict={dict}
          messages={messages}
          setMessages={setMessages}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function AssistantPanel({
  locale,
  dict,
  messages,
  setMessages,
  onClose,
}: {
  locale: Locale;
  dict: Dictionary["assistant"];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const csrfToken = useCsrfToken(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // New content should be visible without the visitor scrolling for it.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const history = messages.slice(-12);
    setMessages((current) => [...current, { role: "user", content: text }]);
    setInput("");
    setNotice(null);
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({
          message: text,
          history,
          locale,
          csrfToken: csrfToken ?? undefined,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { reply?: string; code?: string }
        | null;

      if (response.ok && data?.reply) {
        setMessages((current) => [...current, { role: "assistant", content: data.reply as string }]);
      } else {
        // The question comes back out of the transcript and into the box. An
        // unanswered user turn left in the history would make every following
        // request carry two user turns in a row, and this way the visitor can
        // also retry without retyping.
        setMessages((current) =>
          current[current.length - 1]?.role === "user" ? current.slice(0, -1) : current
        );
        setInput(text);
        setNotice(response.status === 429 ? dict.rateLimited : dict.error);
      }
    } catch {
      setMessages((current) =>
        current[current.length - 1]?.role === "user" ? current.slice(0, -1) : current
      );
      setInput(text);
      setNotice(dict.error);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }, [input, busy, messages, setMessages, csrfToken, locale, dict]);

  return (
    <div
      role="dialog"
      aria-label={dict.title}
      className="fixed bottom-5 end-5 z-[80] flex max-h-[min(34rem,calc(100dvh-2.5rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy/95 shadow-2xl backdrop-blur"
    >
      {/* Header, in the site's card language. */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-surface/60 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-sm font-semibold text-white">{dict.title}</span>
          <span className="text-xs text-muted">{dict.subtitle}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.close}
          className="rounded-full p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {/* Conversation. */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <Bubble role="assistant">{dict.greeting}</Bubble>
        {messages.map((message, index) => (
          <Bubble key={index} role={message.role}>
            {message.content}
          </Bubble>
        ))}
        {busy && (
          <div className="flex items-center gap-2 px-1 text-xs text-muted">
            <span className="inline-flex gap-1" aria-hidden="true">
              <Dot delay="0ms" />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
            </span>
            {dict.thinking}
          </div>
        )}
        {notice && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300">
            {notice}
          </p>
        )}
      </div>

      {/* Composer. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
        className="flex items-end gap-2 border-t border-white/10 bg-surface/60 p-3"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          rows={1}
          maxLength={1500}
          placeholder={dict.placeholder}
          aria-label={dict.placeholder}
          className="max-h-28 min-h-[2.6rem] flex-1 resize-none rounded-xl border border-white/10 bg-navy/80 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/70 focus:border-accent/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label={dict.send}
          className="flex h-[2.6rem] w-[2.6rem] shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 rtl:-scale-x-100"
            aria-hidden="true"
          >
            <path d="M4 12h16M13 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md border border-white/10 bg-white/5 text-white/90"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    />
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" strokeWidth={2.2} />
    </svg>
  );
}

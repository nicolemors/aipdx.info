"use client";

import { useState } from "react";
import { contact } from "@/content/site";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-paper/90">
        Thanks for reaching out — we&apos;ll reply to your email shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field — hidden from real users, catches simple bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-paper/90">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-paper/10 bg-ink px-4 py-2 text-paper placeholder:text-muted focus:border-pink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-paper/90">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-paper/10 bg-ink px-4 py-2 text-paper placeholder:text-muted focus:border-pink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-semibold text-paper/90">
          What&apos;s this about?
        </label>
        <select
          id="purpose"
          name="purpose"
          className="mt-1 w-full rounded-lg border border-paper/10 bg-ink px-4 py-2 text-paper focus:border-pink focus:outline-none"
        >
          {contact.purposes.map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-paper/90">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-paper/10 bg-ink px-4 py-2 text-paper placeholder:text-muted focus:border-pink focus:outline-none"
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-crimson">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { parseEventDate, type AiPortlandEvent } from "@/lib/notion/events";
import { EventCard } from "@/components/EventCard";

export function EventsExplorer({ events }: { events: AiPortlandEvent[] }) {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [type, setType] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { upcoming, past } = useMemo(() => {
    const upcoming: AiPortlandEvent[] = [];
    const past: AiPortlandEvent[] = [];
    for (const event of events) {
      (parseEventDate(event.date) >= today ? upcoming : past).push(event);
    }
    // `events` arrives sorted ascending — flip past events so the most recent shows first.
    return { upcoming, past: past.reverse() };
  }, [events, today]);

  const types = useMemo(
    () => Array.from(new Set(events.map((e) => e.type).filter((t): t is string => !!t))).sort(),
    [events]
  );

  const filtered = useMemo(() => {
    const base = view === "upcoming" ? upcoming : past;
    return type ? base.filter((event) => event.type === type) : base;
  }, [view, upcoming, past, type]);

  return (
    <>
      {types.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-3 border-b border-paper/10 bg-surface px-6 py-5 sm:px-10">
          <button
            type="button"
            onClick={() => setType(null)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              type === null ? "bg-pink text-ink" : "border border-paper/10 bg-[#2c2c2e] text-paper"
            }`}
          >
            ALL
          </button>
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${
                type === t ? "bg-pink text-ink" : "border border-paper/10 bg-[#2c2c2e] text-paper"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <div className="mb-6 flex w-fit items-center gap-1 rounded-full bg-[#2c2c2e] p-1">
          <button
            type="button"
            onClick={() => setView("upcoming")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
              view === "upcoming" ? "bg-ink text-paper" : "text-muted"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setView("past")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
              view === "past" ? "bg-ink text-paper" : "text-muted"
            }`}
          >
            Past
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} showRsvp={view === "upcoming"} />
            ))}
          </div>
        ) : (
          <p className="text-paper/60">
            {view === "upcoming" ? "No upcoming events right now." : "No past events yet."}
          </p>
        )}
      </div>
    </>
  );
}

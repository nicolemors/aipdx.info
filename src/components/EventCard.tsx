import Image from "next/image";
import { parseEventDate, type AiPortlandEvent } from "@/lib/notion/events";

function formatCardDate(event: AiPortlandEvent) {
  const date = parseEventDate(event.date)
    .toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })
    .toUpperCase();
  return event.time ? `${date} @ ${event.time}` : date;
}

export function EventCard({
  event,
  showRsvp = true,
}: {
  event: AiPortlandEvent;
  showRsvp?: boolean;
}) {
  return (
    <article className="flex w-full overflow-hidden rounded-3xl border border-pink bg-gradient-to-r from-[#2a1822] to-surface">
      {event.imageUrl && (
        <div className="relative hidden size-[260px] shrink-0 sm:block">
          <Image src={event.imageUrl} alt="" fill sizes="260px" className="object-cover" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {event.type && (
            <span className="rounded-full bg-pink px-2.5 py-1 text-[11px] font-bold uppercase text-ink">
              {event.type}
            </span>
          )}
          <p className="text-[13px] font-extrabold text-coral">{formatCardDate(event)}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="line-clamp-1 text-[22px] font-extrabold leading-snug text-paper">
            {event.name}
          </h3>
          {event.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted">{event.description}</p>
          )}
        </div>

        <div className="h-px w-full bg-paper/10" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">{event.location ?? "Location TBA"}</p>
          {showRsvp && event.lumaUrl && (
            <a
              href={event.lumaUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-6 py-2.5 text-xs font-extrabold uppercase tracking-wide text-ink transition hover:opacity-90"
            >
              RSVP for Event
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

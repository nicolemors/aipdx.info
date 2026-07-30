import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { parseEventDate, type AiPortlandEvent } from "@/lib/notion/events";
import { upcomingEvent } from "@/content/site";

function formatEventDateTime(event: AiPortlandEvent) {
  const date = parseEventDate(event.date)
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
  return event.time ? `${date} @ ${event.time}` : date;
}

// Matches the Figma "upcoming-event-section" / "premium-event-card". The
// comp shows tag chips ("Panel", "120 Cap") that the Events database has no
// fields for — dropped rather than fabricated. The photo comes from
// Notion's "Image" property, falling back to the event's Luma cover photo
// (see lib/luma.ts) when that's unset, same as the events calendar page —
// omitted entirely if neither is available.
export function UpcomingEventFeature({ event }: { event: AiPortlandEvent }) {
  return (
    <section className="border-b border-paper/10 py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-pink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-paper">
          <span className="h-1.5 w-1.5 rounded-full bg-pink" />
          {upcomingEvent.badge}
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-paper sm:text-4xl lg:text-[44px]">
          {upcomingEvent.title}
        </h2>
        <Link
          href="/events"
          className="text-sm font-bold uppercase tracking-[1px] text-pink transition hover:text-paper"
        >
          View Full Calendar →
        </Link>

        <div className="mt-4 w-full max-w-[1000px] overflow-hidden rounded-[32px] border-[1.5px] border-pink bg-gradient-to-r from-[#2a1822] to-ink text-left sm:flex">
          {event.imageUrl && (
            <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-[400px]">
              <Image
                src={event.imageUrl}
                alt=""
                fill
                sizes="(min-width: 640px) 400px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-6 p-8 sm:p-12">
            <p className="text-sm font-extrabold text-coral">{formatEventDateTime(event)}</p>
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-extrabold leading-tight text-paper">{event.name}</h3>
              {event.location && <p className="text-sm text-paper/60">{event.location}</p>}
              {event.description && <p className="leading-relaxed text-paper/60">{event.description}</p>}
            </div>
            <div className="h-px w-full bg-paper/10" />
            <div className="flex flex-wrap gap-4">
              {event.lumaUrl && (
                <a
                  href={event.lumaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-white px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-ink transition hover:opacity-90"
                >
                  Register for Event
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

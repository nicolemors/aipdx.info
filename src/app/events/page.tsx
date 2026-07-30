import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { EventsExplorer } from "@/components/EventsExplorer";
import { getAllEvents, isEventsConfigured } from "@/lib/notion/events";
import { getInvolved } from "@/content/site";

export const metadata: Metadata = {
  title: "Events Calendar | AI Portland",
};

// Notion-backed content revalidates on this interval, keeping edits live
// within minutes without a manual redeploy.
export const revalidate = 300;

// Matches the Figma "events-calendar-page" (node 405:17). The comp's
// Free/Paid + capacity tags are demo content for fields the Events database
// doesn't track — dropped rather than fabricated, matching the precedent in
// UpcomingEventFeature. The type filter/badge maps to the real Notion "Type"
// property. Per-event photos come from Notion's "Image" property, falling
// back to the event's Luma cover photo (see lib/luma.ts) when that's unset.
//
// Fetches all events (not just upcoming) so the page's Upcoming/Past toggle
// has real past events to show, split client-side in EventsExplorer.
export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <section className="border-b border-paper/10 bg-gradient-to-b from-[#3b111a] to-ink py-16 text-paper">
        <Container>
          <span className="inline-flex items-center rounded-full border border-pink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-paper">
            AI Portland Events
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Events Calendar
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
            Meetups, workshops, and talks connecting Portland&apos;s AI community. Find your people
            and dive into what&apos;s next in artificial intelligence.
          </p>
        </Container>
      </section>

      {events.length > 0 ? (
        <EventsExplorer events={events} />
      ) : (
        <Container className="py-16">
          <p className="text-paper/60">
            {isEventsConfigured
              ? "No events on the calendar right now — check back soon."
              : "Event data isn't connected yet. Set NOTION_TOKEN and NOTION_EVENTS_DB_ID to pull events from Notion."}
          </p>
        </Container>
      )}

      <section className="bg-surface py-16">
        <Container className="max-w-2xl text-center sm:mx-auto">
          <h2 className="text-2xl font-bold text-paper">{getInvolved.title}</h2>
          <p className="mt-4 leading-relaxed text-paper/75">{getInvolved.body}</p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-paper transition hover:opacity-90"
          >
            {getInvolved.cta}
          </a>
        </Container>
      </section>
    </>
  );
}

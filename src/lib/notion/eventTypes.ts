// Kept separate from events.ts so client components (EventsExplorer, and
// EventCard which it renders) can use the type and date helper without
// pulling the server-only data layer — Notion client, sharp, Vercel Blob —
// into the browser bundle.

export type AiPortlandEvent = {
  id: string;
  name: string;
  date: string;
  dateEnd: string | null;
  time: string | null;
  location: string | null;
  description: string | null;
  lumaUrl: string | null;
  /** "Type" rich_text property — e.g. "Panel", "Workshop", "Social". */
  type: string | null;
  /** Notion's "Image" property, falling back to the event's Luma cover photo. */
  imageUrl: string | null;
};

/**
 * Notion's date-only values ("2026-07-17", no time/timezone) get parsed by
 * `new Date(...)` as UTC midnight, which shifts a day earlier once rendered
 * in any timezone behind UTC (e.g. 2026-07-17 -> "July 16" in Pacific time).
 * Reading the Y/M/D components directly as local values sidesteps that.
 */
export function parseEventDate(dateStr: string): Date {
  const [year, month, day] = dateStr.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

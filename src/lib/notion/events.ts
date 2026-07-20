import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getLumaCoverImage } from "@/lib/luma";
import { firstFileUrl, plainText, queryAllPages } from "./client";

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

const databaseId = process.env.NOTION_EVENTS_DB_ID;

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

function toEvent(page: PageObjectResponse): AiPortlandEvent | null {
  const props = page.properties;

  const nameProp = props["Event"];
  const name = nameProp?.type === "title" ? plainText(nameProp.title) : null;

  const dateProp = props["Date"];
  const date = dateProp?.type === "date" ? dateProp.date : null;

  const publishProp = props["Publish"];
  const isPublished = publishProp?.type === "checkbox" && publishProp.checkbox;

  if (!name || !date?.start || !isPublished) return null;

  const timeProp = props["Time"];
  const time = timeProp?.type === "rich_text" ? plainText(timeProp.rich_text) : null;

  const locationProp = props["Location"];
  const location = locationProp?.type === "rich_text" ? plainText(locationProp.rich_text) : null;

  const descriptionProp = props["Description"];
  const description =
    descriptionProp?.type === "rich_text" ? plainText(descriptionProp.rich_text) : null;

  const lumaProp = props["Luma"];
  const lumaUrl = lumaProp?.type === "url" ? lumaProp.url : null;

  const typeProp = props["Type"];
  const type = typeProp?.type === "rich_text" ? plainText(typeProp.rich_text) : null;

  const imageProp = props["Image"];
  const imageUrl = imageProp?.type === "files" ? firstFileUrl(imageProp.files) : null;

  return {
    id: page.id,
    name,
    date: date.start,
    dateEnd: date.end,
    time,
    location,
    description,
    lumaUrl,
    type,
    imageUrl,
  };
}

/** Fills in `imageUrl` from the event's Luma cover photo when Notion has no "Image" set. */
async function withImageFallback(event: AiPortlandEvent): Promise<AiPortlandEvent> {
  if (event.imageUrl || !event.lumaUrl) return event;
  const imageUrl = await getLumaCoverImage(event.lumaUrl);
  return imageUrl ? { ...event, imageUrl } : event;
}

async function queryEvents(direction: "ascending" | "descending"): Promise<AiPortlandEvent[]> {
  const pages = await queryAllPages(databaseId, [{ property: "Date", direction }]);
  const events = pages.map(toEvent).filter((event): event is AiPortlandEvent => event !== null);
  return Promise.all(events.map(withImageFallback));
}

/** All events in the public Events database, soonest first. */
export async function getAllEvents(): Promise<AiPortlandEvent[]> {
  return queryEvents("ascending");
}

/** Upcoming events only (today or later), soonest first. */
export async function getUpcomingEvents(limit?: number): Promise<AiPortlandEvent[]> {
  const all = await queryEvents("ascending");
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcoming = all.filter(
    (event) => parseEventDate(event.date).getTime() >= startOfToday.getTime()
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** The single soonest upcoming event, for the home page teaser. */
export async function getNextEvent(): Promise<AiPortlandEvent | null> {
  const [next] = await getUpcomingEvents(1);
  return next ?? null;
}

export const isEventsConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

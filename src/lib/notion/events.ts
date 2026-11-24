import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { storeRemoteImage } from "@/lib/imageStore";
import { getLumaCoverImage } from "@/lib/luma";
import { firstFileUrl, plainText, queryAllPages } from "./client";
import { parseEventDate, type AiPortlandEvent } from "./eventTypes";

export { parseEventDate, type AiPortlandEvent };

const databaseId = process.env.NOTION_EVENTS_DB_ID;

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

/**
 * Fills in `imageUrl` from the event's Luma cover photo when Notion has no
 * "Image" set, then swaps it for a permanent resized copy in Vercel Blob (see
 * imageStore) — Notion's uploaded-file URLs expire after ~1 hour.
 */
async function withImageFallback(event: AiPortlandEvent): Promise<AiPortlandEvent> {
  const sourceUrl =
    event.imageUrl ?? (event.lumaUrl ? await getLumaCoverImage(event.lumaUrl) : null);
  if (!sourceUrl) return event;
  const storedUrl = await storeRemoteImage(sourceUrl);
  return { ...event, imageUrl: storedUrl ?? sourceUrl };
}

async function withImageFallbacks(events: AiPortlandEvent[]): Promise<AiPortlandEvent[]> {
  const hydrated: AiPortlandEvent[] = [];
  for (let index = 0; index < events.length; index += 5) {
    const batch = events.slice(index, index + 5);
    hydrated.push(...(await Promise.all(batch.map(withImageFallback))));
  }
  return hydrated;
}

async function queryEvents(direction: "ascending" | "descending"): Promise<AiPortlandEvent[]> {
  const pages = await queryAllPages(databaseId, [{ property: "Date", direction }]);
  const events = pages.map(toEvent).filter((event): event is AiPortlandEvent => event !== null);
  return withImageFallbacks(events);
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

/** The next "AI in the A.M." coffee hour, AI Portland's recurring morning meetup. */
export async function getNextCoffeeHour(): Promise<AiPortlandEvent | null> {
  const upcoming = await getUpcomingEvents();
  return upcoming.find((event) => event.name.toLowerCase().includes("ai in the a.m.")) ?? null;
}

/** The next December social/happy hour, if one is upcoming. */
export async function getDecemberSocial(): Promise<AiPortlandEvent | null> {
  const upcoming = await getUpcomingEvents();
  return (
    upcoming.find((event) => event.type === "Social" && parseEventDate(event.date).getMonth() === 11) ?? null
  );
}

export const isEventsConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

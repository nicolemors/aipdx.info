import { isFullUser } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { BlockWithChildren } from "./client";
import {
  allFileUrls,
  firstFileUrl,
  getBlockChildren,
  getBlockChildrenRecursive,
  getPageById,
  plainText,
  queryAllPages,
} from "./client";

export type RelatedEvent = {
  id: string;
  name: string;
};

export type StoryAuthor = {
  name: string;
  avatarUrl: string | null;
};

export type Story = {
  id: string;
  title: string;
  /** "Subhead" rich_text property — a one-line dek shown under the title, if set. */
  subhead: string | null;
  /** "Intro" rich_text property — a lead paragraph shown above the body, if set. */
  intro: string | null;
  date: string;
  imageVersion: string;
  coverImageUrl: string | null;
  /** "Gallery" files property — event photos beyond the featured image. */
  galleryImageUrls: string[];
  /** "Podcast" url property — links to the episode discussing this story, if any. */
  podcastUrl: string | null;
  /** "Person" property — the first assigned author, if any. */
  author: StoryAuthor | null;
  relatedEventId: string | null;
};

const databaseId = process.env.NOTION_STORIES_DB_ID;

// The database has no dedicated "Title"/"Date" properties — "Headline" is the
// display copy (falling back to the required "Name" title property when
// blank) and there's no explicit publish date, so each page's creation time
// stands in for it.
function toStory(page: PageObjectResponse): Story | null {
  const props = page.properties;

  const headlineProp = props["Headline"];
  const headline = headlineProp?.type === "rich_text" ? plainText(headlineProp.rich_text) : null;

  const nameProp = props["Name"];
  const name = nameProp?.type === "title" ? plainText(nameProp.title) : null;

  const title = headline ?? name;
  if (!title) return null;

  const publishProp = props["Publish"];
  const isPublished = publishProp?.type === "checkbox" && publishProp.checkbox;
  if (!isPublished) return null;

  const subheadProp = props["Subhead"];
  const subhead = subheadProp?.type === "rich_text" ? plainText(subheadProp.rich_text) : null;

  const introProp = props["Intro"];
  const intro = introProp?.type === "rich_text" ? plainText(introProp.rich_text) : null;

  const coverProp = props["Feature Image"];
  const coverImageUrl = coverProp?.type === "files" ? firstFileUrl(coverProp.files) : null;

  const galleryProp = props["Gallery"];
  const galleryImageUrls = galleryProp?.type === "files" ? allFileUrls(galleryProp.files) : [];

  const podcastProp = props["Podcast"];
  const podcastUrl = podcastProp?.type === "url" ? podcastProp.url : null;

  const personProp = props["Person"];
  const firstPerson =
    personProp?.type === "people" ? personProp.people.find((p) => p.object === "user") : null;
  const author: StoryAuthor | null =
    firstPerson && isFullUser(firstPerson) && firstPerson.name
      ? { name: firstPerson.name, avatarUrl: firstPerson.avatar_url }
      : null;

  const relatedProp = props["Related Event"];
  const relatedEventId =
    relatedProp?.type === "relation" ? relatedProp.relation[0]?.id ?? null : null;

  return {
    id: page.id,
    title,
    subhead,
    intro,
    date: page.created_time,
    imageVersion: page.last_edited_time,
    coverImageUrl,
    galleryImageUrls,
    podcastUrl,
    author,
    relatedEventId,
  };
}

async function queryStories(direction: "ascending" | "descending"): Promise<Story[]> {
  const pages = await queryAllPages(databaseId, [{ timestamp: "created_time", direction }]);
  return pages.map(toStory).filter((story): story is Story => story !== null);
}

/** All stories, most recent first. */
export async function getAllStories(): Promise<Story[]> {
  return queryStories("descending");
}

/** The single most recent story, for the home page lead section. */
export async function getLatestStory(): Promise<Story | null> {
  const [latest] = await queryStories("descending");
  return latest ?? null;
}

export async function getStoryById(id: string): Promise<Story | null> {
  const page = await getPageById(id);
  return page ? toStory(page) : null;
}

export function storyImageProxyUrl(story: Pick<Story, "id" | "imageVersion">, image: "cover" | number) {
  const imageKey = typeof image === "number" ? `gallery-${image}` : image;
  return `/api/stories/${story.id}/images/${imageKey}?v=${encodeURIComponent(story.imageVersion)}`;
}

/** The page content blocks that make up a story's body, including nested content (columns, callouts). */
export async function getStoryBody(id: string): Promise<BlockWithChildren[]> {
  return getBlockChildrenRecursive(id);
}

function blockRichText(block: BlockWithChildren) {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text;
    case "heading_1":
      return block.heading_1.rich_text;
    case "heading_2":
      return block.heading_2.rich_text;
    case "heading_3":
      return block.heading_3.rich_text;
    case "quote":
      return block.quote.rich_text;
    case "callout":
      return block.callout.rich_text;
    case "bulleted_list_item":
      return block.bulleted_list_item.rich_text;
    case "numbered_list_item":
      return block.numbered_list_item.rich_text;
    default:
      return [];
  }
}

function countWords(blocks: BlockWithChildren[]): number {
  return blocks.reduce((total, block) => {
    const text = plainText(blockRichText(block)) ?? "";
    const ownCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const childCount = block.children ? countWords(block.children) : 0;
    return total + ownCount + childCount;
  }, 0);
}

/** Reading time estimated from the real word count of a story's body blocks (~200 wpm), including nested content (columns, callouts), not a fabricated figure. */
export function estimateReadingMinutes(blocks: BlockWithChildren[]): number {
  return Math.max(1, Math.round(countWords(blocks) / 200));
}

/**
 * A short plain-text teaser used for card/feature previews. Prefers the
 * "Intro" property when an editor has filled it in; otherwise falls back to
 * the story's first body paragraph.
 */
export async function getStoryExcerpt(id: string, maxLength = 220): Promise<string | null> {
  const page = await getPageById(id);
  const introProp = page?.properties["Intro"];
  const intro = introProp?.type === "rich_text" ? plainText(introProp.rich_text) : null;

  if (intro) {
    return intro.length > maxLength ? `${intro.slice(0, maxLength).trimEnd()}…` : intro;
  }

  const blocks = await getBlockChildren(id);
  const firstParagraph = blocks.find(
    (block) => block.type === "paragraph" && block.paragraph.rich_text.length > 0
  );
  if (firstParagraph?.type !== "paragraph") return null;

  const fallbackText = plainText(firstParagraph.paragraph.rich_text);
  if (!fallbackText) return null;

  return fallbackText.length > maxLength
    ? `${fallbackText.slice(0, maxLength).trimEnd()}…`
    : fallbackText;
}

/** Resolves a Related Event relation to its display name, if the linked page is still a valid event. */
export async function getRelatedEventName(eventId: string): Promise<RelatedEvent | null> {
  const page = await getPageById(eventId);
  if (!page) return null;
  const nameProp = page.properties["Event"];
  const name = nameProp?.type === "title" ? plainText(nameProp.title) : null;
  return name ? { id: eventId, name } : null;
}

export const isStoriesConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

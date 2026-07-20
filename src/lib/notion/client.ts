import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDataSourceParameters,
} from "@notionhq/client/build/src/api-endpoints";

export const notionToken = process.env.NOTION_TOKEN;

export const notion = notionToken ? new Client({ auth: notionToken }) : null;

export function isFullPage(page: unknown): page is PageObjectResponse {
  return !!page && typeof page === "object" && "properties" in page;
}

export function plainText(richText: { plain_text: string }[] | undefined): string | null {
  if (!richText || richText.length === 0) return null;
  const text = richText.map((t) => t.plain_text).join("");
  return text.length > 0 ? text : null;
}

type NotionFile = { type?: string; file?: { url: string }; external?: { url: string } };

function fileUrl(file: NotionFile): string | null {
  if (file.type === "external") return file.external?.url ?? null;
  if (file.type === "file") return file.file?.url ?? null;
  return file.external?.url ?? file.file?.url ?? null;
}

/** First file url from a Notion "files" property — handles both uploaded and external files. */
export function firstFileUrl(files: NotionFile[] | undefined): string | null {
  const first = files?.[0];
  return first ? fileUrl(first) : null;
}

/** Every file url from a Notion "files" property, in order — handles both uploaded and external files. */
export function allFileUrls(files: NotionFile[] | undefined): string[] {
  return (files ?? []).map(fileUrl).filter((url): url is string => url !== null);
}

// Notion's 2025-09+ API models a database as a container of one or more "data
// sources" — queries go through dataSources.query, not databases.query. Each
// database's data source id is resolved once (per database) and cached.
const dataSourceIdCache = new Map<string, string | null>();

export async function resolveDataSourceId(databaseId: string | undefined): Promise<string | null> {
  if (!notion || !databaseId) return null;
  if (dataSourceIdCache.has(databaseId)) return dataSourceIdCache.get(databaseId)!;

  const database = (await notion.databases.retrieve({
    database_id: databaseId,
  })) as DatabaseObjectResponse;

  const dataSourceId = database.data_sources[0]?.id ?? null;
  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

export async function queryAllPages(
  databaseId: string | undefined,
  sorts: QueryDataSourceParameters["sorts"]
): Promise<PageObjectResponse[]> {
  if (!notion || !databaseId) return [];

  const dataSourceId = await resolveDataSourceId(databaseId);
  if (!dataSourceId) return [];

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts,
      start_cursor: cursor,
    });

    for (const page of response.results) {
      if (isFullPage(page)) pages.push(page);
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return pages;
}

export async function getPageById(pageId: string): Promise<PageObjectResponse | null> {
  if (!notion) return null;
  const page = await notion.pages.retrieve({ page_id: pageId });
  return isFullPage(page) ? page : null;
}

/** All child blocks of a page/block, in order. Does not recurse into nested children. */
export async function getBlockChildren(blockId: string): Promise<BlockObjectResponse[]> {
  if (!notion) return [];

  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      if ("type" in block) blocks.push(block as BlockObjectResponse);
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

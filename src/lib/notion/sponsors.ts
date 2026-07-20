import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { firstFileUrl, plainText, queryAllPages } from "./client";

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  link: string | null;
};

const databaseId = process.env.NOTION_SPONSORS_DB_ID;

function toSponsor(page: PageObjectResponse): Sponsor | null {
  const props = page.properties;

  const nameProp = props["Name"];
  const name = nameProp?.type === "title" ? plainText(nameProp.title) : null;
  if (!name) return null;

  const logoProp = props["logo"];
  const logoUrl = logoProp?.type === "files" ? firstFileUrl(logoProp.files) : null;

  const linkProp = props["URL"];
  const link = linkProp?.type === "url" ? linkProp.url : null;

  return { id: page.id, name, logoUrl, link };
}

/** All sponsors, in the order they're listed in Notion. */
export async function getSponsors(): Promise<Sponsor[]> {
  const pages = await queryAllPages(databaseId, undefined);
  return pages.map(toSponsor).filter((sponsor): sponsor is Sponsor => sponsor !== null);
}

export const isSponsorsConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

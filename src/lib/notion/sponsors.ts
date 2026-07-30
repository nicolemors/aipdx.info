import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { detectCardColor } from "./cardColor";
import { firstFileUrl, plainText, queryAllPages } from "./client";

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  link: string | null;
  // The logo's own corner color (e.g. a badge-style logo with a solid dark
  // background baked in), so its card can match instead of always being
  // white — null means the corners are transparent, so the card falls back
  // to the default light card. See detectCardColor in ./client.
  cardColor: string | null;
};

const databaseId = process.env.NOTION_SPONSORS_DB_ID;

function toSponsor(page: PageObjectResponse): Omit<Sponsor, "cardColor"> | null {
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
  const base = pages.map(toSponsor).filter((sponsor): sponsor is Omit<Sponsor, "cardColor"> => sponsor !== null);

  return Promise.all(
    base.map(async (sponsor) => ({
      ...sponsor,
      cardColor: await detectCardColor(sponsor.logoUrl),
    }))
  );
}

export const isSponsorsConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

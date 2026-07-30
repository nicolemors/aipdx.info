import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { detectCardColor } from "./cardColor";
import { firstFileUrl, plainText, queryAllPages } from "./client";

export type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  link: string | null;
  // The logo's own corner color (e.g. a badge-style logo with a solid dark
  // background baked in), so its card can match instead of always being
  // white — null means the corners are transparent, so the card falls back
  // to the default light card. See `detectCardColor` below.
  cardColor: string | null;
};

const databaseId = process.env.NOTION_PARTNERS_DB_ID;

function toPartner(page: PageObjectResponse): Omit<Partner, "cardColor"> | null {
  const props = page.properties;

  const nameProp = props["Name"];
  const name = nameProp?.type === "title" ? plainText(nameProp.title) : null;
  if (!name) return null;

  const logoProp = props["Logo"];
  const logoUrl = logoProp?.type === "files" ? firstFileUrl(logoProp.files) : null;

  const linkProp = props["URL"];
  const link = linkProp?.type === "url" ? linkProp.url : null;

  return { id: page.id, name, logoUrl, link };
}

/** All partners, in the order they're listed in Notion. */
export async function getPartners(): Promise<Partner[]> {
  const pages = await queryAllPages(databaseId, undefined);
  const base = pages.map(toPartner).filter((partner): partner is Omit<Partner, "cardColor"> => partner !== null);

  return Promise.all(
    base.map(async (partner) => ({
      ...partner,
      cardColor: await detectCardColor(partner.logoUrl),
    }))
  );
}

export const isPartnersConfigured = Boolean(process.env.NOTION_TOKEN && databaseId);

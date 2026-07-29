import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import sharp from "sharp";
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

/**
 * Samples the four corner pixels of a logo image to find a background color
 * baked into the asset itself (e.g. a badge-style logo, solid square behind
 * the mark). Returns null when the corners are transparent — most logos are
 * just a mark on a transparent background, which should get the default
 * light card rather than an arbitrary sampled color.
 */
async function detectCardColor(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    const res = await fetch(logoUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());

    const { data, info } = await sharp(buffer)
      .resize(20, 20, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const corners = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
    ];

    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (const [x, y] of corners) {
      const i = (y * width + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      a += data[i + 3];
    }

    const avgAlpha = a / corners.length / 255;
    if (avgAlpha < 0.6) return null;

    return `rgb(${Math.round(r / corners.length)}, ${Math.round(g / corners.length)}, ${Math.round(b / corners.length)})`;
  } catch {
    return null;
  }
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

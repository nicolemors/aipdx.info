import { createHash } from "node:crypto";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import sharp from "sharp";

// Every remote image the site shows (Notion uploads, Luma covers, logos,
// YouTube thumbnails) goes through here.
//
// Notion's uploaded-file URLs are pre-signed S3 links that expire after ~1
// hour, so serving them live (directly, through a proxy route, or through the
// Next image optimizer) keeps breaking whenever a cached page outlives its
// URL. Instead, each image is copied out of Notion exactly once: resized to a
// web-friendly WebP with sharp and stored in Vercel Blob under a name derived
// from the file's identity. Pages then link straight to that static Blob URL,
// which never expires and is served from Vercel's CDN.

const MAX_WIDTH = 1200;
const WEBP_QUALITY = 80;
const PREFIX = "images";

export const isImageStoreConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Hosts whose image URLs carry a query string that changes between fetches
// (signatures, cache-busters) without the image itself changing.
const PATH_IDENTIFIED_HOSTS = [/\.amazonaws\.com$/, /^i\d*\.ytimg\.com$/];

/**
 * A stable key for a remote image. Notion's S3 URLs carry a fresh signature
 * (query string) every time they're fetched, but the path — workspace id,
 * file id, filename — is fixed for a given uploaded file, so it's the part
 * that identifies the image. Replacing the file in Notion gives it a new
 * path, and therefore a new stored copy.
 *
 * SVGs (common for sponsor/partner logos) are stored untouched rather than
 * rasterized, so they stay crisp at any size.
 */
function storageKey(sourceUrl: string): { pathname: string; keepOriginal: boolean } {
  const url = new URL(sourceUrl);
  const identity = PATH_IDENTIFIED_HOSTS.some((host) => host.test(url.hostname))
    ? `${url.origin}${url.pathname}`
    : sourceUrl;
  const hash = createHash("sha256").update(identity).digest("hex").slice(0, 32);
  const keepOriginal = url.pathname.toLowerCase().endsWith(".svg");
  return { pathname: `${PREFIX}/${hash}.${keepOriginal ? "svg" : "webp"}`, keepOriginal };
}

// Per-instance memo, so repeated renders on a warm server don't re-check Blob.
const resolved = new Map<string, Promise<string | null>>();

async function findOrCreate(sourceUrl: string, pathname: string, keepOriginal: boolean): Promise<string | null> {
  try {
    const existing = await head(pathname);
    return existing.url;
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error;
  }

  const response = await fetch(sourceUrl, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/")) {
    console.error(`[imageStore] fetch failed (${response.status} ${contentType}) for ${pathname}`);
    return null;
  }

  const original = Buffer.from(await response.arrayBuffer());
  const body = keepOriginal
    ? original
    : await sharp(original, {
        animated: true, // keep animated GIFs animated
        density: contentType.includes("svg") ? 300 : undefined, // rasterize stray SVGs sharply
      })
        .rotate() // honor EXIF orientation from phone photos before it's stripped
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY }) // keeps logo transparency
        .toBuffer();

  const blob = await put(pathname, body, {
    access: "public",
    contentType: keepOriginal ? contentType : "image/webp",
    addRandomSuffix: false,
    // Two renders can race to create the same image; the content is identical.
    allowOverwrite: true,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

/**
 * Returns a permanent, CDN-served URL for a resized WebP copy of `sourceUrl`,
 * creating it on first use. Returns null if Blob isn't configured or the copy
 * fails, so callers can fall back to another way of showing the image.
 */
export function storeRemoteImage(sourceUrl: string | null | undefined): Promise<string | null> {
  if (!sourceUrl || !sourceUrl.startsWith("https://") || !isImageStoreConfigured) {
    return Promise.resolve(null);
  }

  const { pathname, keepOriginal } = storageKey(sourceUrl);
  const cached = resolved.get(pathname);
  if (cached) return cached;

  const pending = findOrCreate(sourceUrl, pathname, keepOriginal).catch((error) => {
    console.error(`[imageStore] could not store ${pathname}:`, error);
    return null;
  });
  resolved.set(pathname, pending);
  // Don't memoize failures — let the next render retry.
  pending.then((url) => {
    if (!url) resolved.delete(pathname);
  });
  return pending;
}

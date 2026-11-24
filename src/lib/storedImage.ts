/**
 * True for images already resized and stored in Vercel Blob (see imageStore).
 * Those are served as-is from the Blob CDN — pass `unoptimized` to next/image
 * so the optimizer stays out of the path entirely.
 */
export function isStoredImage(src: string): boolean {
  return src.includes(".blob.vercel-storage.com/");
}

import sharp from "sharp";

// Kept out of client.ts on purpose — sharp is a native Node module and
// client.ts is transitively imported by "use client" components (via
// events.ts) for helper functions, which would pull sharp into the browser
// bundle and break it. Only sponsors.ts and partners.ts import this file,
// and both are server-only.

/**
 * Samples the four corner pixels of a logo image to find a background color
 * baked into the asset itself (e.g. a badge-style logo, solid square behind
 * the mark). Returns null when the corners are transparent — most logos are
 * just a mark on a transparent background, which should get the default
 * light card rather than an arbitrary sampled color.
 */
export async function detectCardColor(logoUrl: string | null): Promise<string | null> {
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

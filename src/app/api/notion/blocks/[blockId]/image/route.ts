import { resizeForWeb } from "@/lib/imageStore";
import { notion } from "@/lib/notion/client";

type RouteContext = { params: Promise<{ blockId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { blockId } = await params;
  if (!notion) return new Response(null, { status: 503 });

  const block = await notion.blocks.retrieve({ block_id: blockId });
  if (!("type" in block) || block.type !== "image" || !("image" in block)) {
    return new Response(null, { status: 404 });
  }

  if (block.image.type !== "file") return new Response(null, { status: 404 });

  const imageUrl = block.image.file.url;
  if (!imageUrl.startsWith("https://")) return new Response(null, { status: 404 });

  const imageResponse = await fetch(imageUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const contentType = imageResponse.headers.get("content-type");
  if (!imageResponse.ok || !contentType?.startsWith("image/")) {
    return new Response(null, { status: 502 });
  }

  // Fallback path for when an image has no Blob copy (see imageStore):
  // resize here too, so visitors never get the multi-MB original, and let
  // the CDN cache it — the URL carries a ?v= version that changes whenever
  // the Notion page is edited.
  const resized = await resizeForWeb(Buffer.from(await imageResponse.arrayBuffer()), contentType);
  return new Response(new Uint8Array(resized), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000",
    },
  });
}
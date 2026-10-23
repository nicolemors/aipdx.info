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

  return new Response(imageResponse.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
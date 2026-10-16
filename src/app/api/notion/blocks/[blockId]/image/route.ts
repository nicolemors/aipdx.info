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

  return new Response(null, {
    status: 307,
    headers: {
      Location: imageUrl,
      "Cache-Control": "no-store",
    },
  });
}
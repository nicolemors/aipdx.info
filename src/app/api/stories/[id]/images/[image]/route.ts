import { getStoryById } from "@/lib/notion/stories";

type RouteContext = { params: Promise<{ id: string; image: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id, image } = await params;
  const story = await getStoryById(id);
  if (!story) return new Response(null, { status: 404 });

  const imageUrl =
    image === "cover"
      ? story.coverImageUrl
      : image.startsWith("gallery-") && /^gallery-\d+$/.test(image)
        ? story.galleryImageUrls[Number(image.slice("gallery-".length))]
        : null;

  if (!imageUrl || !imageUrl.startsWith("https://")) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: imageUrl,
      "Cache-Control": "no-store",
    },
  });
}
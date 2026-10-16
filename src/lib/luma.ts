/**
 * Looks up an event's cover photo via Luma's public (unauthenticated) event
 * API. Used as a fallback when a Notion event has no "Image" property set.
 *
 * This intentionally reads `event.cover_url` — the organizer-uploaded cover
 * photo — rather than `event.social_image_url`, which is Luma's
 * auto-generated share-card banner with the event name and date burned into
 * the image.
 */
export async function getLumaCoverImage(lumaUrl: string): Promise<string | null> {
  const slug = new URL(lumaUrl).pathname.split("/").filter(Boolean).pop();
  if (!slug) return null;

  try {
    const response = await fetch(
      `https://api.lu.ma/event/get?event_api_id=${encodeURIComponent(slug)}`,
      { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;

    const data = await response.json();
    return data?.event?.cover_url ?? null;
  } catch {
    return null;
  }
}

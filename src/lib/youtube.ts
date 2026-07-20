export type YoutubeVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
};

/** Extracts the video ID from a youtu.be, watch?v=, or /embed/ style YouTube URL. */
export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.replace("/embed/", "") || null;
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

async function fetchChannelVideosPage(channelUrl: string): Promise<string | null> {
  try {
    const url = `${channelUrl.replace(/\/$/, "")}/videos`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AiPortlandBot/1.0)" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    });
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

/** A video's title/thumbnail via YouTube's public oEmbed endpoint — no API key required. */
export async function getYoutubeVideoInfo(videoId: string): Promise<YoutubeVideo | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}&format=json`;
    const response = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000), next: { revalidate: 300 } });
    if (!response.ok) return null;

    const data = await response.json();
    return { id: videoId, title: data.title, thumbnailUrl: data.thumbnail_url };
  } catch {
    return null;
  }
}

/** The channel's most recent upload — scraped from the public Videos tab (sorted newest first) plus the public oEmbed endpoint, no API key required. */
export async function getLatestYoutubeVideo(channelUrl: string): Promise<YoutubeVideo | null> {
  const html = await fetchChannelVideosPage(channelUrl);
  const videoId = html?.match(/"videoId":"([^"]+)"/)?.[1];
  return videoId ? getYoutubeVideoInfo(videoId) : null;
}

export type YoutubeChannelInfo = {
  name: string;
  avatarUrl: string;
};

/** The channel's display name and avatar, scraped from the same Videos tab payload. */
export async function getYoutubeChannelInfo(channelUrl: string): Promise<YoutubeChannelInfo | null> {
  const html = await fetchChannelVideosPage(channelUrl);
  if (!html) return null;

  try {
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!match) return null;

    const data = JSON.parse(match[1]);
    const channelMetadata = data?.metadata?.channelMetadataRenderer;
    const name = channelMetadata?.title;
    const avatarUrl = channelMetadata?.avatar?.thumbnails?.[0]?.url;
    return name && avatarUrl ? { name, avatarUrl } : null;
  } catch {
    return null;
  }
}

export type YoutubeVideoSummary = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string | null;
  publishedAgo: string | null;
  description: string | null;
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** A video's description, scraped from its watch page's og:description meta tag (no API key). */
async function getVideoDescription(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AiPortlandBot/1.0)" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(/<meta property="og:description" content="([^"]*)"/);
    return match ? decodeHtmlEntities(match[1]) : null;
  } catch {
    return null;
  }
}

/**
 * The channel's Videos tab has migrated to YouTube's newer, undocumented
 * "lockupViewModel" data shape (replacing the older videoRenderer format),
 * so this reaches through several optional-chained internal fields. If
 * YouTube changes that shape again, this degrades to an empty list rather
 * than throwing.
 */
function extractRecentVideos(html: string): Omit<YoutubeVideoSummary, "description">[] {
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match) return [];

  try {
    const data = JSON.parse(match[1]);
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
    const videosTab = tabs.find((tab: { tabRenderer?: { content?: { richGridRenderer?: unknown } } }) =>
      Boolean(tab?.tabRenderer?.content?.richGridRenderer)
    );
    const contents = videosTab?.tabRenderer?.content?.richGridRenderer?.contents ?? [];

    const results: Omit<YoutubeVideoSummary, "description">[] = [];
    for (const entry of contents) {
      const lockup = entry?.richItemRenderer?.content?.lockupViewModel;
      if (!lockup) continue;

      const id = lockup.contentId;
      const title = lockup.metadata?.lockupMetadataViewModel?.title?.content;
      const sources = lockup.contentImage?.thumbnailViewModel?.image?.sources ?? [];
      const thumbnailUrl = sources[sources.length - 1]?.url;
      if (!id || !title || !thumbnailUrl) continue;

      const overlays = lockup.contentImage?.thumbnailViewModel?.overlays ?? [];
      const duration =
        overlays
          .map(
            (overlay: {
              thumbnailBottomOverlayViewModel?: {
                badges?: [{ thumbnailBadgeViewModel?: { text?: string } }];
              };
            }) => overlay?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text
          )
          .find(Boolean) ?? null;

      const metadataParts =
        lockup.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.flatMap(
          (row: { metadataParts?: [{ text?: { content?: string } }] }) => row?.metadataParts ?? []
        ) ?? [];
      const publishedAgo =
        metadataParts
          .map((part: { text?: { content?: string } }) => part?.text?.content)
          .find((text: string | undefined) => text && /ago$/i.test(text)) ?? null;

      results.push({ id, title, thumbnailUrl, duration, publishedAgo });
    }
    return results;
  } catch {
    return [];
  }
}

/**
 * Recent uploads (title, thumbnail, duration, relative publish date) scraped
 * from the channel's Videos tab, newest first. Descriptions are fetched
 * per-video since the channel listing doesn't include them.
 */
export async function getRecentYoutubeVideos(
  channelUrl: string,
  limit = 4
): Promise<YoutubeVideoSummary[]> {
  const html = await fetchChannelVideosPage(channelUrl);
  if (!html) return [];

  const videos = extractRecentVideos(html).slice(0, limit);
  return Promise.all(
    videos.map(async (video) => ({ ...video, description: await getVideoDescription(video.id) }))
  );
}

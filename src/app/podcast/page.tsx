import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { PodcastEmbed } from "@/components/PodcastEmbed";
import { getRecentYoutubeVideos, getYoutubeChannelInfo } from "@/lib/youtube";
import { links, podcast } from "@/content/site";

export const metadata: Metadata = {
  title: "Podcast | AI Portland",
};

// Notion-backed content isn't involved here, but the YouTube data is fetched
// live from the channel on the same interval as the rest of the site.
export const revalidate = 300;

function formatDuration(duration: string | null) {
  if (!duration) return null;
  const parts = duration.split(":").map(Number);
  const minutes = parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0];
  return `${minutes} min${minutes === 1 ? "" : "s"}`;
}

// Matches the Figma "ai-portland-podcast-page" (node 414:41). The comp's
// featured card is a hand-built player skin (custom play button, scrubber);
// we drop in the real YouTube iframe embed there instead of recreating that
// chrome. Everything else — title, thumbnail, duration, publish date,
// description, channel name/avatar — is real data scraped from the channel
// (see lib/youtube.ts), not fabricated to match the comp's placeholder copy.
export default async function PodcastPage() {
  const [videos, channel] = await Promise.all([
    getRecentYoutubeVideos(links.podcastYoutube, 4),
    getYoutubeChannelInfo(links.podcastYoutube),
  ]);
  const [featured, ...recent] = videos;

  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink">{podcast.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-bold">{podcast.title}</h1>
          <p className="mt-4 leading-relaxed text-paper/80">{podcast.intro}</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {featured ? (
            <>
              <div className="flex items-center gap-3">
                {channel && (
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                    <Image src={channel.avatarUrl} alt="" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-paper">{featured.title}</p>
                  <p className="text-sm text-muted">{channel?.name ?? "AI Portland"}</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl">
                <PodcastEmbed src={`https://www.youtube.com/embed/${featured.id}`} height={540} />
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${featured.id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pink hover:underline"
              >
                Watch on YouTube →
              </a>
            </>
          ) : (
            <p className="text-paper/60">
              Couldn&apos;t load the latest episode right now —{" "}
              <a href={links.podcastYoutube} target="_blank" rel="noreferrer" className="text-pink hover:underline">
                watch on YouTube
              </a>{" "}
              instead.
            </p>
          )}
        </Container>
      </section>

      {recent.length > 0 && (
        <section className="bg-surface py-16">
          <Container>
            <h2 className="text-2xl font-extrabold text-paper">Recent Episodes</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {recent.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-xl border border-paper/10 bg-ink transition hover:border-pink/40"
                >
                  <div className="relative aspect-video w-full">
                    <Image src={video.thumbnailUrl} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-xs">
                      {video.publishedAgo && (
                        <span className="font-semibold uppercase text-pink">{video.publishedAgo}</span>
                      )}
                      {video.duration && (
                        <>
                          <span className="size-1 rounded-full bg-muted" />
                          <span className="text-muted">{formatDuration(video.duration)}</span>
                        </>
                      )}
                    </div>
                    <p className="font-bold leading-snug text-paper">{video.title}</p>
                    {video.description && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted">{video.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

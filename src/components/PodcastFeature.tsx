import { Container } from "@/components/Container";
import { PodcastCoverArt } from "@/components/PodcastCoverArt";
import type { YoutubeVideo } from "@/lib/youtube";
import { links, podcast } from "@/content/site";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" {...props}>
      <path d="M4.5 3.2c0-.9 1-1.5 1.8-1l9 5.8c.7.5.7 1.5 0 2l-9 5.8c-.8.5-1.8-.1-1.8-1V3.2Z" />
    </svg>
  );
}

// Matches the Figma "latest-podcast-section". The comp shows a fully custom
// player (scrubber, timestamps) that would need real per-episode audio
// metadata we don't have — but the episode title itself is real, scraped
// live from the channel's Videos tab (see lib/youtube.ts), not invented.
// Falls back to the static show description if that fetch ever fails.
export function PodcastFeature({ video }: { video: YoutubeVideo | null }) {
  return (
    <section className="border-b border-paper/10 bg-surface py-16 sm:py-20">
      <Container className="flex flex-col gap-10 sm:flex-row sm:items-center">
        <PodcastCoverArt className="mx-auto h-56 w-56 shrink-0 sm:mx-0 sm:h-[260px] sm:w-[260px]" />
        <div className="flex flex-1 flex-col items-start gap-4 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-pink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-paper sm:self-start">
            <span className="h-1.5 w-1.5 rounded-full bg-pink" />
            Latest Episode
          </span>
          <h2 className="text-2xl font-extrabold leading-tight text-paper sm:text-3xl">
            {video?.title ?? podcast.title}
          </h2>
          <p className="leading-relaxed text-paper/60">{podcast.intro}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href={video ? `https://www.youtube.com/watch?v=${video.id}` : links.podcastYoutube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink to-coral px-6 py-3 text-sm font-bold text-ink"
            >
              <PlayIcon className="h-4 w-4" />
              Watch on YouTube
            </a>
            <a
              href="/podcast"
              className="inline-flex items-center gap-3 rounded-full border border-paper/20 px-6 py-3 text-sm font-bold text-paper"
            >
              See more episodes
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

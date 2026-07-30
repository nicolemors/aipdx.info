import Image from "next/image";
import { Container } from "@/components/Container";
import { LatestStoryFeature } from "@/components/LatestStoryFeature";
import { PodcastFeature } from "@/components/PodcastFeature";
import { UpcomingEventFeature } from "@/components/UpcomingEventFeature";
import { SponsorGrid } from "@/components/SponsorGrid";
import { getNextEvent, isEventsConfigured } from "@/lib/notion/events";
import { getLatestStory, getStoryExcerpt, isStoriesConfigured } from "@/lib/notion/stories";
import { getSponsors, isSponsorsConfigured } from "@/lib/notion/sponsors";
import { getLatestYoutubeVideo } from "@/lib/youtube";
import { home, links } from "@/content/site";

export const revalidate = 300;

export default async function HomePage() {
  const [nextEvent, latestStory, sponsors, latestVideo] = await Promise.all([
    getNextEvent(),
    getLatestStory(),
    getSponsors(),
    getLatestYoutubeVideo(links.podcastYoutube),
  ]);
  const latestStoryExcerpt = latestStory ? await getStoryExcerpt(latestStory.id) : null;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/9]">
          <Image
            src="/images/hero-street.jpg"
            alt="A Portland street at dusk, string lights and lamp posts lit against the sunset"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <Container className="absolute inset-0 flex items-center pb-16">
          <h1 className="whitespace-pre-line text-4xl font-extrabold leading-[1.05] tracking-tight text-paper sm:text-6xl lg:text-[77px]">
            {home.heroLead}
          </h1>
        </Container>
      </section>

      {latestStory && <LatestStoryFeature story={latestStory} excerpt={latestStoryExcerpt} />}
      {!latestStory && !isStoriesConfigured && (
        <section className="border-b border-paper/10 py-20">
          <Container>
            <h2 className="text-2xl font-bold text-paper">Latest Story</h2>
            <p className="mt-4 text-paper/60">
              Story data isn&apos;t connected yet. Set NOTION_TOKEN and NOTION_STORIES_DB_ID to pull stories
              from Notion.
            </p>
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { src: "/images/gallery/DSCF7756.jpg", alt: "A panel discussion in front of a warm-lit Kiln backdrop" },
              { src: "/images/gallery/IMG_1275.jpeg", alt: "Attendees seated on bleacher-style steps at an AI Portland event" },
              { src: "/images/gallery/IMG_7102.jpeg", alt: "A panel discussion in front of the AI Portland logo" },
            ].map((image) => (
              <div key={image.src} className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PodcastFeature video={latestVideo} />

      {nextEvent && <UpcomingEventFeature event={nextEvent} />}
      {!nextEvent && (
        <section className="border-b border-paper/10 py-20">
          <Container className="text-center">
            <h2 className="text-2xl font-bold text-paper">Next Upcoming Event</h2>
            <p className="mt-4 text-paper/60">
              {isEventsConfigured
                ? "No upcoming events on the calendar right now — check back soon."
                : "Event data isn't connected yet. Set NOTION_TOKEN and NOTION_EVENTS_DB_ID to pull events from Notion."}
            </p>
          </Container>
        </section>
      )}

      <section className="relative overflow-hidden">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/images/gallery/IMG_0457.jpeg"
            alt="A packed multi-level venue during an AI Portland event"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/gallery/IMG_8602.jpeg"
                alt="Three AI Portland members chatting on a couch"
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-paper">{home.missionTitle}</h2>
              {home.missionBody.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-paper/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container>
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">
            Thank You to our Sponsors
          </h2>
          <div className="mt-8">
            {sponsors.length > 0 ? (
              <SponsorGrid sponsors={sponsors} />
            ) : (
              <p className="text-center text-paper/60">
                {isSponsorsConfigured
                  ? "No sponsors listed yet."
                  : "Sponsor data isn't connected yet. Set NOTION_TOKEN and NOTION_SPONSORS_DB_ID to pull sponsors from Notion."}
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

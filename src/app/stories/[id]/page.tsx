import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { NotionBlocks } from "@/components/NotionBlocks";
import { PodcastEmbed } from "@/components/PodcastEmbed";
import {
  estimateReadingMinutes,
  getAllStories,
  getRelatedEventName,
  getStoryBody,
  getStoryById,
} from "@/lib/notion/stories";
import { getYoutubeVideoId } from "@/lib/youtube";

export const revalidate = 300;

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({ id: story.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);
  return { title: story ? `${story.title} | AI Portland` : "Story | AI Portland" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Matches the Figma "story-detail-page" (node 423:42). The "Event Recap"
// badge is static per user request — the Stories database has no category
// field, so it isn't per-story data, just a fixed second chip. The photo
// caption shown in the comp is dropped (no such field either). The byline
// avatar, read time, dek, and intro are all real data (the "Person" /
// "Subhead" / "Intro" properties), not placeholders.
export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();

  const [blocks, relatedEvent] = await Promise.all([
    getStoryBody(story.id),
    story.relatedEventId ? getRelatedEventName(story.relatedEventId) : Promise.resolve(null),
  ]);

  const podcastVideoId = story.podcastUrl ? getYoutubeVideoId(story.podcastUrl) : null;

  const readingMinutes = estimateReadingMinutes(blocks);

  return (
    <article>
      <section className="gradient-hero py-16 text-paper">
        <Container className="max-w-3xl">
          <div className="flex w-full items-center justify-between">
            <Link href="/stories" className="text-sm font-semibold text-pink hover:underline">
              ← All stories
            </Link>

            <div className="flex gap-3">
              <span className="inline-flex items-center rounded-full border border-pink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-pink">
                Story
              </span>
              <span className="inline-flex items-center rounded-full border border-pink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-pink">
                Event Recap
              </span>
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {story.title}
          </h1>
          {story.subhead && <p className="mt-4 text-lg leading-relaxed text-paper/80">{story.subhead}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-paper/70">
            {story.author && (
              <span className="flex items-center gap-2">
                {story.author.avatarUrl && (
                  <span className="relative size-7 overflow-hidden rounded-full">
                    <Image src={story.author.avatarUrl} alt="" fill className="object-cover" />
                  </span>
                )}
                <span className="font-semibold text-paper">by {story.author.name}</span>
              </span>
            )}
            {story.author && <span className="size-1 rounded-full bg-paper/40" />}
            <span>{formatDate(story.date)}</span>
            <span className="size-1 rounded-full bg-paper/40" />
            <span className="font-semibold text-pink">{readingMinutes} min read</span>
          </div>

          {relatedEvent && (
            <p className="mt-3 text-sm text-paper/70">
              From{" "}
              <Link href={`/events/${relatedEvent.id}`} className="text-pink hover:underline">
                {relatedEvent.name}
              </Link>
            </p>
          )}
        </Container>
      </section>

      {story.coverImageUrl && (
        <Container className="max-w-3xl py-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={story.coverImageUrl} alt="" fill sizes="768px" className="object-cover" priority />
          </div>
        </Container>
      )}

      {(story.intro || podcastVideoId) && (
        <section className="py-10">
          <Container>
            <div className={story.intro && podcastVideoId ? "grid gap-10 lg:grid-cols-2" : "mx-auto max-w-3xl"}>
              {story.intro && (
                <p className="text-xl leading-relaxed text-paper">{story.intro}</p>
              )}
              {podcastVideoId && (
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-paper">Listen to the Episode</h2>
                  <p className="mt-2 text-paper/60">A companion podcast episode related to this story.</p>
                  <div className="mt-6 max-w-md overflow-hidden rounded-2xl">
                    <PodcastEmbed src={`https://www.youtube.com/embed/${podcastVideoId}`} height={160} />
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-paper/10 py-10">
        <Container className="max-w-3xl">
          <NotionBlocks blocks={blocks} />
        </Container>
      </section>

      {story.galleryImageUrls.length > 0 && (
        <section className="border-t border-paper/10 py-16">
          <Container>
            <h2 className="text-3xl font-extrabold tracking-tight text-paper">Photo Gallery</h2>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
              {story.galleryImageUrls.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 11vw, (min-width: 640px) 16vw, 33vw"
                      className="object-cover transition hover:scale-[1.03]"
                    />
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

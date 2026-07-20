import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { StoryCard } from "@/components/StoryCard";
import { getAllStories, isStoriesConfigured } from "@/lib/notion/stories";

export const metadata: Metadata = {
  title: "Stories | AI Portland",
};

export const revalidate = 300;

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-pink">Recaps</p>
          <h1 className="mt-2 text-4xl font-bold">Stories</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-paper/80">
            Recaps, reflections, and highlights from AI Portland events and the community.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {stories.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="text-paper/60">
              {isStoriesConfigured
                ? "No stories posted yet — check back soon."
                : "Story data isn't connected yet. Set NOTION_TOKEN and NOTION_STORIES_DB_ID to pull stories from Notion."}
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

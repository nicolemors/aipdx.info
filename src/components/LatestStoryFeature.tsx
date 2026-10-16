import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { storyImageProxyUrl, type Story } from "@/lib/notion/stories";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Matches the Figma "latest-story-section" / "feature-spread" layout. The
// Figma comp splits the summary card into a read-time index, a distinct
// sub-headline, and a longer paragraph — three pieces of copy we don't have
// in the Stories database. Collapsed here into one excerpt (first paragraph
// of the story body) rather than inventing fields that don't exist yet.
export function LatestStoryFeature({ story, excerpt }: { story: Story; excerpt: string | null }) {
  return (
    <section className="border-b border-paper/10 bg-ink py-[100px]">
      <Container>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-paper">
            <span className="h-2.5 w-2.5 rounded-full bg-pink" />
            Latest Community Feature
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-paper sm:text-4xl lg:text-[44px]">
            <Link href={`/stories/${story.id}`} className="transition hover:text-pink">
              {story.title}
            </Link>
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <Link
            href={`/stories/${story.id}`}
            aria-label={story.title}
            className="relative min-h-[320px] w-full overflow-hidden rounded-[24px] bg-surface lg:min-h-[540px]"
          >
            <Image
              src={story.coverImageUrl ? storyImageProxyUrl(story, "cover") : "/images/story-fallback.jpg"}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </Link>

          <div className="flex w-full flex-col justify-center gap-8 rounded-[24px] border border-paper/10 bg-surface p-8 lg:p-10">
            <div className="flex w-full flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-[1px] text-pink">Story · {formatDate(story.date)}</p>
              {excerpt && <p className="w-full leading-7 text-paper/75">{excerpt}</p>}
            </div>
            <Link
              href={`/stories/${story.id}`}
              className="flex w-full items-center gap-2 text-sm font-bold uppercase tracking-[1px] text-pink transition hover:text-paper"
            >
              Continue reading →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/stories"
            className="rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            All Stories →
          </Link>
        </div>
      </Container>
    </section>
  );
}

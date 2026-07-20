import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/lib/notion/stories";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.id}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface">
        {story.coverImageUrl && (
          <Image
            src={story.coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">{formatDate(story.date)}</p>
      <h3 className="mt-1 text-lg font-semibold text-paper group-hover:text-pink">
        {story.title}
      </h3>
    </Link>
  );
}

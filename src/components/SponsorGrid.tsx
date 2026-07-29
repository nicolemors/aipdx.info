import Image from "next/image";
import type { Sponsor } from "@/lib/notion/sponsors";

// One-off visual corrections for logos whose source files have very
// different amounts of built-in padding, so they don't read as wildly
// different sizes next to each other at the same box size.
const LOGO_SCALE: Record<string, number> = {
  Kiln: 0.7,
  "Willamette University": 1.3,
};

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {sponsors.map((sponsor) => {
        const scale = LOGO_SCALE[sponsor.name] ?? 1;
        const content = sponsor.logoUrl ? (
          <div
            className="relative h-20 w-48 grayscale transition hover:grayscale-0"
            style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
          >
            <Image src={sponsor.logoUrl} alt={sponsor.name} fill sizes="192px" className="object-contain" />
          </div>
        ) : (
          <span className="text-sm font-medium text-paper/70 hover:text-paper">{sponsor.name}</span>
        );

        return sponsor.link ? (
          <a key={sponsor.id} href={sponsor.link} target="_blank" rel="noreferrer" aria-label={sponsor.name}>
            {content}
          </a>
        ) : (
          <span key={sponsor.id}>{content}</span>
        );
      })}
    </div>
  );
}

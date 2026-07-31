import Image from "next/image";
import type { Sponsor } from "@/lib/notion/sponsors";

// One-off visual corrections for logos whose source files have very
// different amounts of built-in padding, so they don't read as wildly
// different sizes next to each other at the same box size.
const LOGO_SCALE: Record<string, number> = {
  Kiln: 0.7,
  "Willamette University": 1.3,
};

// Manual dark-card override for logos whose corners are transparent (so
// detectCardColor finds nothing to match) but still need a dark card —
// e.g. a light/reversed-color logo. Takes priority over the auto-detected
// sponsor.cardColor; the default card is white otherwise.
const CARD_BG_OVERRIDE: Record<string, string> = {
  "Willamette University": "transparent",
};

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {sponsors.map((sponsor) => {
        const name = sponsor.name.trim();
        const scale = LOGO_SCALE[name] ?? 1;
        const bgColor = CARD_BG_OVERRIDE[name] ?? sponsor.cardColor;
        const content = sponsor.logoUrl ? (
          <div
            className={`flex h-20 w-48 items-center justify-center rounded-xl p-3 ${bgColor ? "" : "bg-paper"}`}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            <div
              className="relative h-full w-full"
              style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
            >
              <Image src={sponsor.logoUrl} alt={sponsor.name} fill sizes="192px" className="object-contain" />
            </div>
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

import Image from "next/image";
import type { Sponsor } from "@/lib/notion/sponsors";

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {sponsors.map((sponsor) => {
        const content = sponsor.logoUrl ? (
          <div className="relative h-12 w-32 grayscale transition hover:grayscale-0">
            <Image src={sponsor.logoUrl} alt={sponsor.name} fill sizes="128px" className="object-contain" />
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

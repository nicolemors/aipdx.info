import Image from "next/image";
import type { Partner } from "@/lib/notion/partners";

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-14 gap-y-8">
      {partners.map((partner) => {
        const content = partner.logoUrl ? (
          <div
            className={`flex h-24 w-56 items-center justify-center rounded-xl p-4 ${partner.cardColor ? "" : "bg-paper"}`}
            style={partner.cardColor ? { backgroundColor: partner.cardColor } : undefined}
          >
            <div className="relative h-full w-full">
              <Image src={partner.logoUrl} alt={partner.name} fill sizes="224px" className="object-contain" />
            </div>
          </div>
        ) : (
          <span className="text-sm font-medium text-paper/70 hover:text-paper">{partner.name}</span>
        );

        return partner.link ? (
          <a key={partner.id} href={partner.link} target="_blank" rel="noreferrer" aria-label={partner.name}>
            {content}
          </a>
        ) : (
          <span key={partner.id}>{content}</span>
        );
      })}
    </div>
  );
}

import Image from "next/image";
import type { Partner } from "@/lib/notion/partners";

// One-off size correction for logos whose source files have a lot of
// built-in padding, so they don't read as smaller than the rest — same
// pattern as SponsorGrid's LOGO_SCALE.
const LOGO_SCALE: Record<string, number> = {
  "Portland AI Engineers": 1.4,
  "Upstart Collective": 2.2,
  "Portland Incubator Experiment (PIE)": 1.4,
  "True Calling Recruitment": 1.4,
  "Portland Trail Blazers": 1.4,
  "Rose City Techies": 1.4,
  "Good Collab AI": 1.4,
  "Graybox": 1.4,
};

// Manual dark-card override for logos whose corners are transparent (so
// detectCardColor finds nothing to match) but still need a dark card —
// e.g. a light/reversed-color logo. Takes priority over the auto-detected
// partner.cardColor; the default card is white otherwise.
const CARD_BG_OVERRIDE: Record<string, string> = {
  "True Calling Recruitment": "#1f1f1f",
  "Upstart Collective": "#1f1f1f",
  "Portland Trail Blazers": "#1f1f1f",
  "Ecom Northwest": "#1f1f1f",
  "Loveable": "#1f1f1f",
  "Goat Digital": "#1f1f1f",
  "HR Annie Consulting": "#1f1f1f",
  "52 Limited": "#1f1f1f",
  "Keboola": "#000000",
  "Willamette University School of Computing & Information Sciences": "transparent",
  "Prosper Portland": "#1f1f1f",
  "Apify": "#1f1f1f",
  "City of Portland": "#1f1f1f",
  "Graybox": "#1f1f1f",
  "Idealist Consulting": "#1f1f1f",
};

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 sm:justify-start">
      {partners.map((partner) => {
        const name = partner.name.trim();
        const scale = LOGO_SCALE[name] ?? 1;
        const bgColor = CARD_BG_OVERRIDE[name] ?? partner.cardColor;
        const content = partner.logoUrl ? (
          <div
            className={`flex h-24 w-56 items-center justify-center rounded-xl p-4 ${bgColor ? "" : "bg-paper"}`}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            <div
              className="relative h-full w-full"
              style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
            >
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

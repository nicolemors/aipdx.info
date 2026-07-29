import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PartnerGrid } from "@/components/PartnerGrid";
import { getPartners, isPartnersConfigured } from "@/lib/notion/partners";
import { partners } from "@/content/site";

export const metadata: Metadata = {
  title: "Partners | AI Portland",
};

export const revalidate = 300;

export default async function PartnersPage() {
  const allPartners = await getPartners();

  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink">{partners.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-bold">{partners.title}</h1>
          <p className="mt-4 leading-relaxed text-paper/80">{partners.intro}</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {partners.pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-paper/10 bg-surface p-8">
                <h2 className="text-lg font-bold text-paper">{pillar.title}</h2>
                <p className="mt-3 leading-relaxed text-paper/70">{pillar.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            {allPartners.length > 0 ? (
              <PartnerGrid partners={allPartners} />
            ) : (
              <p className="text-center text-paper/60">
                {isPartnersConfigured
                  ? "No partners listed yet."
                  : "Partner data isn't connected yet. Set NOTION_TOKEN and NOTION_PARTNERS_DB_ID to pull partners from Notion."}
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container className="max-w-2xl text-center sm:mx-auto">
          <h2 className="text-2xl font-bold text-paper">{partners.cta}</h2>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink"
          >
            Reach out
          </a>
        </Container>
      </section>
    </>
  );
}

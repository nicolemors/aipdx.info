import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SponsorGrid } from "@/components/SponsorGrid";
import { getSponsors, isSponsorsConfigured } from "@/lib/notion/sponsors";
import { sponsorship } from "@/content/site";

export const metadata: Metadata = {
  title: "Sponsorship | AI Portland",
};

export const revalidate = 300;

export default async function SponsorshipPage() {
  const sponsors = await getSponsors();

  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container>
          <h1 className="text-4xl font-bold">Sponsorship</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-paper/90">{sponsorship.intro}</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-paper">Sponsorship Value</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {sponsorship.values.map((value, i) => (
              <div key={value.title}>
                <p className="text-3xl font-bold text-pink">{i + 1}.</p>
                <h3 className="mt-2 text-lg font-bold text-paper">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/70">{value.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container>
          <h2 className="text-2xl font-bold text-paper">2025 Metrics</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {sponsorship.metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-paper/10 bg-ink p-6">
                <p className="text-3xl font-bold text-pink">{metric.value}</p>
                <p className="mt-1 font-semibold text-paper">{metric.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">{metric.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-paper">Sponsorship Packages</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {sponsorship.tiers.map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-paper/10 bg-surface p-8">
                <h3 className="text-xl font-bold text-paper">{tier.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-pink">{tier.price}</span>{" "}
                  {tier.cadence && <span className="text-sm text-muted">{tier.cadence}</span>}
                </p>
                {tier.perks ? (
                  <ul className="mt-6 space-y-3 text-sm text-paper/75">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <span className="text-pink">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 text-sm leading-relaxed text-paper/75">{tier.body}</p>
                )}
                <a
                  href="/contact"
                  className="mt-8 inline-block rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink"
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">
            Thank You to our past and present Sponsors
          </h2>
          <div className="mt-8">
            {sponsors.length > 0 ? (
              <SponsorGrid sponsors={sponsors} />
            ) : (
              <p className="text-center text-paper/60">
                {isSponsorsConfigured
                  ? "No sponsors listed yet."
                  : "Sponsor data isn't connected yet. Set NOTION_TOKEN and NOTION_SPONSORS_DB_ID to pull sponsors from Notion."}
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

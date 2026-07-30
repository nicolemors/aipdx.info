import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { AboutSubNav } from "@/components/AboutSubNav";
import { about, type StoryBlock } from "@/content/site";

export const metadata: Metadata = {
  title: "About | AI Portland",
};

function StoryBlocks({ blocks }: { blocks: StoryBlock[] }) {
  return blocks.map((block, i) => {
    if (block.type === "heading") {
      return (
        <h3 key={i} className="mt-12 text-2xl font-bold text-paper first:mt-0">
          {block.text}
        </h3>
      );
    }

    if (block.type === "lines") {
      return (
        <div key={i} className="mt-4 space-y-1 border-l-2 border-[#e26600] pl-4">
          {block.lines.map((line) => (
            <p key={line} className="font-bold leading-snug text-[#e26600]">
              {line}
            </p>
          ))}
        </div>
      );
    }

    if (block.type === "quote") {
      return (
        <blockquote key={i} className="mt-4 border-l-2 border-pink pl-4 italic leading-relaxed text-paper/90">
          “{block.text}”
        </blockquote>
      );
    }

    return (
      <p key={i} className="mt-4 leading-relaxed text-paper/75">
        {block.text}
      </p>
    );
  });
}

export default function AboutPage() {
  return (
    <>
      <section id="about" className="relative scroll-mt-16 overflow-hidden bg-ink">
        {/* Matches Figma node 841:54: full width, no horizontal crop at all —
            just a vertical object-position (~13% from top, not dead center)
            so the cover crop keeps both "ONWARD" and "ROSE CITY" in frame
            instead of centering on the sign and cutting either line off. */}
        <div className="relative aspect-[3/4] w-full sm:aspect-[16/9]">
          <Image
            src="/images/about-hero-rose-city.jpg"
            alt="The lit-up 'Onward Rose City' rooftop sign in Portland at night"
            fill
            sizes="100vw"
            className="object-cover object-[center_13%]"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(18,18,18,0.98) 0%, rgba(18,18,18,0.9) 35%, rgba(18,18,18,0.35) 75%, rgba(18,18,18,0.85) 100%)",
            }}
          />
        </div>

        <Container className="absolute inset-0 flex flex-col justify-center pb-16 pt-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-[#e26600] bg-ink/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#ff7b00]">
              Portland-Grown · Human-Centered
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-paper sm:text-6xl lg:text-[72px]">
              About Us
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-paper sm:text-xl">
              {about.ledeBeforeEmphasis}
              <span className="font-bold text-[#ff7b00]">together</span>.
            </p>
          </div>
        </Container>
      </section>

      <div className="sticky top-16 z-40 border-b border-paper/10 bg-ink/95 py-4 backdrop-blur-sm">
        <Container>
          <AboutSubNav />
        </Container>
      </div>

      <section id="mission" className="scroll-mt-36 py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#e26600]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e26600]" />
                {about.manifesto.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-paper sm:text-4xl">
                {about.manifesto.headlineBeforeEmphasis}
              </h2>
              <p className="mt-4 leading-relaxed text-paper/70">{about.manifesto.body}</p>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-paper/10 sm:aspect-[4/3]">
              <Image
                src={about.manifesto.visualImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/15" />
              <div className="absolute inset-4 flex flex-col justify-end">
                <div className="rounded-xl border border-paper/10 bg-ink/90 p-6 backdrop-blur-sm">
                  <p className="font-bold text-paper">{about.manifesto.visualQuoteTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{about.manifesto.visualQuoteBody}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
          <Image
            src={about.communityCard.backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Container className="absolute inset-0 flex items-center py-12">
          <div className="max-w-xl rounded-2xl bg-ink p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold leading-tight text-paper sm:text-4xl">
              {about.communityCard.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-paper/75">{about.communityCard.intro}</p>
            <div className="mt-4 space-y-1 border-l-2 border-[#e26600] pl-4">
              {about.communityCard.highlights.map((line) => (
                <p key={line} className="font-bold text-[#e26600]">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-paper/75">{about.communityCard.closing}</p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <StoryBlocks blocks={about.story} />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:items-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src={about.regional.image}
                alt="The Portland, Oregon Old Town sign at dusk"
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover object-[90%_center]"
              />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-paper sm:text-4xl">{about.regional.heading}</h2>
              <p className="mt-6 leading-relaxed text-paper/70">{about.regional.intro}</p>

              <div className="mt-6">
                <p className="leading-relaxed text-paper/70">{about.regional.valuesIntro}</p>
                {about.regional.values.map((value) => (
                  <p key={value} className="font-bold text-[#e26600]">
                    {value}
                  </p>
                ))}
              </div>

              <p className="mt-6 leading-relaxed text-paper/70">{about.regional.closing}</p>
              <p className="mt-6 leading-relaxed text-paper/70">
                {about.regional.finalBeforeEmphasis}
                <span className="font-bold text-paper">{about.regional.finalEmphasis}</span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="team" className="scroll-mt-36 bg-surface py-16">
        <Container>
          <h2 className="text-2xl font-bold text-paper">Meet our Team</h2>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Image
              src="/images/team-nicole-megan.jpg"
              alt="Megan Notarte and Nicole Mors, co-founders of AI Portland"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {about.team.map((person) => (
              <div key={person.name} className="rounded-2xl border border-paper/10 bg-ink p-8">
                <h3 className="text-lg font-bold text-paper">{person.name}</h3>
                {person.role && <p className="text-sm font-medium text-pink">{person.role}</p>}
                {person.bio.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-paper/70">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="story" className="scroll-mt-36 py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:items-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/gallery/megan-nicole.jpg"
                alt="Megan and Nicole speaking together on stage"
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover -scale-x-100 object-[40%_center]"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-paper">Our Story</h2>
              <StoryBlocks blocks={about.ourStory} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

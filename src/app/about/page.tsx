import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About | AI Portland",
};

export default function AboutPage() {
  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container>
          <h1 className="text-4xl font-bold">About Us</h1>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          {about.story.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-relaxed text-paper/75">
              {paragraph}
            </p>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container>
          <h2 className="text-2xl font-bold text-paper">Meet our Team</h2>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Image
              src="/images/team-nicole-megan.jpg"
              alt="Megan Notarte and J. Nicole Mors, co-founders of AI Portland"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {about.team.map((person) => (
              <div key={person.name} className="rounded-2xl border border-paper/10 bg-ink p-8">
                <h3 className="text-lg font-bold text-paper">{person.name}</h3>
                <p className="text-sm font-medium text-pink">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{person.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

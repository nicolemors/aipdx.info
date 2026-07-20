import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { contact, links } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us | AI Portland",
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink">
          {contact.eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-paper">{contact.title}</h1>
        <p className="mt-4 leading-relaxed text-paper/75">{contact.intro}</p>

        <div className="mt-8 rounded-2xl border border-paper/10 bg-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            What&apos;s this about?
          </p>
          <ul className="mt-3 space-y-2 text-sm text-paper/75">
            {contact.purposes.map((purpose) => (
              <li key={purpose}>· {purpose}</li>
            ))}
          </ul>

          <a
            href={`mailto:${links.contactEmail}`}
            className="mt-6 inline-block rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink"
          >
            Email {links.contactEmail}
          </a>
        </div>
      </Container>
    </section>
  );
}

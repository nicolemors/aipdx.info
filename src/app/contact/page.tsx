import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
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
          <ContactForm />
        </div>

        <p className="mt-6 text-sm text-paper/60">
          Prefer email?{" "}
          <a href={`mailto:${links.contactEmail}`} className="text-pink underline">
            {links.contactEmail}
          </a>
        </p>
      </Container>
    </section>
  );
}

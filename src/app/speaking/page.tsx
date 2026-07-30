import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { speaking } from "@/content/site";

const galleryPhotos = [
  { src: "/images/gallery/SF 266.jpg", alt: "AI Portland co-founders on stage at the Silicon Forest Summit" },
  { src: "/images/gallery/SF 264.jpg", alt: "An AI Portland co-founder speaking into a microphone at the Silicon Forest Summit" },
  { src: "/images/gallery/SF 258.jpg", alt: "An AI Portland co-founder speaking into a microphone at the Silicon Forest Summit" },
];

export const metadata: Metadata = {
  title: "Speaking | AI Portland",
};

export default function SpeakingPage() {
  return (
    <>
      <section className="gradient-hero py-16 text-paper">
        <Container>
          <h1 className="text-4xl font-bold">Public Speaking Engagements</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-paper/90">{speaking.intro}</p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-pink px-6 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            {speaking.cta}
          </a>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {speaking.galleryCaption}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {galleryPhotos.map((photo) => (
              <div key={photo.src} className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

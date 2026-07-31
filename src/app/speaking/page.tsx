import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { speaking } from "@/content/site";

const speakingVideos = [
  { provider: "vimeo" as const, embedSrc: "https://player.vimeo.com/video/1024921598?h=3cf61fcc9f" },
  { provider: "youtube" as const, embedSrc: "https://www.youtube.com/embed/EwjaaSVXOOI" },
];

const galleryPhotos = [
  { src: "/images/gallery/SF 264.jpg", alt: "An AI Portland co-founder speaking into a microphone at the Silicon Forest Summit" },
  {
    src: "/images/gallery/SF 266.jpg",
    alt: "AI Portland co-founders on stage at the Silicon Forest Summit",
    // Wide shot with the two of them at opposite edges of the frame — a
    // square center-crop can't fit both without cutting one off, so this
    // one gets object-contain instead of object-cover.
    fit: "contain" as const,
  },
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
                  className={photo.fit === "contain" ? "object-contain" : "object-cover"}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Watch</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {speakingVideos.map((video) => (
              <div key={video.embedSrc} className="relative aspect-video overflow-hidden rounded-2xl">
                <iframe
                  src={video.embedSrc}
                  className="absolute inset-0 h-full w-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  title="AI Portland speaking engagement video"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

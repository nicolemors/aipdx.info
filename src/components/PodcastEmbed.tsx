export function PodcastEmbed({ src, height = 352 }: { src: string; height?: number }) {
  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      style={{ borderRadius: 12 }}
      frameBorder="0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      loading="lazy"
      title="AI Portland podcast player"
    />
  );
}

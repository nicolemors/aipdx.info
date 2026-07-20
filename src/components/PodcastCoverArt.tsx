const rings = [
  { r: 192, fillOpacity: 0.08, strokeOpacity: 0.15 },
  { r: 148, fillOpacity: 0.12, strokeOpacity: 0.25 },
  { r: 113, fillOpacity: 0.18, strokeOpacity: 0.35 },
];

// Mascot's native viewBox (public/images/mascot-outline.svg), centered and
// rotated -15deg to match the Figma "podcast-cover-art" (node 293:516).
const mascotWidth = 145.958;
const mascotHeight = 132.531;
const mascotScale = 0.89;

// Built as one inline SVG (viewBox scales to any container size) rather than
// a flattened raster export, so it stays crisp and the rings/text recolor
// with the theme instead of shipping a static image.
export function PodcastCoverArt({ className }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-ink ${className ?? ""}`}>
      <svg viewBox="0 0 420 420" className="h-full w-full">
        {rings.map((ring) => (
          <circle
            key={ring.r}
            cx="210"
            cy="210"
            r={ring.r}
            fill="#ED6BA6"
            fillOpacity={ring.fillOpacity}
            stroke="#ED6BA6"
            strokeOpacity={ring.strokeOpacity}
            strokeWidth="1.5"
          />
        ))}

        <text x="210" y="70" textAnchor="middle" className="font-sans text-[27px] font-bold fill-paper">
          (SUPER)CHARGED
        </text>
        <text x="210" y="364" textAnchor="middle" className="font-sans text-[27px] font-bold fill-paper">
          BY AI
        </text>

        <g
          transform={`translate(210,210) rotate(-15) scale(${mascotScale}) translate(${-mascotWidth / 2},${-mascotHeight / 2})`}
        >
          <use href="/images/mascot-outline.svg#neon-agi" />
        </g>
      </svg>
    </div>
  );
}

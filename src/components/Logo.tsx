import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? "h-9 w-9"}`}>
      <Image src="/images/mascot-hero.png" alt="" fill className="object-contain" priority />
    </div>
  );
}

// Matches the Figma "Logo" component (node 1:3): mascot icon + "AI Portland"
// wordmark side by side, at the same proportions as the comp. Composed from
// the site's existing real assets (mascot-hero.png, wordmark.svg) rather
// than a flattened export.
export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? "h-9"}`} style={{ aspectRatio: "2556 / 597" }}>
      <div className="absolute inset-y-0 left-0" style={{ width: "25.47%" }}>
        <LogoMark className="h-full w-full" />
      </div>
      <div className="absolute" style={{ left: "25.67%", right: 0, top: "26.87%", bottom: "33.2%" }}>
        <Image
          src="/images/wordmark.svg"
          alt="AI Portland"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </div>
  );
}

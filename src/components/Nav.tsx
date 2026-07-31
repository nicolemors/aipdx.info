"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nav } from "@/content/site";

// Matches Figma "Desktop - 2" (on load: full-bleed wordmark, nav row below)
// collapsing into "Desktop - 3" (on scroll: compact single-row bar) once the
// user scrolls past the hero. Desktop-only in Figma — mobile gets a single
// always-compact bar since there's no mobile comp to match.
const SCROLL_THRESHOLD = 100;

// className must set an explicit width (not max-width) — this sits inside a
// shrink-to-fit flex Link, so a percentage/max-width alone resolves against
// an indeterminate container and the aspect-ratio height collapses to 0.
function Wordmark({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: "1344 / 169" }}>
      <Image
        src="/images/wordmark.svg"
        alt="AI Portland"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}

function NavLinks({ onNavigate, linkClassName = "" }: { onNavigate?: () => void; linkClassName?: string }) {
  return (
    <>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`text-sm font-medium text-paper transition hover:text-pink ${linkClassName}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-paper transition hover:bg-paper/10"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        {open ? (
          <path d="M6 6l12 12M18 6l-12 12" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/95 backdrop-blur-sm text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <Wordmark className="w-56 md:w-64 lg:w-72" />
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-semibold md:flex">
          <NavLinks />
        </nav>

        <div className="md:hidden">
          <MenuButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </div>

      {open && (
        <nav className="sm:hidden flex flex-col gap-1 border-t border-paper/10 px-6 pb-4">
          <NavLinks onNavigate={closeMenu} linkClassName="flex min-h-10 items-center" />
        </nav>
      )}
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "mission", label: "Mission" },
  { id: "team", label: "Team" },
  { id: "story", label: "Story" },
];

// Marks a section active once it crosses just below the stacked sticky
// headers (main nav + this sub-nav bar, ~140px) and while it still occupies
// the upper part of the viewport.
export function AboutSubNav() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="flex w-fit items-center gap-2 rounded-full border border-paper/10 bg-surface p-1.5">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`rounded-full px-3.5 py-2.5 text-[13px] uppercase tracking-wide transition ${
            active === id ? "bg-[#e26600] font-bold text-paper" : "font-semibold text-paper/80"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";

export type SectionNavItem = { id: string; label: string };

/**
 * "On this page" scroll-spy nav (AGENTS.md §7.6).
 * Sticky pills on desktop, horizontal chips on mobile.
 */
export default function SectionNav({
  items,
  label = "On this page",
}: {
  items: SectionNavItem[];
  label?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className="sticky top-[var(--header-h,4rem)] z-40 -mx-4 my-8 border-y border-[var(--card-border)] bg-[rgba(0,13,29,0.9)] px-2 py-2 backdrop-blur-md sm:mx-0 sm:w-fit sm:rounded-full sm:border"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`block whitespace-nowrap rounded-full px-3 py-2.5 text-xs font-medium transition-colors ${
                  current
                    ? "bg-[rgba(30,211,242,0.14)] text-white"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

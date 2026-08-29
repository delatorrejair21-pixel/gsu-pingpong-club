"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Leaderboard" },
  { href: "/matches", label: "Matches" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-5xl gap-6 border-t border-ink-800 px-4 sm:px-6">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-1 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? "border-accent text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

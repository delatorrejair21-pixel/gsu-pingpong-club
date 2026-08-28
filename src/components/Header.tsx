import Image from "next/image";
import Link from "next/link";
import { getCurrentWeek } from "@/lib/data";

export function Header() {
  const currentWeek = getCurrentWeek();

  return (
    <header className="border-b border-ink-700 bg-ink-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt="Table Tennis GSU logo"
              fill
              sizes="128px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
              Table Tennis GSU
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Official Rankings
            </div>
          </div>
        </Link>
        <div className="shrink-0 rounded-full border border-ink-600 bg-ink-850 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-bright sm:px-4 sm:text-sm">
          {currentWeek}
        </div>
      </div>
    </header>
  );
}

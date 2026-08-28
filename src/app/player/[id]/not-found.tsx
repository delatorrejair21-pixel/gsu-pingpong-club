import Link from "next/link";
import { Header } from "@/components/Header";

export default function PlayerNotFound() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <div className="px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold uppercase text-white">
          Player Not Found
        </h1>
        <p className="mt-2 text-white/50">
          No player exists with that id.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-bright hover:underline"
        >
          <span aria-hidden>←</span> Back to Leaderboard
        </Link>
      </div>
    </main>
  );
}

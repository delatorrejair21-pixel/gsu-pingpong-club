import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PlayerHero } from "@/components/PlayerHero";
import { StatCard } from "@/components/StatCard";
import { MatchHistoryTable } from "@/components/MatchHistoryTable";
import {
  getAllPlayers,
  getMatchesForPlayer,
  getPlayerById,
  getRankedPlayers,
} from "@/lib/data";

interface PlayerPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllPlayers().map((player) => ({ id: player.id }));
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const player = getPlayerById(params.id);

  if (!player) {
    notFound();
  }

  const matches = getMatchesForPlayer(player.id);
  const playersById = new Map(
    getRankedPlayers().map((p) => [p.id, p] as const)
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <PlayerHero player={player} />

      <div className="px-4 py-6 sm:px-6">
        <div className="flex gap-4">
          <StatCard label="Record" value={`${player.wins}-${player.losses}`} />
          <StatCard label="Rating" value={String(player.rating)} accent />
        </div>

        <h2 className="mb-3 mt-8 font-heading text-lg font-bold uppercase tracking-wide text-white">
          Match History
        </h2>
        <MatchHistoryTable
          playerId={player.id}
          matches={matches}
          playersById={playersById}
        />

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-accent-bright"
        >
          <span aria-hidden>←</span> Back to Leaderboard
        </Link>
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { MatchScoreboard } from "@/components/MatchScoreboard";
import { getAllMatches, getMatchById, getRankedPlayers } from "@/lib/data";

interface MatchPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllMatches().map((match) => ({ id: match.id }));
}

export default function MatchPage({ params }: MatchPageProps) {
  const match = getMatchById(params.id);
  if (!match) notFound();

  const playersById = new Map(getRankedPlayers().map((p) => [p.id, p] as const));
  const playerA = playersById.get(match.playerAId);
  const playerB = playersById.get(match.playerBId);
  if (!playerA || !playerB) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <MatchScoreboard match={match} playerA={playerA} playerB={playerB} />
    </main>
  );
}

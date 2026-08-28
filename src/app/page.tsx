import { Header } from "@/components/Header";
import { StatStrip } from "@/components/StatStrip";
import { LeaderboardClient } from "@/components/LeaderboardClient";
import { getAllMatches, getRankedPlayers } from "@/lib/data";

export default function LeaderboardPage() {
  const players = getRankedPlayers();
  const matches = getAllMatches();

  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <StatStrip totalPlayers={players.length} totalMatches={matches.length} />
      <LeaderboardClient players={players} />
    </main>
  );
}

import { Header } from "@/components/Header";
import { StatStrip } from "@/components/StatStrip";
import { LeaderboardClient } from "@/components/LeaderboardClient";
import { getPlayedMatches, getRankedPlayers } from "@/lib/data";

export default function LeaderboardPage() {
  const players = getRankedPlayers();
  const playedMatches = getPlayedMatches();

  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <StatStrip totalPlayers={players.length} totalMatches={playedMatches.length} />
      <LeaderboardClient players={players} />
    </main>
  );
}

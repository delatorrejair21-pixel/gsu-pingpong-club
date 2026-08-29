import { Header } from "@/components/Header";
import { MatchListItem } from "@/components/MatchListItem";
import { getAllMatchesSorted, getRankedPlayers } from "@/lib/data";

export default function MatchesPage() {
  const matches = getAllMatchesSorted();
  const playersById = new Map(getRankedPlayers().map((p) => [p.id, p] as const));

  return (
    <main className="mx-auto min-h-screen max-w-5xl">
      <Header />

      {matches.length === 0 ? (
        <div className="px-4 py-16 text-center text-white/50 sm:px-6">
          No matches recorded yet.
        </div>
      ) : (
        <div>
          {matches.map((match) => {
            const playerA = playersById.get(match.playerAId);
            const playerB = playersById.get(match.playerBId);
            if (!playerA || !playerB) return null;

            return (
              <MatchListItem
                key={match.id}
                match={match}
                playerA={playerA}
                playerB={playerB}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

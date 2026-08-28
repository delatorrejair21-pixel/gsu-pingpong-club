import Link from "next/link";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  getGameScoreStrings,
  getMatchOutcome,
  getOpponentId,
} from "@/lib/data";
import type { Match, Player } from "@/lib/types";

interface MatchHistoryTableProps {
  playerId: string;
  matches: Match[];
  playersById: Map<string, Player>;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function MatchHistoryTable({
  playerId,
  matches,
  playersById,
}: MatchHistoryTableProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-ink-700 bg-ink-850 px-6 py-12 text-center text-white/50">
        No matches recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-700">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-900/60 text-xs font-medium uppercase tracking-wider text-white/40">
            <th className="py-3 pl-4">Date</th>
            <th className="py-3">Opponent</th>
            <th className="py-3">Games</th>
            <th className="py-3 text-center">Result</th>
            <th className="py-3 pr-4">Event</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const opponentId = getOpponentId(match, playerId);
            const opponent = playersById.get(opponentId);
            const outcome = getMatchOutcome(match, playerId);
            const gameScores = getGameScoreStrings(match, playerId);

            return (
              <tr
                key={match.id}
                className="border-b border-ink-800 bg-ink-850 last:border-b-0"
              >
                <td className="whitespace-nowrap py-3 pl-4 text-sm text-white/60">
                  {formatDate(match.date)}
                </td>
                <td className="py-3">
                  {opponent ? (
                    <Link
                      href={`/player/${opponent.id}`}
                      className="flex items-center gap-2 font-medium text-white hover:text-accent-bright"
                    >
                      <PlayerAvatar
                        name={opponent.name}
                        photo={opponent.photo}
                        size={24}
                      />
                      {opponent.name}
                    </Link>
                  ) : (
                    <span className="text-white/40">Unknown Player</span>
                  )}
                </td>
                <td className="py-3 text-sm tabular-nums text-white/70">
                  {gameScores.join(", ")}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded font-heading text-xs font-bold ${
                      outcome.result === "W"
                        ? "bg-accent/20 text-accent-bright"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {outcome.result}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm text-white/50">
                  {match.event ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

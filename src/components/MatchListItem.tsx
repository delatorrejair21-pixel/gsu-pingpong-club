import Link from "next/link";
import { PlayerAvatar } from "./PlayerAvatar";
import { formatMatchDate, getMatchGameTally } from "@/lib/data";
import type { Match, RankedPlayer } from "@/lib/types";

interface MatchListItemProps {
  match: Match;
  playerA: RankedPlayer;
  playerB: RankedPlayer;
}

export function MatchListItem({ match, playerA, playerB }: MatchListItemProps) {
  const tally = getMatchGameTally(match);

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block border-b border-ink-800 px-4 py-4 transition-colors hover:bg-ink-850 sm:px-6"
    >
      <div className="mb-3 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-wider text-white/40">
        {match.event && <span>{match.event}</span>}
        {match.event && <span>•</span>}
        <span>{formatMatchDate(match.date)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <PlayerAvatar
            name={playerA.name}
            photo={playerA.photo}
            size={36}
            position={playerA.avatarPosition}
          />
          <span
            className={`truncate font-medium ${
              tally.a > tally.b ? "text-white" : "text-white/60"
            }`}
          >
            {playerA.name}
          </span>
        </div>
        <div className="shrink-0 px-2 font-heading text-lg font-bold tabular-nums text-accent-bright">
          {tally.a}-{tally.b}
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <span
            className={`truncate text-right font-medium ${
              tally.b > tally.a ? "text-white" : "text-white/60"
            }`}
          >
            {playerB.name}
          </span>
          <PlayerAvatar
            name={playerB.name}
            photo={playerB.photo}
            size={36}
            position={playerB.avatarPosition}
          />
        </div>
      </div>
    </Link>
  );
}

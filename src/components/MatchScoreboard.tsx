import Link from "next/link";
import { MatchPoll } from "./MatchPoll";
import { PlayerPhoto } from "./PlayerPhoto";
import {
  formatMatchDate,
  getFlagEmoji,
  getMatchGameTally,
  isMatchUpcoming,
} from "@/lib/data";
import type { Match, RankedPlayer } from "@/lib/types";

interface MatchScoreboardProps {
  match: Match;
  playerA: RankedPlayer;
  playerB: RankedPlayer;
}

export function MatchScoreboard({ match, playerA, playerB }: MatchScoreboardProps) {
  const tally = getMatchGameTally(match);
  const upcoming = isMatchUpcoming(match);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-heading text-xl font-bold uppercase leading-tight text-white sm:text-2xl">
          {match.event ?? "Match Result"}
        </div>
        {upcoming && (
          <span className="rounded-full border border-ink-600 bg-ink-850 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/50">
            Upcoming
          </span>
        )}
      </div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-accent-bright">
        {formatMatchDate(match.date)}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
        <MatchPlayerColumn player={playerA} align="left" />
        <MatchPlayerColumn player={playerB} align="right" />
      </div>

      {upcoming ? (
        <MatchPoll
          matchId={match.id}
          playerAName={playerA.name}
          playerBName={playerB.name}
        />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-ink-700">
          <table className="w-full min-w-[420px] border-collapse">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-900/60 text-xs font-medium uppercase tracking-wider text-white/40">
                <th className="py-3 pl-4 text-left sm:pl-6"></th>
                <th className="py-3 text-center">Games</th>
                <th className="py-3 pr-4 text-center sm:pr-6" colSpan={match.scores.length}>
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              <ScoreRow name={playerA.name} games={tally.a} opponentGames={tally.b}>
                {match.scores.map((game, i) => (
                  <ScoreCell key={i} value={game.a} won={game.a > game.b} />
                ))}
              </ScoreRow>
              <ScoreRow name={playerB.name} games={tally.b} opponentGames={tally.a} last>
                {match.scores.map((game, i) => (
                  <ScoreCell key={i} value={game.b} won={game.b > game.a} />
                ))}
              </ScoreRow>
            </tbody>
          </table>
        </div>
      )}

      <Link
        href="/matches"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-accent-bright"
      >
        <span aria-hidden>←</span> Back to Matches
      </Link>
    </div>
  );
}

function MatchPlayerColumn({
  player,
  align,
}: {
  player: RankedPlayer;
  align: "left" | "right";
}) {
  const isLeft = align === "left";
  const flag = getFlagEmoji(player.country);

  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
      <div className="font-heading text-2xl font-bold text-accent-bright sm:text-3xl">
        #{player.rank}
      </div>
      <div className="mt-2 w-full flex justify-center">
        <PlayerPhoto name={player.name} photo={player.photo} size={140} />
      </div>
      {flag && (
        <div className="mt-3 flex w-full flex-col items-center gap-1">
          <span className="text-2xl leading-none" aria-hidden>
            {flag}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">
            {player.country}
          </span>
        </div>
      )}
      <Link
        href={`/player/${player.id}`}
        className="mt-3 w-full text-center font-heading text-base font-bold uppercase leading-tight text-white hover:text-accent-bright sm:text-lg"
      >
        {player.name}
      </Link>
    </div>
  );
}

function ScoreRow({
  name,
  games,
  opponentGames,
  last = false,
  children,
}: {
  name: string;
  games: number;
  opponentGames: number;
  last?: boolean;
  children: React.ReactNode;
}) {
  const isWinner = games > opponentGames;

  return (
    <tr className={last ? "" : "border-b border-ink-800"}>
      <td className="py-3 pl-4 font-heading font-bold uppercase text-white sm:pl-6">
        {name}
      </td>
      <td
        className={`py-3 text-center font-heading font-bold tabular-nums ${
          isWinner ? "text-2xl text-white" : "text-lg text-white/40"
        }`}
      >
        {games}
      </td>
      {children}
    </tr>
  );
}

function ScoreCell({ value, won }: { value: number; won: boolean }) {
  return (
    <td
      className={`py-3 text-center tabular-nums ${
        won ? "font-bold text-white" : "text-white/40"
      }`}
    >
      {value}
    </td>
  );
}

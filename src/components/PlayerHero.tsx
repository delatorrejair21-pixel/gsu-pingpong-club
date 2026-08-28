import { PlayerPhoto } from "./PlayerPhoto";
import { RankBadge } from "./RankBadge";
import { getFlagEmoji } from "@/lib/data";
import type { RankedPlayer } from "@/lib/types";

interface PlayerHeroProps {
  player: RankedPlayer;
}

export function PlayerHero({ player }: PlayerHeroProps) {
  return (
    <div className="flex flex-col items-center gap-5 border-b border-ink-700 bg-ink-900/60 px-4 py-8 text-center">
      <PlayerPhoto name={player.name} photo={player.photo} />
      <div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/40">
            Rank
          </span>
          <RankBadge rank={player.rank} />
        </div>
        <h1 className="mt-1 flex items-center justify-center gap-2.5 font-heading text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
          {player.country && (
            <span className="text-2xl sm:text-3xl" aria-hidden>
              {getFlagEmoji(player.country)}
            </span>
          )}
          {player.name}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-white/60">
          <span>{player.year}</span>
          {player.playstyle && <span>{player.playstyle}</span>}
          {player.gripStyle && <span>{player.gripStyle}</span>}
        </div>
        {player.note && (
          <p className="mx-auto mt-2 max-w-md text-sm italic text-white/40">
            {player.note}
          </p>
        )}
      </div>
    </div>
  );
}

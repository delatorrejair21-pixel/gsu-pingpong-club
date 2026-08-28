"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayerAvatar } from "./PlayerAvatar";
import { RankBadge } from "./RankBadge";
import { getFlagEmoji } from "@/lib/data";
import type { RankedPlayer } from "@/lib/types";

interface LeaderboardClientProps {
  players: RankedPlayer[];
}

export function LeaderboardClient({ players }: LeaderboardClientProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => p.name.toLowerCase().includes(q));
  }, [players, query]);

  return (
    <div>
      <div className="px-4 pb-4 pt-6 sm:px-6">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full rounded-md border border-ink-600 bg-ink-850 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-16 text-center text-white/50 sm:px-6">
          No players match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-ink-700 text-xs font-medium uppercase tracking-wider text-white/40">
              <th className="w-14 py-3 pl-4 sm:pl-6">Rank</th>
              <th className="py-3">Player</th>
              <th className="hidden py-3 text-right sm:table-cell">Record</th>
              <th className="w-20 py-3 pr-4 text-right sm:pr-6">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => (
              <tr
                key={player.id}
                onClick={() => router.push(`/player/${player.id}`)}
                className="cursor-pointer border-b border-ink-800 transition-colors hover:bg-ink-850 focus-visible:bg-ink-850"
                tabIndex={0}
                role="link"
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/player/${player.id}`);
                }}
              >
                <td className="py-3 pl-4 sm:pl-6">
                  <RankBadge rank={player.rank} />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={player.name}
                      photo={player.photo}
                      size={36}
                      position={player.avatarPosition}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-medium leading-tight text-white">
                        {player.country && (
                          <span aria-hidden>{getFlagEmoji(player.country)}</span>
                        )}
                        {player.name}
                      </div>
                      <div className="text-xs text-white/40 sm:hidden">
                        {player.wins}-{player.losses}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden py-3 text-right tabular-nums text-white/70 sm:table-cell">
                  {player.wins}-{player.losses}
                </td>
                <td className="py-3 pr-4 text-right font-heading font-semibold tabular-nums text-accent-bright sm:pr-6">
                  {player.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

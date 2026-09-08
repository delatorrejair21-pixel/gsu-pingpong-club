interface RankBadgeProps {
  rank: number | null;
  className?: string;
}

const RANK_STYLES: Record<number, string> = {
  1: "text-gold",
  2: "text-silver",
  3: "text-bronze",
};

export function RankBadge({ rank, className = "" }: RankBadgeProps) {
  if (rank === null) {
    return (
      <span
        className={`font-heading text-xs font-bold uppercase tracking-wider text-white/40 ${className}`}
      >
        Unranked
      </span>
    );
  }

  const colorClass = RANK_STYLES[rank] ?? "text-white/70";
  return (
    <span
      className={`inline-flex items-center gap-1 font-heading text-lg font-bold tabular-nums ${colorClass} ${className}`}
    >
      {rank === 1 && (
        <span aria-hidden className="text-base leading-none">
          👑
        </span>
      )}
      {rank}
    </span>
  );
}

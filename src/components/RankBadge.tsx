interface RankBadgeProps {
  rank: number;
  className?: string;
}

const RANK_STYLES: Record<number, string> = {
  1: "text-gold",
  2: "text-silver",
  3: "text-bronze",
};

export function RankBadge({ rank, className = "" }: RankBadgeProps) {
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

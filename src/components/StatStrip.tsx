interface StatStripProps {
  totalPlayers: number;
  totalMatches: number;
}

export function StatStrip({ totalPlayers, totalMatches }: StatStripProps) {
  return (
    <div className="flex gap-6 border-b border-ink-700 bg-ink-900/60 px-4 py-4 sm:px-6">
      <Stat label="Players" value={totalPlayers} />
      <div className="w-px bg-ink-700" />
      <Stat label="Matches Played" value={totalMatches} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-heading text-2xl font-bold tabular-nums text-accent-bright">
        {value}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </div>
    </div>
  );
}

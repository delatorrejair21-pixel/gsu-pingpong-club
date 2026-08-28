interface StatCardProps {
  label: string;
  value: string;
  accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className="flex-1 rounded-lg border border-ink-700 bg-ink-850 px-5 py-4">
      <div
        className={`font-heading text-3xl font-bold tabular-nums ${
          accent ? "text-accent-bright" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </div>
    </div>
  );
}

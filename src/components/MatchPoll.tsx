"use client";

import { useEffect, useState } from "react";

interface MatchPollProps {
  matchId: string;
  playerAName: string;
  playerBName: string;
}

interface VoteState {
  a: number;
  b: number;
  voted: "a" | "b" | null;
}

export function MatchPoll({ matchId, playerAName, playerBName }: MatchPollProps) {
  const [state, setState] = useState<VoteState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/votes/${matchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch(() => {
        if (!cancelled) setState({ a: 0, b: 0, voted: null });
      });
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  async function castVote(pick: "a" | "b") {
    if (submitting || state?.voted) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/votes/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pick }),
      });
      const data = await res.json();
      if (res.ok) setState(data);
    } finally {
      setSubmitting(false);
    }
  }

  if (!state) {
    return (
      <div className="mt-8 rounded-lg border border-ink-700 bg-ink-850 px-6 py-8 text-center text-sm text-white/40">
        Loading poll...
      </div>
    );
  }

  const total = state.a + state.b;
  const pctA = total === 0 ? 0 : Math.round((state.a / total) * 100);
  const pctB = total === 0 ? 0 : 100 - pctA;

  return (
    <div className="mt-8 rounded-lg border border-ink-700 bg-ink-850 px-4 py-6 sm:px-6">
      <div className="text-center font-heading text-sm font-bold uppercase tracking-wider text-white/60">
        Who Wins?
      </div>

      {state.voted ? (
        <div className="mt-4 space-y-3">
          <PollBar label={playerAName} pct={pctA} count={state.a} picked={state.voted === "a"} />
          <PollBar label={playerBName} pct={pctB} count={state.b} picked={state.voted === "b"} />
          <div className="pt-1 text-center text-xs text-white/40">
            {total} {total === 1 ? "vote" : "votes"}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => castVote("a")}
            className="rounded-md border border-ink-600 bg-ink-800 px-3 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
          >
            {playerAName}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => castVote("b")}
            className="rounded-md border border-ink-600 bg-ink-800 px-3 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
          >
            {playerBName}
          </button>
        </div>
      )}
    </div>
  );
}

function PollBar({
  label,
  pct,
  count,
  picked,
}: {
  label: string;
  pct: number;
  count: number;
  picked: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className={`font-medium ${picked ? "text-accent-bright" : "text-white"}`}>
          {label}
          {picked && <span className="ml-1.5 text-xs text-accent-bright">(your pick)</span>}
        </span>
        <span className="font-heading font-bold tabular-nums text-white/70">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-white/40">
        {count} {count === 1 ? "vote" : "votes"}
      </div>
    </div>
  );
}

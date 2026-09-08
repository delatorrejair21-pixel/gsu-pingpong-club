export type PlayerYear =
  | "Freshman"
  | "Sophomore"
  | "Junior"
  | "Senior"
  | "Grad";

export interface Player {
  id: string;
  name: string;
  photo: string;
  rating: number;
  wins: number;
  losses: number;
  year: PlayerYear;
  playstyle?: string;
  gripStyle?: "Shakehand" | "Penhold";
  note?: string;
  avatarPosition?: string;
  country?: string;
  /** Excluded from the ranked leaderboard and listed separately as "Unranked". */
  unranked?: boolean;
}

export interface GameScore {
  a: number;
  b: number;
}

export interface Match {
  id: string;
  date: string;
  playerAId: string;
  playerBId: string;
  scores: GameScore[];
  /**
   * Games won by each side, for a match reported as just a final tally
   * (e.g. "2-1") with no per-game points. Only used when `scores` is empty —
   * if `scores` has entries, the tally is always derived from them instead.
   */
  finalScore?: GameScore;
  event?: string;
}

export interface RankedPlayer extends Player {
  /** null for a player marked `unranked` — excluded from ranking. */
  rank: number | null;
}

export interface Season {
  week: string;
}

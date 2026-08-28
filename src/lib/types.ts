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
  event?: string;
}

export interface RankedPlayer extends Player {
  rank: number;
}

export interface Season {
  week: string;
}

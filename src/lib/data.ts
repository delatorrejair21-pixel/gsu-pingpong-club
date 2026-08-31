import playersData from "../../data/players.json";
import matchesData from "../../data/matches.json";
import seasonData from "../../data/season.json";
import type { Match, Player, RankedPlayer, Season } from "./types";

const players = playersData as Player[];
const matches = matchesData as Match[];
const season = seasonData as Season;

export function getCurrentWeek(): string {
  return season.week;
}

export function getAllPlayers(): Player[] {
  return players;
}

export function getAllMatches(): Match[] {
  return matches;
}

/** Rank is derived by sorting players by rating, descending. */
export function getRankedPlayers(): RankedPlayer[] {
  return [...players]
    .sort((a, b) => b.rating - a.rating)
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

export function getPlayerById(id: string): RankedPlayer | undefined {
  return getRankedPlayers().find((player) => player.id === id);
}

export function getMatchesForPlayer(playerId: string): Match[] {
  return matches
    .filter((m) => m.playerAId === playerId || m.playerBId === playerId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** All matches, most recent first. */
export function getAllMatchesSorted(): Match[] {
  return [...matches].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getMatchById(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

/** True when the match has per-game points recorded (not just a final tally). */
export function hasPerGameScores(match: Match): boolean {
  return match.scores.length > 0;
}

/** Total games won by each side — from per-game scores if present, else the reported final tally. */
export function getMatchGameTally(match: Match): { a: number; b: number } {
  if (hasPerGameScores(match)) {
    let a = 0;
    let b = 0;
    for (const game of match.scores) {
      if (game.a > game.b) a++;
      else b++;
    }
    return { a, b };
  }
  if (match.finalScore) {
    return { a: match.finalScore.a, b: match.finalScore.b };
  }
  return { a: 0, b: 0 };
}

/** A match with no per-game scores and no final tally yet is upcoming/not yet played. */
export function isMatchUpcoming(match: Match): boolean {
  return match.scores.length === 0 && !match.finalScore;
}

export function getPlayedMatches(): Match[] {
  return matches.filter((m) => !isMatchUpcoming(m));
}

export function getOpponentId(match: Match, playerId: string): string {
  return match.playerAId === playerId ? match.playerBId : match.playerAId;
}

/** Games won by counting each game's higher score (or the final tally), oriented to the given player. */
export function getMatchOutcome(
  match: Match,
  playerId: string
): { gamesWon: number; gamesLost: number; result: "W" | "L" | null } {
  if (isMatchUpcoming(match)) {
    return { gamesWon: 0, gamesLost: 0, result: null };
  }

  const isPlayerA = match.playerAId === playerId;
  const tally = getMatchGameTally(match);
  const gamesWon = isPlayerA ? tally.a : tally.b;
  const gamesLost = isPlayerA ? tally.b : tally.a;

  return { gamesWon, gamesLost, result: gamesWon > gamesLost ? "W" : "L" };
}

/** Per-game scores as strings, ordered with the given player's score first. */
export function getGameScoreStrings(match: Match, playerId: string): string[] {
  const isPlayerA = match.playerAId === playerId;
  return match.scores.map((game) => {
    const playerScore = isPlayerA ? game.a : game.b;
    const opponentScore = isPlayerA ? game.b : game.a;
    return `${playerScore}-${opponentScore}`;
  });
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** Converts an ISO 3166-1 alpha-2 country code (e.g. "US") into its flag emoji. */
export function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function formatMatchDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

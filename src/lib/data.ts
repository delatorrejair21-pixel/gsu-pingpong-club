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

export function getOpponentId(match: Match, playerId: string): string {
  return match.playerAId === playerId ? match.playerBId : match.playerAId;
}

/** Games won by counting each game's higher score, oriented to the given player. */
export function getMatchOutcome(
  match: Match,
  playerId: string
): { gamesWon: number; gamesLost: number; result: "W" | "L" } {
  const isPlayerA = match.playerAId === playerId;
  let gamesWon = 0;
  let gamesLost = 0;

  for (const game of match.scores) {
    const playerScore = isPlayerA ? game.a : game.b;
    const opponentScore = isPlayerA ? game.b : game.a;
    if (playerScore > opponentScore) gamesWon++;
    else gamesLost++;
  }

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

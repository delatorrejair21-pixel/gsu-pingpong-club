import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? "",
});

/** Votes expire after 60 days so abandoned polls don't linger forever. */
export const VOTE_TTL_SECONDS = 60 * 60 * 24 * 60;

export function votesKey(matchId: string): string {
  return `votes:${matchId}`;
}

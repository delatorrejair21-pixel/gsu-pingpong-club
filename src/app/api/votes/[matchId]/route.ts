import { NextRequest, NextResponse } from "next/server";
import { getMatchById, isMatchUpcoming } from "@/lib/data";
import { redis, votesKey, VOTE_TTL_SECONDS } from "@/lib/redis";

function cookieName(matchId: string): string {
  return `vote_${matchId}`;
}

interface VoteTallies {
  a: number;
  b: number;
  voted: "a" | "b" | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
): Promise<NextResponse<VoteTallies | { error: string }>> {
  const match = getMatchById(params.matchId);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const counts = await redis.hgetall<{ a?: number; b?: number }>(
    votesKey(params.matchId)
  );
  const voted = request.cookies.get(cookieName(params.matchId))?.value;

  return NextResponse.json({
    a: Number(counts?.a ?? 0),
    b: Number(counts?.b ?? 0),
    voted: voted === "a" || voted === "b" ? voted : null,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
): Promise<NextResponse<VoteTallies | { error: string }>> {
  const match = getMatchById(params.matchId);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }
  if (!isMatchUpcoming(match)) {
    return NextResponse.json(
      { error: "Voting is closed for this match" },
      { status: 400 }
    );
  }

  const existingVote = request.cookies.get(cookieName(params.matchId))?.value;
  const key = votesKey(params.matchId);

  if (existingVote === "a" || existingVote === "b") {
    const counts = await redis.hgetall<{ a?: number; b?: number }>(key);
    return NextResponse.json({
      a: Number(counts?.a ?? 0),
      b: Number(counts?.b ?? 0),
      voted: existingVote,
    });
  }

  const body = await request.json().catch(() => null);
  const pick = body?.pick;
  if (pick !== "a" && pick !== "b") {
    return NextResponse.json({ error: "Invalid pick" }, { status: 400 });
  }

  await redis.hincrby(key, pick, 1);
  await redis.expire(key, VOTE_TTL_SECONDS);
  const counts = await redis.hgetall<{ a?: number; b?: number }>(key);

  const response = NextResponse.json({
    a: Number(counts?.a ?? 0),
    b: Number(counts?.b ?? 0),
    voted: pick,
  });
  response.cookies.set(cookieName(params.matchId), pick, {
    maxAge: VOTE_TTL_SECONDS,
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

# Table Tennis GSU — Rankings

A dark, dense, pro-tour-style rankings site for Table Tennis GSU. Almost
everything reads from hand-maintained JSON files:
[`data/players.json`](data/players.json),
[`data/matches.json`](data/matches.json), and
[`data/season.json`](data/season.json). The one exception is the "Who
Wins?" poll on upcoming matches — those vote counts live in a small Redis
database (see [Match prediction polls](#match-prediction-polls) below),
since votes need to be shared live across every visitor, which a
build-time JSON file can't do.

Rank and the win/loss badge on a match are the only two things the code
computes:

- **Rank** = players sorted by `rating`, descending.
- **Match W/L badge** = count of games each side won in that match's `scores`.

Everything else (a player's overall `wins`/`losses`, `rating`, bio fields) is
whatever you type into the JSON. Nothing is calculated for you — no Elo, no
win percentage, no streaks.

## Running locally

```bash
npm install
vercel env pull .env.local   # gets the Redis credentials (see below)
npm run dev
```

Visit `http://localhost:3004`.

## Adding a player

Open [`data/players.json`](data/players.json) and add an object to the array:

```json
{
  "id": "jane-doe",
  "name": "Jane Doe",
  "photo": "/players/jane-doe.jpg",
  "rating": 1700,
  "wins": 0,
  "losses": 0,
  "year": "Freshman",
  "playstyle": "Attacker",
  "gripStyle": "Shakehand",
  "note": "Optional one-line bio."
}
```

Field notes:

- **`id`** — a unique slug, lowercase with hyphens (e.g. `"jane-doe"`). This is
  used in the player's URL (`/player/jane-doe`) and to reference them from
  matches, so once you record matches against this id, don't change it.
- **`photo`** — path to an image under `public/players/`. Drop the actual
  image file at that path (e.g. `public/players/jane-doe.jpg`). If the file
  doesn't exist yet, the site automatically shows a circle with the player's
  initials instead — it will never show a broken image icon, so it's fine to
  add a player before you have their photo.
- **`rating`** — whatever number you want to represent their skill. This is
  the only field that drives leaderboard rank; higher rating ranks higher.
- **`wins` / `losses`** — the player's overall record. You update these by
  hand whenever you record a new match (see below). This is separate from the
  per-match W/L badge shown in their match history, which the site always
  derives fresh from that match's game scores.
- **`year`** — one of `Freshman`, `Sophomore`, `Junior`, `Senior`, `Grad`.
- **`playstyle`**, **`gripStyle`** (`Shakehand` or `Penhold`), and **`note`**
  are all optional. Leave them out entirely if you don't want them to show on
  the player's profile.
- **`avatarPosition`** — optional. Only affects the small round avatar on the
  leaderboard (the big photo card on a player's own page always shows the
  whole image, uncropped). If a photo gets cropped into an odd spot in that
  small circle — e.g. a tall photo where the face ends up cut off above the
  circle — set this to a CSS `object-position` value to nudge the crop, like
  `"center 15%"` to shift the visible window up toward the top of the photo
  (biggest effect is on tall/portrait photos; square ones rarely need this).
- **`country`** — optional. A two-letter country code (e.g. `"US"`, `"CA"`,
  `"IN"`, `"NG"`, `"VN"`) shown as a flag next to the player's name on both
  the leaderboard and their profile. Omit it and no flag shows. It's rendered
  as an emoji from the code, so there's no image file to upload for this one.

## Recording a match

Open [`data/matches.json`](data/matches.json) and add an object to the array:

```json
{
  "id": "m001",
  "date": "2026-09-02",
  "playerAId": "clarke-ellis",
  "playerBId": "sidh-jain",
  "scores": [
    { "a": 11, "b": 7 },
    { "a": 9, "b": 11 },
    { "a": 11, "b": 6 }
  ],
  "event": "Fall Ladder Week 6"
}
```

Field notes:

- **`id`** — any unique string. Following the existing pattern (`m001`,
  `m002`, ...) keeps things tidy but isn't required.
- **`date`** — ISO format, `YYYY-MM-DD`.
- **`playerAId`** / **`playerBId`** — must match an `id` in `players.json`.
  It doesn't matter who is "A" and who is "B" — each player's own profile
  page always shows their own score first, opponent second, regardless of
  which side they were in the JSON.
- **`scores`** — one object per game played, in order, as `{ "a": <player A's
  points>, "b": <player B's points> }`. The site counts how many games each
  side won to decide the match winner and show the W/L badge — you don't need
  to record who "won the match," just the game-by-game score.
  **Leave this an empty array (`"scores": []`) to schedule an upcoming match**
  before it's been played — the site shows it as "Upcoming" everywhere
  instead of a score, with no W/L badge, until you come back and fill in
  the actual game scores once it's played.
- **`event`** — optional label shown next to the match (e.g. `"Fall Ladder
  Week 6"`, `"Friendly"`). Omit it if the match doesn't belong to a named
  event.

After adding a match, remember to bump the two players' `wins`/`losses`
fields in `players.json` by hand if you want their overall record to reflect
it — the site does not do this automatically.

### Recording just a final score (no per-game points)

Most matches will probably only get reported as a final tally like "2-1,"
not game-by-game. For those, leave `"scores": []` and add a `finalScore`
instead:

```json
{
  "id": "m020",
  "date": "2026-09-02",
  "playerAId": "clarke-ellis",
  "playerBId": "sidh-jain",
  "scores": [],
  "finalScore": { "a": 2, "b": 1 },
  "event": "Fall Ladder Week 6"
}
```

`finalScore.a` / `finalScore.b` are games won by player A / player B. The
site treats this exactly like a played match everywhere (records, "Matches
Played" count, W/L badges) — the only difference is the match's own page
shows a plain "FINAL 2-1" instead of a per-game score table, since there's
no game-by-game detail to show. If you ever do have the per-game scores,
use `scores` instead (as in the example above it) and skip `finalScore`
entirely — `scores` always takes priority when both are present.

Every match also gets its own page at `/matches/<id>` — a head-to-head
scoreboard with both players' photos, rank, and a per-game score table
(the winning score in each game shown bold). It's linked from the Matches
tab (lists every match, most recent first) and from each score in a
player's match history. Nothing extra to configure — it's generated from
the same `matches.json` entry.

## Updating the current week

Open [`data/season.json`](data/season.json) and edit the `week` field:

```json
{
  "week": "Week 2"
}
```

That text shows as a small badge in the header on every page. It's just a
label you update by hand each week — the site doesn't infer it from dates or
match data.

## Adding player photos

Drop image files into `public/players/`, named to match the `photo` path in
`players.json` (e.g. `public/players/jane-doe.jpg`). Any player without a
matching file just shows an initials circle, so you can add photos whenever
they become available.

## Match prediction polls

Every upcoming match (one with `"scores": []`) shows a "Who Wins?" poll on
its `/matches/<id>` page — visitors vote for one side and immediately see
the live percentage split. There's nothing to configure per-match; it just
works for any match that hasn't been played yet, and disappears on its own
once you fill in the real `scores` (replaced by the actual score table).

This is the one part of the site backed by a real database instead of a
JSON file — an [Upstash for Redis](https://vercel.com/marketplace/upstash/upstash-kv)
database on the free plan, installed via the Vercel Marketplace and
connected to this project. It stores one vote tally per match (auto-expiring
after 60 days so old polls don't linger), and a browser can only vote once
per match (enforced with a cookie, checked server-side too). The API lives
at `src/app/api/votes/[matchId]/route.ts`; the Redis client config is in
`src/lib/redis.ts`. To develop locally against the real database, run
`vercel env pull .env.local` once (requires being logged into the Vercel
CLI as a project member) to get the `KV_REST_API_URL` /
`KV_REST_API_TOKEN` credentials.

## Deploying

This is a stock Next.js 14 App Router project — push it to a GitHub repo and
import it on [Vercel](https://vercel.com/new) with zero configuration
(aside from the Redis env vars above, which stay attached to the Vercel
project automatically once set up — nothing to redo on future deploys).

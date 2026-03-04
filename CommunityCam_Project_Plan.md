# CommunityCam — Project Plan
`mulletvibes.github.io/community-cam`

---

## Project Overview

CommunityCam is a community-powered live webcam experience. A full-screen live camera feed from around the world is displayed, while a persistent overlay hosts a binary vote that runs every 10 minutes. The community types their answer in chat and the winning side determines the next camera. All visitors share one global state: one camera, one vote round, one result.

---

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — hosted on GitHub Pages
- **Database & realtime:** Supabase (shared vote state, active camera, round timer, chat)
- **Camera source:** Manually curated YouTube live stream embeds
- **Weather data:** Open-Meteo API (free, no API key required)
- **Radio streams:** radio-browser.info API (free, no API key required)
- **News:** NewsAPI or GNews (free tier, searchable by country)
- **Reddit:** Reddit API (free tier, city subreddits)

---

## Core Experience

The site displays a single full-screen live YouTube webcam feed. A persistent overlay (always visible, even with chat hidden) contains:

| Overlay Element | Description |
|---|---|
| **The prompt** | A binary choice, e.g. "Beach 🌊 or City 🏙️?" |
| **Live vote tally** | Real-time count for each side, e.g. "Beach 47 — City 23" |
| **Countdown timer** | 10 minutes counting down to the next camera switch |

A location/weather overlay sits bottom-left, showing the current camera's location name, local time, temperature, and weather condition. It slides up on each camera switch.

A collapsible chat panel sits on the right (on by default). Viewers vote by typing their answer in chat. At round end, majority wins and the camera switches to match. A new prompt begins immediately.

> ℹ️ Round duration: 10 minutes. Simple majority always wins. Tiebreaker triggers a special camera (see Phase 6).

---

## Completed Phases

### ✅ Phase 1 — Static Site
Geocities/Web 1.0 aesthetic. Full-screen YouTube iframe. Persistent vote overlay (top-center). Collapsible chat panel. 19 curated cameras in cameras.js with tags, lat/long, and timezone.

### ✅ Phase 2 — Shared State & Live Voting
Supabase backend. All visitors share one camera and one vote round. Chat messages persist in Supabase and sync across all tabs in realtime. Votes write to Supabase and update the overlay live. Round transition uses a conditional RPC to prevent race conditions. Guest usernames with random 4-digit suffix, persisted in localStorage.

### ✅ Phase 3 — Weather & Location Overlay
Open-Meteo API called on each camera switch. Bottom-left overlay shows location name, local time (from camera timezone), temperature, and weather emoji. Slides up on camera switch.

---

## Upcoming Phases

### Phase 4 — Dead Feed Safeguard & Round Duration
**Goal:** Handle offline/unavailable YouTube streams gracefully, and update round duration to 10 minutes.

- Update `ROUND_DURATION_MS` to 10 minutes in app.js
- On camera load, start a timeout — if the YouTube iframe returns an error or fails to load within ~15 seconds, automatically switch to a different random camera from the same tag pool
- Add an `onerror` / postMessage listener on the iframe where possible to detect dead feeds faster
- Show a brief "Switching feed..." message in the overlay if a dead feed is detected

> ⚠️ YouTube iframes don't expose load success/failure easily — Claude Code should research the most reliable detection method before implementing.

---

### Phase 5 — Next Vote Panel & Category Lobbying
**Goal:** Add a collapsible "Next Vote" panel (top-left, mirroring the chat toggle) where viewers can lobby for what the next binary face-off will be.

- Add a "NEXT VOTE" toggle button top-left
- Panel opens to show: "Influence the next vote — type a category in chat"
- Display a list of all available categories with live vote tallies updating in realtime
- At the end of the current round, the top 2 categories become the next binary prompt
- If nobody votes on next categories, fall back to the default prompt sequence
- Chat automatically announces lobbying votes: "Guest4821 just voted for 🌋 Volcano!"
- Expand the categories list significantly — see Category Expansion below

**New Supabase table needed (run manually before starting):**
```sql
CREATE TABLE next_vote_lobbying (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  category TEXT,
  round_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER PUBLICATION supabase_realtime ADD TABLE next_vote_lobbying;
CREATE POLICY "Allow anon read" ON next_vote_lobbying FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON next_vote_lobbying FOR INSERT WITH CHECK (true);
ALTER TABLE next_vote_lobbying ENABLE ROW LEVEL SECURITY;
```

---

### Phase 6 — Tiebreaker Hamster Cam
**Goal:** When a round ends in a tie, trigger a special tiebreaker moment before the next round.

- Add a dedicated tiebreaker camera to cameras.js tagged `tiebreaker: true` — a 24/7 live stream of something absurd (hamster, fish tank, etc.)
- On tie detection, display a full-screen animated overlay: "TIE! 🐹 HAMSTER TIME!" in maximum Geocities style
- Switch to the tiebreaker camera for 60 seconds, then run a new round with a randomly selected prompt
- Tiebreaker camera never appears in normal rotation
- Add a sound effect for the tiebreaker moment (see Phase 9 — Audio)

---

### Phase 7 — Optional Username Editing
**Goal:** Let users personalise their Guest username without disrupting the UI.

- Make the username label in the chat panel clickable
- On click, inline text input appears pre-filled with current username
- On confirm (Enter or tick), saves new username to localStorage as `cc_username`
- Updates immediately in the chat UI
- No modal, no page reload — inline edit only

---

### Phase 8 — News Ticker
**Goal:** Add a broadcast-style scrolling ticker across the bottom of the screen.

- Ticker sits above the bottom edge, below the location overlay, overlaying the video
- Cycles through a mix of content sources, refreshed on each camera switch:
  - Local news headlines for the current camera's country (NewsAPI or GNews free tier)
  - Top post title from the city's subreddit (Reddit API, falls back to country subreddit)
  - ISS current location ("🛸 ISS currently passing over: Paraguay")
  - "On this day in history" fact (Wikipedia API or hardcoded)
  - CommunityCam community stats ("🗳 1,204 votes cast today · Current round: Beach vs City")
  - Extended weather details for current camera (wind speed, humidity, UV index)
- Falls back gracefully if any API is unavailable
- Pausable on hover

> ℹ️ NewsAPI free tier requires a key (free to register). Reddit API requires a client ID (free). ISS and Wikipedia are fully open.

---

### Phase 9 — Regional Audio
**Goal:** Play ambient regional radio from the same country as the current camera, toggled off by default.

- Add a mute/unmute audio toggle button to the UI (off by default)
- On camera switch, fetch a live radio stream from the current camera's country using the radio-browser.info API (free, no key required)
- Play the stream in a hidden `<audio>` element at low volume underneath the muted YouTube iframe
- Volume control slider in the UI
- Falls back to a generic world music stream if no regional station is found
- Audio state (on/off, volume) persisted in localStorage

---

### Phase 10 — YouTube Chat Watermark
**Goal:** Post automated messages to the YouTube live chat of the currently playing stream, driving traffic back to CommunityCam.

- When a viewer votes or chats, post a message to the YouTube live chat: "💬 [username] voted from CommunityCam — watch & vote at [URL]"
- Requires YouTube Data API v3 with OAuth (free but requires a Google Cloud project)
- Rate-limit posts to avoid spamming (max 1 per minute per stream)
- Falls back silently if the stream doesn't allow chat or API fails

> ⚠️ Requires Google OAuth setup. Keep Claude Code sessions short for this phase.

---

### Phase 11 — Twitch Streamer Mode
**Goal:** Allow Twitch streamers to embed CommunityCam as a browser source with their Twitch chat feeding votes into the shared Supabase state.

- Add `?channel=CHANNELNAME` URL parameter
- When channel param is present, connect to that Twitch channel's chat via Twitch IRC/EventSub API
- Parse chat messages for vote keywords using the same logic as the site chat
- Twitch votes feed into the same Supabase `round_state` as site votes
- Hide on-screen chat panel when channel param is present
- Create a simple 'Streamer Setup' page with OBS browser source instructions

> ⚠️ Requires registering a Twitch developer app and handling OAuth. Most complex phase — keep sessions short and focused.

---

## Category Expansion (for Phase 5)

Current categories are limited to the 9 prompts in app.js. For the Next Vote panel, expand to include:

**Vibe:** Beach, City, Nature, Mountain, Desert, Jungle, Arctic, Volcano, Harbour, Village, Rooftop, Underground

**Time/Light:** Sunrise, Sunset, Golden Hour, Night, Foggy, Stormy

**Region:** Americas, Europe, Asia, Africa

**Weather:** Sunny, Rainy, Snowy, Cloudy, Windy

**Wildcard:** Airport, Space, Snow Cam, Hamster (tiebreaker only)

> ⚠️ New categories require new cameras to be added to cameras.js before they can be selected. If a winning category has no matching cameras, fall back to the full pool.

---

## Camera List (Current — 19 cameras)

All cameras are YouTube live streams. See cameras.js for full embed IDs, lat/long, and tags.

| Camera | Location | Tags |
|---|---|---|
| Sydney Harbour | Australia | city, asia |
| Crystal Bay Yacht Club | Koh Samui, Thailand | beach, asia |
| Pacific Bay Restaurant | Mallorca, Spain | beach, europe |
| Hvar Harbour | Croatia | beach, europe |
| Ramsgate Royal Harbour | Kent, UK | city, europe |
| Forest | Northern Denmark | nature, europe |
| Tokyo Shinjuku | Japan | city, asia |
| Dorset Coast | UK | nature, europe |
| Princess Juliana Airport | Sint Maarten | beach, americas |
| Fuego Volcano | Guatemala | nature, americas |
| New York City | USA | city, americas |
| Houston | Texas, USA | city, americas |
| Las Vegas Airport | Nevada, USA | city, americas |
| Santa Claus Village | Rovaniemi, Finland | nature, europe, snowy |
| St. Petersburg | Russia | city, europe |
| LAX Airport | Los Angeles, USA | city, americas |
| St Ann | Jamaica | beach, americas |
| Wales Coast | UK | nature, europe |
| Namib Desert | Namibia | nature, africa |

---

## Stretch Goals

- Time-of-day aware prompts (e.g. "Night owl or Early bird?" only runs after 9pm)
- Community camera nominations via a form (stored in Supabase for review)
- Camera history log — last 5 cameras shown in the overlay
- Custom domain: communitycam.live or similar
- Streamer leaderboard — Twitch channels with most votes contributed

---

## Claude Code Reminders

- Ask Claude Code clarifying questions before each phase
- Break complex phases into smaller steps to avoid timeouts
- Enable auto-accept edits at the start of each session
- Push to GitHub from the terminal tab, not through Claude Code
- Run SQL for new Supabase tables manually in the SQL Editor before Claude Code uses them
- Test with one browser tab to the live GitHub Pages URL — not the local file
- Start a fresh Claude Code session when context gets low
- Usage limits reset at 6pm and 12am London time

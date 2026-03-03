# CommunityCam — Project Plan
`mulletvibes.github.io/communitycam`

---

## Project Overview

CommunityCam is a community-powered live webcam experience. A full-screen live camera feed from around the world is displayed, while a persistent overlay hosts a binary vote that runs every 30 minutes. The community types their answer in chat — on the site or via an embedded Twitch stream — and the winning side determines the next camera. All visitors share one global state: one camera, one vote round, one result.

---

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — hosted on GitHub Pages
- **Database & realtime:** Supabase (shared vote state, active camera, round timer)
- **Camera source:** Manually curated EarthCam embed iframes (~20 cameras to start)
- **Weather data:** Open-Meteo API (free, no API key required)
- **Twitch integration:** Twitch Chat/EventSub API (Phase 4)

---

## Core Experience

The site displays a single full-screen live webcam feed. A persistent overlay (always visible, even with chat hidden) contains three elements:

| Overlay Element | Description |
|---|---|
| **The prompt** | A binary choice, e.g. "Beach 🌊 or City 🏙️?" |
| **Live vote tally** | Real-time count for each side, e.g. "Beach 47 — City 23" |
| **Countdown timer** | 30 minutes counting down to the next camera switch |

A collapsible chat panel sits on the right (on by default). Viewers vote by typing their answer — "beach" or "city" — in chat. At the end of 30 minutes, whichever side has the most cumulative votes wins, and the camera switches to a camera matching that category. Whether the margin is 1000 vs 10 or 6 vs 5, majority wins.

A new prompt then appears and the next 30 minute round begins.

> ℹ️ No vote thresholds, no meters to fill, no minimum vote counts. Simple majority at the end of the round always wins.

---

## Voting Prompts

Prompts are binary choices that map to camera tags. They should feel opinionated and fun — the goal is to encourage people to pick a side and feel something about it.

Examples:
- "Beach 🌊 or Mountain ⛰️?"
- "City 🏙️ or Nature 🌲?"
- "Night 🌙 or Golden Hour 🌅?"
- "Americas 🌎 or Europe 🌍?"
- "Africa 🌍 or Asia 🌏?"
- "Sun ☀️ or Rain 🌧️?"
- "Busy or Quiet?"
- "Hot or Cold?"

Each option maps directly to a camera tag, so the winning answer determines the pool the next camera is drawn from. If no cameras match, fall back to a random camera from the full list.

Prompts rotate in a curated sequence (not purely random) — the order can be designed to feel like good editorial flow, and can eventually factor in time of day.

---

## Build Phases

### Phase 1 — Static Site with Camera List
**Goal:** Working site on GitHub Pages with a curated camera list and a manual switch button. No backend yet.

- Create GitHub repo: `communitycam`
- Build `index.html` — full-screen iframe layout
- Create `cameras.js` — hardcoded array of ~20 EarthCam embed objects, each tagged with: name, location, lat/long, and category tags (beach, city, nature, mountain, day, night, goldenhour, americas, europe, asia, sunny, rainy, snowy)
- Build the persistent overlay: prompt placeholder, vote tally placeholder, countdown placeholder
- Add a manual 'Switch Camera' button for testing
- Style with CSS: dark UI, minimal chrome, fullscreen feel
- Deploy to GitHub Pages and verify EarthCam embeds load correctly

> ⚠️ Test each EarthCam embed URL manually before Phase 2 — some cameras may block iframe embedding.

---

### Phase 2 — Shared State & Live Voting with Supabase
**Goal:** All visitors see the same camera and the same live vote tally. 30 minute rounds run in realtime.

- Create Supabase project
- Create tables in Supabase SQL Editor (run manually before starting Claude Code):
  - `round_state`: current_camera_id, prompt, option_a, option_b, votes_a, votes_b, round_ends_at
  - `votes`: id, session_id, choice, timestamp
- Connect frontend to Supabase JS client
- Chat input reads typed messages and detects votes (e.g. message contains "beach")
- Votes increment the relevant side in `round_state` in realtime
- Overlay updates live via Supabase realtime subscriptions: tally and countdown always current
- At round end (when `round_ends_at` is reached), winning side is determined, camera switches to a random camera matching the winning tag, new round begins with next prompt
- Remove manual switch button

> ⚠️ Run all SQL table creation manually in the Supabase SQL Editor before starting Claude Code on this phase.

---

### Phase 3 — Info Overlays (Weather & Local Time)
**Goal:** Add contextual information to the overlay so viewers know where they're looking.

- Store lat/long coordinates for each camera in `cameras.js`
- On camera switch, call Open-Meteo API with camera coordinates to fetch current weather
- Add to overlay: location name, local time (derived from coordinates/timezone), weather condition + icon
- Animate overlay elements in on camera switch

> ℹ️ Open-Meteo is free and requires no API key. Use coordinates to derive timezone for local time display.

---

### Phase 4 — Streamer Mode & Twitch Chat Integration
**Goal:** Allow Twitch streamers to embed CommunityCam as a browser source, with their Twitch chat feeding votes into the shared Supabase state.

- Add `?channel=CHANNELNAME` URL parameter
- When channel param is present, connect to that Twitch channel's chat via Twitch IRC/EventSub API
- Parse chat messages for vote keywords using the same logic as the site chat
- Twitch votes feed into the same Supabase `round_state` as site votes
- Hide the on-screen chat panel when channel param is present (streamer uses their own Twitch chat)
- Create a simple 'Streamer Setup' page: add this URL as a browser source in OBS, enter your channel name

> ⚠️ Twitch chat integration requires registering a Twitch app and handling OAuth. Most complex phase — keep Claude Code sessions short and focused.

---

## Camera Curation (Do Before Phase 1)

For each camera record: embed URL, location name, lat/long, and category tags.

Aim for good geographic and category spread. Suggested starting cameras:

- Times Square, New York (city, americas)
- Eiffel Tower, Paris (city, europe)
- Venice canals, Italy (city, europe)
- Waikiki Beach, Hawaii (beach, americas)
- Sydney Harbour, Australia (city, asia)
- Niagara Falls, Canada (nature, americas)
- Mount Fuji, Japan (mountain, asia)
- Copacabana Beach, Brazil (beach, americas)
- Scottish Highlands (nature, europe)
- Las Vegas Strip (city, americas)
- Santorini, Greece (beach, europe)
- Shibuya Crossing, Tokyo (city, asia)
- Amalfi Coast, Italy (nature, europe)
- Bondi Beach, Sydney (beach, asia)
- Grand Canyon, Arizona (nature, americas)

---

## Stretch Goals

- Time-of-day aware prompts (e.g. "Night owl or Early bird?" only runs after 9pm)
- Community camera nominations via a form (stored in Supabase for review)
- Camera history log — last 5 cameras shown in the overlay
- Streamer leaderboard — which Twitch channels have contributed the most votes
- Custom domain: communitycam.live or similar
- Prompt scheduling — curate a sequence with intentional editorial flow

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

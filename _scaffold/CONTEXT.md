# CONTEXT.md — The Alchemist's Apprentice: Factor Fusion
> Read this file in full before writing any code. Do not modify any section
> marked **[STABLE]**. Confirm your understanding of the current state before
> proposing changes.

---

## 1. PROJECT IDENTITY

| Field            | Value                                             |
|------------------|---------------------------------------------------|
| Game Title       | Mr. Favors' Alchemist's Apprentice: Factor Fusion |
| NYS Standard     | Algebra 1 — A-APR.1                               |
| Mechanic         | AC/X-Method factoring of quadratic trinomials     |
| Delivery Target  | Single-file HTML → iframe embed in Google Sites   |
| Framework        | Vanilla JS only — zero dependencies, zero bundlers|
| Storage          | localStorage (`alchemistSession` key)             |
| PII Policy       | NONE stored. Fully anonymous. FERPA-safe.         |

---

## 2. STACK & HARD CONSTRAINTS

- **Single-file HTML** — all CSS and JS inline. No external scripts except
  Google Fonts (CDN, no student data).
- **No React, Vue, bundlers, or npm** — teacher must be able to open the
  file directly in a browser.
- **No backend, no login, no accounts** — localStorage only.
- **No tracking pixels, analytics, or third-party APIs** during gameplay.
- **Vanilla Web Audio API** for sound — no audio file dependencies.
- Fonts: Cinzel (display) + Inter (body) via Google Fonts.
- Must embed cleanly inside a Google Sites iframe.

---

## 3. ARCHITECTURE OVERVIEW [STABLE]

### Module Map

```
┌─────────────────────────────────────────────────────────┐
│  Storage Module   — localStorage R/W, CSV export        │
│  Sheets Module    — POST to Apps Script on level complete│
│  Audio Module     — Web Audio API, oscillator music loop│
│  Puzzle Engine    — generatePuzzle, generateTileBank,   │
│                     checkAnswer, findFactors             │
│  Game FSM         — IDLE → SELECTED_ONE →               │
│                     SELECTED_TWO → LOCKED               │
│  UI Module        — screen management, render, cosmetics│
└─────────────────────────────────────────────────────────┘
```

### Screen Flow

```
startScreen → gameScreen → statsScreen → startScreen
                        → bossCompleteScreen → startScreen
startScreen → shopScreen → startScreen
startScreen → achievementsScreen → startScreen
startScreen → summaryScreen (teacher view) → startScreen
```

### localStorage Schema

Key: `alchemistSession`

```js
{
  sessionId:        "anon_<timestamp>",   // NO user identifier
  level:            1,
  streak:           0,
  coins:            0,
  stats: {
    "1": { attempts, correct, wrong, hintsUsed, totalTime },
    "2": { ... }, "3": { ... }, "4": { ... },
    "5": { ... }, "boss": { ... }
  },
  unlockedCosmetics: ["bottle_default", "bg_default"],
  achievements:      [],
  soundMuted:        false,
  musicMuted:        false,
  createdAt:         <timestamp>,
  lastPlayed:        <timestamp>,
  hintsRemaining:    { "1":3, "2":3, "3":3, "4":3, "5":3, "boss":3 },
  dailyCoins:        0,
  dailyCoinsDate:    "<locale date string>",
  tutorialSeen:      false,
  levelsCompleted:   [],
  fontSize:          16
}
```

---

## 4. LEVEL CONFIGURATION [STABLE]

| Level | Name              | a range | b range   | c range  | Bank | Range     | Attempts | Hints | Puzzles  | Special              |
|-------|-------------------|---------|-----------|----------|------|-----------|----------|-------|----------|----------------------|
| 1     | Sandbox           | 1       | 3–10      | 2–6      | 4    | 1–6       | 5        | 3     | 5        | Intro, no negatives  |
| 2     | Negatives         | 1       | -9–9      | 2–12     | 6    | -9–9      | 4        | 3     | 5        | Negative factors     |
| 3     | Working Backwards | 1       | -15–15    | 2–20     | 6    | -15–15    | 3        | 3     | 5        | `givenFactor: true`  |
| 4     | Factor Frenzy     | 1–3     | -15–15    | 2–20     | 8    | -15–15    | 3        | 2     | Infinite | 60s timer            |
| 5     | Boss Stage        | 2–5     | -20–20    | 3–20     | 10   | -20–20    | 2        | 2     | 1        | Full AC extraction   |
| boss  | Regents Boss      | 2–5     | -20–20    | 3–20     | 10   | -20–20    | 2        | 2     | 1        | Regents style        |

**Level unlock chain:** 1 → 2 → 3 → 4 → 5 → boss (each requires prior completion)

---

## 5. GAME MECHANICS [STABLE]

### Answer Results
- `CORRECT` — exact product AND sum match
- `PARTIAL_SIGN_ERROR` — product correct, but sum would match if both signs flipped
- `INCORRECT` — neither condition met

### Coin Economy
- Base correct answer: **5 coins**
- On Fire (streak ≥ 10): **2× multiplier**
- First attempt + solved in ≤ 8s: **+3 bonus coins**
- **Daily cap: 100 coins per calendar day**
- Shop items: bottles 50 coins, backgrounds 75 coins

### Streak & Fire Mode
- Streak increments on CORRECT, resets on wrong/partial
- Fire mode activates at streak ≥ 10 (music tempo doubles, tiles glow orange)

### Hint System
- 3 per level (2 for levels 4–5)
- Hint step 0: factor pair explanation + target product/sum
- Hint step 1: sign guidance (both positive / both negative / opposite signs)
- Hint step 2: reveals one of the two factors

### Auto-Advance
- After `attemptsAllowed` wrong answers on one puzzle: reveals answer, advances after 1.8s
- After correct completion: advances after 3s

---

## 6. ACHIEVEMENTS [STABLE]

| ID               | Icon | Trigger                              |
|------------------|------|--------------------------------------|
| first_correct    | ✨   | First correct answer                 |
| speed_demon      | ⚡   | Correct in ≤ 5 seconds               |
| flawless_1–5     | 🎯   | 100% accuracy (0 wrong) on that level|
| on_fire          | 🔥   | Streak reaches 10                    |
| master_alchemist | 🏆   | Levels 1–5 all completed             |
| boss_slayer      | 👑   | Regents Boss defeated                |
| flawless_boss    | 💎   | 0 wrong on Regents Boss              |

---

## 7. COSMETICS [STABLE]

**Bottle Colors**
| ID             | Name          | Hex     | Price |
|----------------|---------------|---------|-------|
| bottle_default | Pink Potion   | #E0A5D1 | 0     |
| bottle_teal    | Teal Essence  | #2D8B8B | 50    |
| bottle_gold    | Golden Brew   | #C9915D | 50    |
| bottle_navy    | Navy Ink      | #1A2E4A | 50    |
| bottle_green   | Verdant Potion| #5CBE5C | 50    |

**Backgrounds**
| ID          | Name                 | Price |
|-------------|----------------------|-------|
| bg_default  | Alchemist's Counter  | 0     |
| bg_night    | Night Lab            | 75    |
| bg_crystal  | Crystal Cave         | 75    |

---

## 8. CURRENT STATUS

| Component             | Status     | Notes                                          |
|-----------------------|------------|------------------------------------------------|
| Level 1 — Sandbox     | ✅ STABLE  | Positive factors, intro flow                   |
| Level 2 — Negatives   | ✅ STABLE  | Negative distractors, sign-flip detection      |
| Level 3 — Backwards   | ✅ STABLE  | givenFactor slot lock, single-tile selection   |
| Level 4 — Frenzy      | ✅ STABLE  | Timer, tab-visibility pause/resume             |
| Level 5 — Boss        | ✅ STABLE  | Full AC extraction, boss expression display    |
| Regents Boss          | ✅ STABLE  | Same as L5, CSV auto-download on completion    |
| Storage module        | ✅ STABLE  | Migration logic, daily coin cap, CSV export    |
| Audio module          | ✅ STABLE  | Oscillator music, fire tempo, tab mute         |
| Puzzle Engine         | ✅ STABLE  | FIXED 2026-03-28 — factor-first generation; p=q freeze guard added |
| Shop                  | ✅ STABLE  | Coin-gated unlock, cosmetics apply via CSS var |
| Achievements          | ✅ STABLE  | 11 achievements, popup notification            |
| Teacher Summary       | ✅ STABLE  | Per-level stats table + CSV download           |
| Accessibility         | ✅ STABLE  | ARIA roles, focus trap, sr-only announce, KB   |
| Tutorial              | ✅ STABLE  | 3-step modal, shown once on first Level 1 play |
| SVG Start Screen BG   | ✅ STABLE  | 224-line inline SVG potion shop scene (brick wall, arch window, cabinets, bottles, lanterns) |
| SVG Game Screen BG    | ✅ STABLE  | 142-line inline SVG dungeon hall scene (stone arch, columns, torches, pedestal, fog) |
| Title Readability     | ✅ STABLE  | `.start-title` dark card (rgba bg + border-radius); `filter:drop-shadow` on h1 gradient text |
| BG_STYLES gradients   | ✅ STABLE  | All 3 keys (bg_default, bg_night, bg_crystal) upgraded to multi-layer gradients 2026-03-28 |
| Ambient Orbs          | ✅ STABLE  | .orb-1/.orb-2/.orb-3 recolored to match dungeon palette (deep violet, warm amber, cool blue) |
| Sheets integration    | ✅ ADDED 2026-03-29  | Fires on level complete, fire-and-forget, anonymous payload only (sessionId, level label, aggregate stats) |
| Level 4 unlock bug    | ✅ FIXED 2026-03-29  | Timer expiry now calls Storage.completeLevel + _checkFlawless before showing stats; Level 5 unlocks correctly |
| Tile rendering        | ✅ UPDATED 2026-03-29 | SVG potion bottles replace flat gradient tiles; color per bank index, gold on select, orange on fire, sparkle stars |

**Known Issues:**
- **2026-03-28** — `bg_night` and `bg_crystal` shop cosmetics are visually overridden by the `#gameScreen` SVG background. The SVG is an absolutely-positioned child (`z-index:0`) which renders above the div's CSS `background` property where `applyCosmetics()` writes the gradient. Cosmetics are still unlockable/purchasable but have no visible effect while the dungeon SVG is present.
- **2026-03-29** — Tab-visibility resume timer (the `setInterval` re-created inside the `visibilitychange` handler) does **not** call `Storage.completeLevel()` or `Game._checkFlawless()` when the timer expires. If a student hides the tab for the full 60 seconds and the timer fires in the background, Level 5 stays locked and Flawless L4 is not awarded. The primary timer in `startLevel()` is correctly patched; only the resume path is affected.
- **2026-03-29** — SVG clipPath IDs in tile buttons use the scheme `btl{colorIndex}` (e.g. `btl0`–`btl9`). IDs are safe because `bank.innerHTML = ''` removes all prior tile SVGs before re-rendering. If tile rendering is ever made incremental (append-only), ID collisions would need revisiting.

---

## 9. DO NOT TOUCH

- The `checkAnswer()` logic — sign-flip partial credit is intentional
- The `generateTileBank()` guarantee that correct factors always appear
- The `Storage.addCoins()` daily cap (100/day) — anti-gaming measure
- The `alchemistSession` localStorage key name — changing it wipes all user progress
- Focus trap (`trapFocus` / `releaseFocus`) — required for accessibility compliance
- `[hidden]` `!important` overrides in CSS — required because author styles
  override the UA `[hidden]` rule
- `generatePuzzle()` factor-first logic — p and q are picked first; the trinomial
  (a, b, c) is derived from them. Never invert this back to pick-then-search.
- The inline SVG in `#startScreen` (first child, ~224 lines) — potion shop scene.
  Edit element geometry/colors only; do not change `position`, `inset`, `z-index`,
  `pointer-events`, `preserveAspectRatio`, or `viewBox` attributes.
- The inline SVG in `#gameScreen` (first child, ~142 lines) — dungeon hall scene.
  Same constraint as above.
- `.start-title` dark card — `background: rgba(5,2,18,.78)` + `border-radius: 12px`.
  Do not remove or make fully transparent; it is the sole readability layer for the
  title text over the SVG background.
- `filter: drop-shadow` on `.start-title h1` — required because `-webkit-text-fill-color:
  transparent` (gradient clip text) causes `text-shadow` to have no visual effect.
- `TILE_COLORS` array — 8-entry palette used to assign bottle colors by `colorIndex % 8`.
  Do not reorder entries; existing students' visual tile colors would shift between sessions
  (not a data bug, but visually jarring during an active class period).
- `buildPotionSVG()` — the `.liquid-fill` and `.liquid-surface` class names on the SVG
  ellipses are required. `updateSelectedSlots()` and the on-fire block in `renderPuzzle()`
  query them by class to update `fill` attributes at runtime.
- `Sheets.URL` — the Google Apps Script exec URL. Do not log it, expose it in UI, or store
  it in localStorage. It is intentionally inlined only in the Sheets module constant.
- `Sheets._dispatch()` uses `mode: 'no-cors'` — this is required for cross-origin requests
  to Apps Script exec endpoints. The response body is opaque (unreadable) by design; do not
  change the mode or add response handling.
- Level 4 timer completion order (inside `startLevel()` setInterval):
  `completeLevel → _checkFlawless → Sheets.send → _lockUI → showStatsScreen`.
  Must stay in this order: flawless check reads `levelWrongTotal` before UI resets it.

---

## 10. KNOWN EFFECTIVE PROMPT PATTERNS

```
# Session opener (paste at every Claude Code session start)
Read CONTEXT.md fully. Do not modify any [STABLE] section.
My constraint is single-file HTML with vanilla JS and zero npm.
State the current status of the relevant level/module before
proposing any code.

# Feature request
I want to add [X]. Before writing any code:
1. Identify which modules/functions this touches
2. List any regressions to stable levels
3. Show me the changed functions only as a diff — not the full file

# End of session
Update CONTEXT.md: files modified, bugs fixed, new issues, design decisions made.
```

---

## 11. FILE REGISTRY

| Filename                          | Version | Description                     |
|-----------------------------------|---------|---------------------------------|
| alchemist_factor_fusion_v1.html   | 1.0     | Initial complete build          |
| index.html                        | 1.1     | 2026-03-28 — Factor-first puzzle generation; p=q game-freeze fix; findFactors() removed |
| index.html                        | 1.2     | 2026-03-28 — Visual overhaul (CSS/SVG only, zero JS changes): title renamed to "Mr. Favors' Alchemist's Apprentice: Factor Fusion"; inline SVG potion-shop scene for #startScreen; inline SVG dungeon-hall scene for #gameScreen; BG_STYLES all 3 keys upgraded to multi-layer gradients; ambient orb palette updated to dungeon colors; .start-title dark card + drop-shadow for title readability on Chromebook |
| index.html                        | 1.3     | 2026-03-29 — Feature + bug fix: Sheets module added (fire-and-forget POST to Google Apps Script on level complete, anonymous payload, silent failure queue); Level 4 unlock bug fixed (timer expiry now calls completeLevel + _checkFlawless, Level 5 was permanently locked); SVG potion bottle tiles (buildPotionSVG, 8-color palette, gold on select, orange on fire, sparkle stars, mini SVG in bottle slots) |

---

## 12. NEXT PLANNED GAMES

See GAME_REGISTRY.md for the full roadmap.
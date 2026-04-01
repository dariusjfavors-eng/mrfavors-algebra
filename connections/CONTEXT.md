# CONTEXT.md — Mr. Favors' Connections: Exhaustive Regents Edition
> Read this file in full before writing any code. Do not modify any section
> marked **[STABLE]**. Confirm your understanding of the current state before
> proposing changes.

---

## 1. PROJECT IDENTITY

| Field            | Value                                                        |
|------------------|--------------------------------------------------------------|
| Game Title       | Mr. Favors' Connections: Exhaustive Regents Edition          |
| Version          | 3.0                                                          |
| Date             | 2026-04-01                                                   |
| Author           | Darius J. Favors ☘️                                         |
| NYS Standards    | NYS NGLS Algebra 1 (2025–2026) — N-RN.3, N-Q.1/2, S-ID.1–9,|
|                  | A-CED.1–4, A-REI.1a/3/6a/7a, F-IF.1–9, F-BF.1a/3a,        |
|                  | F-LE.1–5, A-APR.1, A-SSE.2/3c                               |
| File             | connections/index.html                                       |
| Storage Keys     | `connections_player` · `connections_count` · `connections_session` |
| PII              | None — two-tier anonymous ID only (playerId stable, sessionId per game) |
| Sheets URL       | Configured in `SHEETS_URL` constant — do not log or expose  |
| Google Site      | Deployed 2026-04-01 (data collection active)                |
| GitHub Pages URL | https://dariusjfavors-eng.github.io/mrfavors-algebra/connections/ |

---

## 2. STACK & HARD CONSTRAINTS

- **Single-file HTML** — all CSS and JS inline. No external scripts except Google Fonts.
- **No React, Vue, bundlers, or npm** — teacher must be able to open the file directly.
- **localStorage (V3)** — three keys: `connections_player` (stable playerId), `connections_count` (playCount), `connections_session` (current session JSON). No game progress is persisted — analytics only.
- **No Sheets module in V2** — analytics module added in V3. No audio yet — planned for V4.
- **No backend, no login, no accounts, no PII of any kind.**
- **Light neo-brutalist theme (#FDFBF7 bg, #111111 borders)** — intentional deviation
  from DESIGN_SYSTEM.md dark theme. Documented in connections/DESIGN_BRIEF.md.
- **Lexend / Lexend Mega fonts** — intentional deviation from Cinzel/Inter.
  Chosen for dyslexia-friendly readability. Documented in connections/DESIGN_BRIEF.md.
- Must embed cleanly inside a Google Sites iframe at 800px height.

---

## 3. ARCHITECTURE OVERVIEW [STABLE]

```
┌─────────────────────────────────────────────────────────┐
│  LEVELS array       — all vocabulary + category data     │
│  selectSafeCategories(pool) — collision-safe 4-draw     │
│  initGame(isRetry)  — board setup, matrix build          │
│  multiplyMatrixAndVector() — 4×16 truth matrix engine    │
│  submitSelection()  — match detection + one-away         │
│  renderGrid()       — tile DOM render                    │
│  renderSolved()     — solved row DOM render              │
│  navTo(screenId)    — screen management                  │
│  triggerToast(msg)  — feedback toast                     │
│  showEndGame(won)   — end modal                          │
└─────────────────────────────────────────────────────────┘
```

### Screen Flow

```
screen-intro → screen-levels → screen-vocab → screen-game
screen-game  → [end modal: won/lost] → retry/new/back-to-levels
```

### No localStorage Schema

This game intentionally uses no localStorage. No progress is persisted.
Every session starts fresh. This is a design decision, not an oversight.

---

## 4. LEVEL STRUCTURE [STABLE]

| # | ID     | Title                      | Standards              | Categories | Status    |
|---|--------|----------------------------|------------------------|------------|-----------|
| 1 | unit1  | Number & Quantity          | N-RN.3, N-Q.1/2, S-ID.1–3 | 7      | ✅ STABLE |
| 2 | unit2  | Equations & Inequalities   | A-CED.1–4, A-REI.1a/3 | 6          | ✅ STABLE |
| 3 | unit3  | Linear Functions           | F-IF.1–6, F-BF.1a/3a, F-LE.1–5 | 6   | ✅ STABLE |
| 4 | unit5  | Systems & Exponents        | A-REI.6a/7a, F-LE, A-APR.1 | 6      | ✅ STABLE |
| 5 | unit7  | Factoring & Quadratics     | A-APR.1, A-SSE, A-REI.4, F-IF.8a | 8 | ✅ STABLE |
| 6 | unit6  | Statistics & Modeling      | S-ID.1–9 full cluster  | 8          | ✅ STABLE |
| 7 | boss   | REGENTS BOSS               | All standards (isCapstone: true) | 8 boss-exclusive | ✅ STABLE |

**Boss level behavior:** `isCapstone: true` causes `initGame()` to use
`LEVELS.flatMap(l => l.categories)` as the pool — it automatically includes
all categories from all 7 levels. Boss-exclusive categories (in LEVELS[6]) are
included because the flatMap iterates every level.

---

## 5. CORE ENGINE [STABLE]

### selectSafeCategories(pool) — DO NOT TOUCH
Shuffles the pool and iterates, skipping any category whose items overlap
with already-chosen ones. Fallback: if < 4 clean categories found, returns
`shuffled.slice(0, 4)`. This is the fix for Bug 3 (collision guard).

### multiplyMatrixAndVector(matrix, vector) — DO NOT TOUCH
Standard dot product. `matrix` is 4×16 (4 categories × 16 items).
`vector` is 16×1 (1 at each selected item's position). A row sum of 4
means all 4 selected items belong to that category → correct match.
A row sum of 3 means "one away."

### submitSelection() — DO NOT TOUCH
1. Builds `allOriginalItems` from `activePoolCategories.flatMap(cat => cat.items)`
2. Builds 16-element vector by `indexOf` lookup on `currentActiveItems`
3. Calls `multiplyMatrixAndVector(solutionMatrix, vector)`
4. Checks for row = 4 (match) or row = 3 (one away)

### GAME_COLORS — DO NOT REORDER
`["#FFE066", "#8CE99A", "#74C0FC", "#B197FC"]`
Color assignment is index-based. Reordering changes which color maps to
which category — visually jarring mid-session.

### validateCategories() — Debug tool
`window.validateCategories()` in browser console. Run before every deploy
to catch item collisions across the full LEVELS array. Planned addition — not
yet implemented. Add in V3 before expanding the category pool further.

---

## 6. DATA DISCIPLINE RULES [STABLE]

These rules enforce the integrity of the matrix engine:

1. **Every category must have EXACTLY 4 items.** The vector is hardcoded
   to 16 (4 categories × 4 items). If a category has 3 or 5 items, the
   matrix silently misfires. This is a known V2 limitation (see Known Issues).

2. **No item string may appear in more than one category across the entire
   LEVELS array.** The Boss level aggregates all categories via flatMap — any
   duplicate in any level will surface as a collision in Boss mode, silently
   breaking validation.

3. **Tile text = all caps, ≤ ~20 characters preferred.** Longer terms
   may still overflow on 320px screens despite the clamp fix.

4. **When adding a new category, check all existing items in LEVELS first.**
   The selectSafeCategories() guard prevents runtime collisions but does not
   prevent data-entry collisions from going unnoticed on individual levels.

---

## 7. VOCABULARY BANKS

Each level has its own `vocab` array shown on the screen-vocab screen before
the board generates. Vocab terms are separate from category items — they are
definitions only, not matched by the game engine.

Boss level vocab is the union of all levels' vocab arrays:
`LEVELS.flatMap(l => l.vocab)` with duplicate-word deduplication.

---

## 8. CURRENT STATUS

| Component                        | Status      | Notes                                          |
|----------------------------------|-------------|------------------------------------------------|
| Level 1 — Number & Quantity      | ✅ STABLE   | 7 categories, collision-clean                  |
| Level 2 — Equations              | ✅ STABLE   | 6 categories, V1 data                          |
| Level 3 — Linear Functions       | ✅ STABLE   | 6 categories, V1 data                          |
| Level 4 — Systems & Exponents    | ✅ STABLE   | 6 categories, V1 data                          |
| Level 5 — Factoring              | ✅ STABLE   | 8 categories, V1 data                          |
| Level 6 — Statistics & Modeling  | ✅ STABLE   | 8 categories + 16 vocab terms, NEW in V2       |
| Level 7 — REGENTS BOSS           | ✅ STABLE   | 8 boss-exclusive categories, isCapstone: true  |
| selectSafeCategories()           | ✅ STABLE   | Bug 3 fix — collision guard on draw            |
| multiplyMatrixAndVector()        | ✅ STABLE   | Core truth matrix engine                       |
| submitSelection()                | ✅ STABLE   | Match + one-away detection                     |
| Tile overflow CSS                | ✅ STABLE   | Bug 4 fix — clamp(0.55rem,1.6vw,0.95rem), hyphens, overflow-wrap |
| Author comment block             | ✅ STABLE   | Above <!DOCTYPE html>                          |
| Boss win message + retry button  | ✅ STABLE   | Retry always shown on boss; updated message    |
| Level badge count                | ✅ STABLE   | LEVELS.reduce() — auto-updates as cats added   |
| ARIA live regions                | ❌ MISSING  | V4 — add aria-live="polite" to #toast, #solved-container |
| validateCategories() debug tool  | ❌ MISSING  | V4 — expose as window.validateCategories()     |
| Audio                            | ❌ PLANNED  | V4 — Web Audio API                            |
| Analytics module                 | ✅ SHIPPED  | V3 — two-tier anon ID, per-submit tracking, Sheets POST |
| Sheets POST                      | ✅ SHIPPED  | V3 — fire-and-forget no-cors fetch, retry queue |
| localStorage session             | ✅ SHIPPED  | V3 — connections_player / connections_count / connections_session |
| Google Site deploy               | ✅ SHIPPED  | 2026-04-01 — data collection active            |

**Known Issues:**
- `new Array(16).fill(0)` in `submitSelection()` is hardcoded to 16. Safe in V2
  because `selectSafeCategories()` always returns exactly 4 categories of exactly
  4 items. A future V3 fix: `new Array(activePoolCategories.flatMap(c=>c.items).length).fill(0)`.
- No ARIA live regions on `#toast` or `#solved-container`. Screen reader users
  won't hear feedback. Fix in V3.
- Pre-existing data collisions in V1 data (Levels 2–5) that the guard catches at
  runtime but which reduce the effective boss pool:
  - `"CONSTANT"` in L2 PARTS OF AN EQUATION and L4 POLYNOMIALS BY DEGREE
  - `"b"` in L3 Y-INTERCEPT SYNONYMS and L5 PARTS OF A QUADRATIC
  - `"SUM"` in L2 WORDS MEANING ADD and L5 MATH IN THE X-METHOD
  These are flagged for the next data-revision pass.

---

## 8b. ANALYTICS MODULE (V3)

### Two-Tier Anonymous ID

| Key | localStorage key | Behavior |
|-----|-----------------|----------|
| `playerId` | `connections_player` | Generated once on first visit (`anon_` + 8 random chars). Never regenerates. Links all plays from this device. |
| `sessionId` | inside session object | `anon_` + `Date.now()`. New every `initGame()`. |
| `playCount` | `connections_count` | Integer, increments every `initSession()` call. |

### Session Schema (Key: `connections_session`)

```js
{
  sessionId:    'anon_<timestamp>',   // per game
  playerId:     'anon_<8chars>',      // per device (stable)
  playCount:    N,                    // total games on this device
  timestamp:    '2026-04-01T...',     // ISO string, set at showEndGame
  level:        'unit1',             // LEVELS[currentLevelIndex].id
  levelTitle:   'Level 1: Number & Quantity',
  isCapstone:   false,               // true for boss level
  isRetry:      false,               // true if "Retry This Board"
  outcome:      'win' | 'loss',
  mistakesMade: 2,                   // 4 - mistakes at game end
  totalSubmits: 6,                   // total submitSelection calls
  oneAwayCount: 1,                   // times "one away" triggered
  solvedCount:  4,                   // 0–4
  cat1:         'RATIONAL NUMBERS',  // drawn category 1 title
  cat2:         'IRRATIONAL NUMBERS',
  cat3:         'MEASURES OF CENTER',
  cat4:         'BOX PLOT PARTS',
  solvedOrder:  'RATIONAL NUMBERS|BOX PLOT PARTS|...', // pipe-separated, in solve order
  firstSubmit:  'MEAN|MEDIAN|MODE|MIDRANGE'            // pipe-separated 4 items from first attempt
}
```

### Data Flow

1. **Board generates** → `initSession(isRetry)` — stamps level, drawn categories, playerId, playCount
2. **Each Submit click** → `recordSubmit(items, isCorrect, isOneAway)` — increments totalSubmits; captures firstSubmit on attempt #1; updates oneAwayCount and solvedOrder on each result
3. **Game ends** → `finalizeSession(won)` → `postToSheets(_currentSession)` — sets outcome, mistakesMade, timestamp, fires to Sheets
4. **Retry queue** — failed Sheets POSTs pushed to `_queue[]`, drained on next `postToSheets()` call

### Sheets Columns (in order)

`SessionID, PlayerID, Date, PlayCount, Level, LevelTitle, IsCapstone, IsRetry, Outcome, MistakesMade, TotalSubmits, OneAwayCount, SolvedCount, Cat1, Cat2, Cat3, Cat4, SolvedOrder, FirstSubmit`

### Key Classroom Questions Answered

| Question | Column(s) |
|---|---|
| Which level is hardest? | `MistakesMade` sorted by `Level` |
| Which categories are traps? | `Cat1–4` present but absent from `SolvedOrder` |
| Do retries improve outcomes? | `IsRetry=true` + `Outcome` correlation |
| What do students try first? | `FirstSubmit` clustering per level |
| How often are students "so close"? | `OneAwayCount` + `Outcome=loss` |
| Boss level readiness? | `IsCapstone=true` win rate |

---

## 9. DO NOT TOUCH

- The LEVELS array existing item strings — add categories by appending only, never editing existing item strings (students may be mid-game)
- `selectSafeCategories()` logic
- `multiplyMatrixAndVector()` logic
- `GAME_COLORS` order
- The light theme CSS variables (`--bg: #FDFBF7`, `--border-dark: #111111`) — intentional design deviation
- The Lexend/Lexend Mega font import — intentional design deviation
- The `isCapstone: true` flag on the boss level

---

## 10. KNOWN EFFECTIVE PROMPT PATTERNS

```
# Session opener
Read connections/CONTEXT.md fully. Do not modify any [STABLE] section.
Single-file HTML, vanilla JS, zero dependencies. Confirm current state
of [what I'm working on] before proposing any code.

# Bug fix
Bug: [what happens] vs [what should happen].
Cause only. Changed function only. Don't touch unrelated functions.
Show diff only — not full file.

# Adding a category
Before adding: verify the 4 new items are unique across all LEVELS.
Then append the category object to the correct level's categories array.
Show the added object only — not the full array.

# End of session
Update connections/CONTEXT.md section 8: [component] = [status], [date].
Nothing else.
```

---

## 11. FILE REGISTRY

| Filename   | Version | Description                                         |
|------------|---------|-----------------------------------------------------|
| index.html | 1.0     | V1 initial build — 6 levels, matrix engine          |
| index.html | 2.0     | 2026-03-30 — V2: author block, DESIGN_BRIEF, Bug 3/4 fixes, Level 6 added, Level 7 boss renumbered, win message updated |
| index.html | 3.0     | 2026-04-01 — V3: analytics module — two-tier anonymous ID (playerId + sessionId), per-submit tracking (totalSubmits, oneAwayCount, solvedOrder, firstSubmit), drawn category capture (cat1–4), fire-and-forget Sheets POST (no-cors + retry queue). Deployed to Google Site. |

---

## 12. NEXT PLANNED GAMES

See _scaffold/GAME_REGISTRY.md for the full roadmap.

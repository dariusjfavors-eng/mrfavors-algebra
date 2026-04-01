# CONTEXT.md — Junkyard Algebra
> Read this file at the start of every session. Update Sections 8 & 11 at end of session only.
> Do not modify any section marked [STABLE].

---

## 1. Identity & Mechanics [STABLE]

| Field         | Value                                                                        |
|---------------|------------------------------------------------------------------------------|
| Game          | Junkyard Algebra                                                             |
| Version       | 3.0                                                                          |
| Standard      | NYS Algebra 1 — A-APR.1                                                     |
| Unit          | Unit 4/5: Combining Like Terms, Distributive Property, FOIL                 |
| Mechanic      | 4 modes — drag/tap term cards to sort, merge, simplify, or challenge        |
| Architecture  | Single-file HTML, vanilla JS, Web Audio API, localStorage                   |
| Storage Keys  | `junkyard_player` · `junkyard_count` · `junkyard_session` · `autoFoilExample` |
| PII           | None — two-tier anonymous ID only (playerId stable, sessionId per game)     |
| Sheets URL    | Configured in `SHEETS_URL` constant — do not log or expose                  |
| Context File  | `junkyard/CONTEXT.md` (this file)                                           |

---

## 2. Modes [STABLE]

| Mode | ID | Badge | Description | Timer |
|------|----|-------|-------------|-------|
| A | `sort` | MODE A | Sorting Yard — identify which cards are like terms; press CHECK ✓ | None |
| B | `merge` | MODE B | Merge Bay — tap two like-term pairs to fuse via the calc modal | None |
| C | `expr` | MODE C | Expression Builder — fully simplify a multi-term expression; journal tracks steps | None |
| D | `challenge` | MODE D · T# | Challenge Yard — 4 rounds, timed, 3 tiers of increasing complexity | T1=90s · T2=120s · T3=150s |

### Challenge Tiers

| Tier | Content | Timer |
|------|---------|-------|
| 1 | Like terms only (x, y, c, x², y²) | 90s |
| 2 | Distributive property — tap bundle to expand, then merge | 120s |
| 3 | FOIL — guided F·O·I·L steps, then merge like terms | 150s |

---

## 3. Game Flow [STABLE]

```
Menu → Mode Select
  ├── Mode A (sort)       → initSort()      → sortCheck() → checkWin() → showWin()
  ├── Mode B (merge)      → initMerge()     → submitCalc() → openClassify() → showWin()
  ├── Mode C (expr)       → initExpr()      → submitCalc() → checkWin() → showWin()
  └── Mode D (challenge)  → openTierSelect() → initChallenge(tier)
                              └── 4× nextChallengeRound()
                                    ├── Rounds 1–3: showRoundClear()
                                    └── Round 4:   showChallengeComplete()  ← true win
                              └── Timer expires: showWin()                  ← timeout

showWin() → screen-win → "Regents Challenge" → goTransfer() → answerReg()
                       → "Back to Modes"    → screen-mode
```

**Two win paths for challenge mode:**
- `showChallengeComplete()` = true win (all 4 rounds cleared)
- `showWin()` in challenge = timeout (timer expired)

---

## 4. Architecture [STABLE]

```
┌─ G (global state)        — mode, terms, selected, score, mergeCount, origExpr,
│                             timer, timeLeft, paused, done, drag,
│                             challengeTier, challengeRound, foilGuide
├─ TERM_VTYPE_MAP           — internal monomial representation (c, x, y, x2, y2, xy)
├─ MathCore API             — makeTerm, makeBundle, termLabel, termKey,
│                             canCombine, combineTerms, termVarString
├─ expandBundle()           — distributive / FOIL expansion → pushes new terms to G.terms
├─ submitCalc()             — calc modal validation: parses user input, checks coefficient+variable
├─ checkWin()               — scans G.terms for any remaining combinable pairs
├─ RBANK                    — 6 Regents multiple-choice questions (A-APR.1)
├─ goTransfer() / answerReg() — post-game Regents transfer screen
├─ Audio module             — Web Audio API beep() (sel, merge, err, win, smoke)
└─ Analytics module         — initSession, finalizeSession, recordRegents, postToSheets
```

---

## 5. Analytics Module (V3)

### Two-Tier Anonymous ID

| Key | localStorage key | Behavior |
|-----|-----------------|----------|
| `playerId` | `junkyard_player` | Generated once on first visit (`anon_` + 8 random chars). Never regenerates. |
| `sessionId` | inside session object | `anon_` + `Date.now()`. New every `initSession()` call. |
| `playCount` | `junkyard_count` | Integer, increments every `initSession()` call. |

### Session Schema (Key: `junkyard_session`)

```js
{
  sessionId:        'anon_<timestamp>',    // per game
  playerId:         'anon_<8chars>',       // per device (stable)
  playCount:        N,                     // total games on this device
  timestamp:        '2026-04-01T...',      // ISO string, set at game end
  mode:             'sort'|'merge'|'expr'|'challenge',
  challengeTier:    1|2|3|null,            // null for non-challenge modes
  outcome:          'win'|'timeout',       // timeout only in challenge
  score:            N,
  mergeCount:       N,                     // successful like-term fusions
  origExpr:         '3x + 2y - x + ...',  // starting expression (null for sort/merge)
  finalExpr:        '2x + 2y + ...',       // simplified result (null for sort)
  regentsAttempted: false,                 // true if student clicked Regents Challenge
  regentsOutcome:   'correct'|'wrong'|null,
  regentsQuestion:  'first 60 chars...'   // abbreviated question text
}
```

### Data Flow

1. **Mode launches** → `initSession(mode, tier)` — stamps mode, tier, playerId, playCount, origExpr
2. **Game ends** → `finalizeSession(outcome)` → `postToSheets(_currentSession)` — **Row 1 fires** (regentsAttempted=false)
3. **Regents question answered** → `recordRegents(correct, qText)` → `postToSheets(_currentSession)` — **Row 2 fires** (regentsAttempted=true, same sessionId)
4. **Retry queue** — failed POSTs pushed to `_queue[]`, drained on next `postToSheets()` call

**Note on two-row design:** Row 1 always fires at game end. Row 2 fires only if the student attempts the Regents question. Both rows share the same `sessionId`. Filter `RegentsAttempted = TRUE` in Sheets for transfer readiness analysis, or join on `SessionID` for the full picture.

### Hook Points

| Event | Hook |
|-------|------|
| Mode A starts | `initSession('sort', null)` — end of `initSort()` |
| Mode B starts | `initSession('merge', null)` — end of `initMerge()` |
| Mode C starts | `initSession('expr', null)` — end of `initExpr()`, after `origExpr` set |
| Mode D starts | `initSession('challenge', tier)` — end of `initChallenge(tier)`, after `origExpr` set |
| Mode D restart | `initSession('challenge', t)` — in `challenge_restart` path, after `origExpr` set |
| Sort/Merge/Expr win | `finalizeSession('win')` + `postToSheets` — start of `showWin()` |
| Challenge timeout | `finalizeSession('timeout')` + `postToSheets` — start of `showWin()` |
| Challenge all rounds | `finalizeSession('win')` + `postToSheets` — start of `showChallengeComplete()` |
| Regents answered | `recordRegents(correct, qText)` + `postToSheets` — start of `answerReg()` |

### Sheets Columns (in order)

`SessionID, PlayerID, Date, PlayCount, Mode, ChallengeTier, Outcome, Score, MergeCount, OrigExpr, FinalExpr, RegentsAttempted, RegentsOutcome, RegentsQuestion`

### Key Classroom Questions Answered

| Question | Column(s) |
|---|---|
| Which mode is hardest? | `Outcome` + `MergeCount` sorted by `Mode` |
| Do students struggle more with FOIL than distribution? | `ChallengeTier` + `Outcome=timeout` |
| Are students ready for Regents? | `RegentsOutcome` by `Mode` / `ChallengeTier` |
| What expressions trip students up? | `OrigExpr` for `Outcome=timeout` sessions |
| Does more practice (playCount) improve scores? | `PlayCount` × `Score` / `Outcome` trend |

---

## 6. Design Notes [STABLE]

| Property      | Value                                                |
|---------------|------------------------------------------------------|
| Theme         | Dark sci-fi / junkyard — `#0d0f14` bg, neon accents |
| Font          | `Courier New`, monospace                             |
| Accent green  | `#39ff14` (like terms, correct feedback)            |
| Accent orange | `#ff6b35` (challenge mode badge)                    |
| Accent purple | `#7b6cf6` (merge mode badge)                        |
| Warning       | `#ffd60a` (score, timer, round headers)             |
| Danger        | `#ff3b5c` (errors, wrong answers)                   |
| Term shapes   | Circle=constant · Hexagon=x · Purple circle=y ·     |
|               | Orange rect=x² · Dashed circle=y² · Diamond=xy     |
| Audio         | Web Audio API — beep types: sel, merge, err, win, smoke |
| Animations    | `cflash` (correct merge), `wshake` (wrong), `smokeOut` (term eliminated) |

---

## 7. Current Component Status

| Component              | Status      | Notes                                           |
|------------------------|-------------|-------------------------------------------------|
| Mode A — Sorting Yard  | ✅ Stable   | sortCheck() validates like-term groups          |
| Mode B — Merge Bay     | ✅ Stable   | calc modal + classify step                      |
| Mode C — Expression Builder | ✅ Stable | journal tracks orig/grouped/simplified         |
| Mode D — Challenge T1  | ✅ Stable   | 4 rounds, 90s, like terms                      |
| Mode D — Challenge T2  | ✅ Stable   | distributive property bundles                  |
| Mode D — Challenge T3  | ✅ Stable   | FOIL guided mode (F·O·I·L step order)           |
| RBANK Regents questions | ✅ Stable  | 6 questions, A-APR.1 aligned                   |
| Audio                  | ✅ Stable   | Web Audio API, graceful fail on block           |
| Analytics module       | ✅ Shipped  | V3 — two-tier ID, all modes, Regents tracking   |
| Sheets POST            | ✅ Shipped  | V3 — fire-and-forget no-cors, retry queue       |
| localStorage session   | ✅ Shipped  | V3 — junkyard_player / count / session          |

**Known Issues:** None active.

---

## 8. DO NOT TOUCH

- `TERM_VTYPE_MAP` — defines all variable types; changing breaks term creation throughout
- `multiplyVars()`, `combineTerms()`, `canCombine()` — algebra core; any change silently breaks validation
- `exprStr()` — source of truth for `origExpr` and `finalExpr`; reordering logic changes expression format
- `submitCalc()` — user input parser; brittle regex for coefficient+variable extraction
- `expandBundle()` — pushes new terms to `G.terms`; order-sensitive for FOIL guided mode
- `checkWin()` — win condition; must fire after every successful merge and bundle expansion
- `GAME_COLORS` (inherited from architecture — not present here, but don't add color-indexed arrays)
- `RBANK` — 6 Regents questions; changing indices breaks `answerReg()` correct-answer mapping
- `JY_PLAYER_KEY`, `JY_COUNT_KEY`, `JY_SESSION_KEY` constant values — changing wipes existing player history
- `SHEETS_URL` — never log, expose, or store in any public location
- `mode: 'no-cors'` on Sheets fetch — required; removing breaks silently
- `autoFoilExample` localStorage key — user settings; do not rename

---

## 9. Prompt Patterns

```
# Session opener
Read junkyard/CONTEXT.md fully. Do not modify any [STABLE] section.
Single-file HTML, vanilla JS. Confirm current state before proposing any code.

# Bug fix
Bug: [what happens] vs [what should happen].
Identify which mode triggers it. Changed function only. Show diff only.

# End of session
Update junkyard/CONTEXT.md sections 7 (component status) and 11 (file registry) only.
```

---

## 10. File Registry

| Version | Date       | Description                                                                         |
|---------|------------|-------------------------------------------------------------------------------------|
| 1.0     | —          | Initial build — 4 modes (sort/merge/expr/challenge), FOIL guided mode, Web Audio, RBANK Regents transfer |
| 3.0     | 2026-04-01 | Analytics module — two-tier anonymous ID (playerId + sessionId), per-mode session tracking, Regents transfer outcome, fire-and-forget Sheets POST (no-cors + retry queue). Deployed for data collection. |

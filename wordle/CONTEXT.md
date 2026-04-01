# CONTEXT.md — Mr. Favors' Wordle
> Read this file at the start of every session. Update Sections 8 & 11 at end of session only.
> Do not modify any section marked [STABLE].

---

## 1. Identity & Mechanics [STABLE]

| Field         | Value                                                                 |
|---------------|-----------------------------------------------------------------------|
| Game          | Mr. Favors' Wordle                                                    |
| Version       | 3.0                                                                   |
| Standard      | NYS Algebra 1 — A-SSE.1a, A-SSE.2, A-APR.1 (Unit 7 vocab fluency)  |
| Unit          | Unit 7: Factoring                                                     |
| Mechanic      | Guess the secret 6-letter algebra vocabulary word in 6 tries.        |
|               | Color-coded feedback (green/gold/gray) per letter per row.           |
|               | All valid guesses must come from the 16-word Word Bank.              |
| Architecture  | Single-file HTML, vanilla JS, localStorage                            |
| Hosting       | Google Sites (embedded, deployed 2026-04-01)                         |
| Storage Keys  | `mrfavors_wordle_player` · `mrfavors_wordle_count` · `mrfavors_wordle_session` |
| PII           | None — two-tier anonymous ID only (see Section 5)                    |
| Sheets URL    | Configured in `SHEETS_URL` constant — do not log or expose            |
| Context File  | `wordle/CONTEXT.md` (this file)                                      |

---

## 2. Word Bank [STABLE]

16 words, all exactly 6 characters, all drawn from Unit 7: Factoring vocabulary.

| Word   | Fill-in-the-blank clue (displayed as hint)                                                      |
|--------|-------------------------------------------------------------------------------------------------|
| FACTOR | To _______ an expression means finding what multiplies together to get it.                      |
| VERTEX | The turning point or tip (maximum/minimum) of a parabola is called the _______.                |
| MONOMI | An algebraic expression consisting of exactly one term is called a _______(-al).               |
| COEFFI | A number multiplied by a variable in an algebraic expression is a _______(-cient).             |
| SQUARE | DOPS stands for Difference of Perfect _______s. (Like the 16 in x² - 16)                      |
| METHOD | We use the X-_______ or Diamond-_______ to organize our factoring work.                        |
| COMMON | GCF stands for Greatest _______ Factor. It is the biggest number that goes into all terms.     |
| DIVIDE | To pull a GCF out of an expression, you must _______ each term by it.                          |
| DEGREE | The _______ of a polynomial is its highest exponent.                                            |
| MIDDLE | In the X-method, the two numbers must add to the _______ term.                                 |
| NUMBER | A constant is just a plain _______ with no variables attached to it.                           |
| VALUES | To check your work, plug these _______ in for x.                                               |
| GRAPHS | Parabolas are the U-shaped _______ of quadratic equations.                                     |
| TRINOM | An expression with exactly three terms is called a _______(-ial).                              |
| BINOMS | Short for binomials, math expressions with two terms are called _______.                       |
| EQUALS | To find the final answer, set the factors to zero using an _______ sign.                       |

Word is chosen randomly each game from `Object.keys(dictionary)`.

---

## 3. Game Flow [STABLE]

```
Intro Slide
  ├── "Review Vocab Words" → Word Bank Slide → "Start Game" → Game
  └── "How to Play"        → Rules Slide → "Got It!" → back to Intro

Game
  ├── Each valid guess (must be in word bank) → color-coded row animation
  ├── After guess 1: Hint Peek button enabled (3s timed reveal, once per row)
  ├── On guess 6: clue permanently revealed
  ├── Win (all 6 green) or Loss (row 6 exhausted) → triggerEndGame(success)
  └── End Game Slide → "Play Again" → resetGame() → Intro Slide
```

---

## 4. Architecture [STABLE]

```
┌─ Dictionary        (16-word vocab object, fill-in-the-blank clues)
├─ Game State        (currentRow, currentCol, isProcessing, isGameOver, hintTimeoutId)
├─ Analytics Module  (initSession, recordGuess, finalizeSession, postToSheets, generateCSV, downloadCSV)
├─ DOM / Navigation  (setupNavigation, initWordBank, initMatrix, initKeyboard)
├─ Game Logic        (handleInput, executeValidationSequence, animateRowValidation)
├─ Clue System       (lockClue, revealClue, hint peek with 3s timeout)
└─ Reset             (resetGame → new word → new session)
```

---

## 5. Analytics Module [STABLE — v3.0]

### Two-Tier Anonymous ID

| Key | localStorage key | Behavior |
|-----|-----------------|----------|
| `playerId` | `mrfavors_wordle_player` | Generated once on first visit (`anon_` + 8 random chars). Never regenerates. Links all plays from this device. |
| `sessionId` | inside session object | `anon_` + `Date.now()`. New every `resetGame()`. |
| `playCount` | `mrfavors_wordle_count` | Integer, increments every `initSession()` call. |

### Session Schema (Key: `mrfavors_wordle_session`)

```js
{
  sessionId:       'anon_<timestamp>',   // per game
  playerId:        'anon_<8chars>',      // per device (stable)
  playCount:       N,                    // total games played on this device
  word:            'FACTOR',             // targetWord at session start
  outcome:         'win' | 'loss',       // set by finalizeSession()
  solvedOnAttempt: 3 | null,            // attempt# if won, null if lost
  attempts:        3,                    // currentRow + 1 at game end
  firstGuess:      'DEGREE',            // gridState[0] after first valid guess
  guess1:          'DEGREE',            // each valid guess in order
  guess2:          'COMMON',
  guess3:          'FACTOR',
  guess4:          null,                 // null if row not reached
  guess5:          null,
  guess6:          null,
  timestamp:       '2026-04-01T...'     // ISO string, set at triggerEndGame
}
```

### Data Flow

1. **Page load / Play Again** → `initSession()` stamps new session, increments playCount
2. **Each valid guess** → `recordGuess(guessString)` writes `guess1`–`guess6`, `firstGuess`, `attempts`
3. **Game ends** → `finalizeSession(success)` → `postToSheets(_currentSession)` → `downloadCSV(_currentSession)` → show button
4. **Retry queue** → failed Sheets POSTs pushed to `_queue[]`, drained on next `postToSheets()` call

### CSV Columns (in order)

`SessionID, PlayerID, Date, PlayCount, Word, Outcome, SolvedOnAttempt, Attempts, FirstGuess, Guess1, Guess2, Guess3, Guess4, Guess5, Guess6`

Filename: `wordle_report_<timestamp>.csv`

---

## 6. Google Apps Script

`doPost(e)` reads `e.postData.contents` as JSON (sent as `text/plain` via `no-cors` fetch).
Appends one row per game to the **"Wordle Data"** tab. Creates tab + frozen header row on first run.
Deploy settings: **Execute as: Me · Access: Anyone**.
Template: `_scaffold/APPS_SCRIPT_TEMPLATE.gs`

---

## 7. Design Notes [STABLE]

| Property      | Value                                         |
|---------------|-----------------------------------------------|
| Fonts         | Inter 400/600/800 + JetBrains Mono 400/700    |
| Theme         | Paper/ink — `#F8F6F0` bg, `#111111` ink       |
| Correct       | Deep Forest Green `#1B3B2E`                   |
| Present       | Antique Gold `#C59B27`                        |
| Absent        | Warm Grey `#D1CEC7`                           |
| Grid          | 6 rows × 6 columns, `clamp(45px, 12vw, 60px)` cells |
| Animations    | `inkStamp` (key press), `paperFlip` (row reveal) |
| Noise overlay | CSS SVG fractal noise, `opacity: 0.3`, `pointer-events: none` |

**Intentional deviation from DESIGN_SYSTEM.md:** Uses paper/ink light theme instead of dark navy. Approved for this game — do not "fix."

---

## 8. Current Component Status

| Component         | Status   | Notes                                      |
|-------------------|----------|--------------------------------------------|
| Dictionary        | ✅ Stable | 16 words, Unit 7 Factoring                |
| Game grid/logic   | ✅ Stable | Standard Wordle validation (statusVector) |
| Hint/clue system  | ✅ Stable | 3s peek, permanent reveal on row 6        |
| Analytics module  | ✅ Stable | v3.0 — two-tier ID, guess1–6, Sheets POST |
| CSV export        | ✅ Stable | Auto + manual download button             |
| Sheets POST       | ✅ Stable | fire-and-forget, retry queue              |
| Reset flow        | ✅ Stable | New word + new session on Play Again      |

**Known Issues:** None active as of v3.0.

---

## 9. DO NOT TOUCH

- `dictionary` object key names — changing truncated words (MONOMI, COEFFI, TRINOM, BINOMS) breaks the word bank
- `words = Object.keys(dictionary)` — order is insertion order; reordering changes randomness distribution
- `gridState` — source of truth for all guess data; `recordGuess` reads it via `currentRow`
- `PLAYER_KEY`, `COUNT_KEY`, `SESSION_KEY` constant values — changing wipes existing player history
- `SHEETS_URL` — never log, expose, or store in any public location
- `mode: 'no-cors'` on Sheets fetch — required for Apps Script; removing breaks silently
- `recordGuess` call site in `executeValidationSequence` — must fire **after** word bank check but **before** `isProcessing = true` (timing-sensitive relative to animation)
- `initSession()` in `resetGame` — must fire **after** `targetWord` is reassigned (session captures the new word)

---

## 10. Prompt Patterns

```
# Session opener
Read wordle/CONTEXT.md fully. Do not modify any [STABLE] section.
State current component status before proposing any change.

# Feature request
Before code: 1. Identify which module is touched  2. List regressions to [STABLE] sections  3. Show diffs only

# End of session
Update CONTEXT.md sections 8 (component status) and 11 (file registry) only.
```

---

## 11. File Registry

| Version | Date       | Description                                                              |
|---------|------------|--------------------------------------------------------------------------|
| 1.0     | —          | Initial build — dictionary, grid, keyboard, hint/clue system, reset      |
| 2.0     | —          | Visual polish — paper/ink theme, JetBrains Mono grid, noise overlay, clue box reveal animation |
| 3.0     | 2026-04-01 | Analytics module — two-tier anonymous ID (playerId + sessionId), guess1–6 flat columns, firstGuess, Sheets POST (fire-and-forget + retry queue), CSV auto-download + manual button. Deployed to Google Sites. |

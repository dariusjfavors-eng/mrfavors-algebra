# NEW_GAME_PROMPT.md — Token-efficient new game builder
# Fill [BRACKETS]. Paste into Claude Code. Two-step process.
# ─────────────────────────────────────────────────────────

## STEP 1 — PASTE THIS FIRST (summary request, no code yet)

Read these files in order:
1. _scaffold/STANDARDS.md
2. _scaffold/COVERAGE.md
3. _scaffold/DESIGN_SYSTEM.md
4. _scaffold/FERPA_RULES.md
5. [GAMEFOLDER]/DESIGN_BRIEF.md

Confirm all five read. List back:
- Standard codes, weights, both error tags for each
- Primary + accent colors from DESIGN_BRIEF
- Display + body fonts from DESIGN_BRIEF
- Game object description (one sentence)
- Title screen + game screen background (one sentence each)

Do not write any code yet.

---
[READ CLAUDE'S SUMMARY. VERIFY IT MATCHES YOUR DESIGN_BRIEF.
 IF WRONG: CORRECT IT BEFORE CONTINUING.
 IF RIGHT: PASTE STEP 2.]
---

## STEP 2 — PASTE THIS AFTER CONFIRMING SUMMARY

Confirmed. Build the game.

Name: [FULL GAME NAME]
Standards: [CODES]
Storage key: [KEY]Session
Apps Script URL: [YOUR_URL]
Output file: [GAMEFOLDER]/index.html

HARD CONSTRAINTS: single-file HTML, vanilla JS, zero npm,
Google Fonts only, localStorage no PII, daily coin cap 100,
answer-first puzzle generation, 44px touch targets, ARIA labels.

REUSE FROM alchemist/index.html (copy verbatim, change only
storage key, URL, color values, font imports, string labels):
Storage, Sheets, Audio, trapFocus/releaseFocus, feedbackMsg,
achievementPopup, settingsModal, starField, srAnnounce, showScreen.

BUILD UNIQUE TO THIS GAME:
- CSS custom properties from DESIGN_BRIEF palette
- Google Fonts import from DESIGN_BRIEF fonts
- Title SVG scene from DESIGN_BRIEF title screen description
- Game SVG scene from DESIGN_BRIEF game screen description
- Game object component from DESIGN_BRIEF game object description
- LEVEL_CONFIG ([N] levels + boss)
- generatePuzzle() answer-first for [STANDARD]
- generateChoiceBank()
- checkAnswer() returning CORRECT/PARTIAL/INCORRECT
- Feedback messages per error tag:
  [ERROR_TAG_1]: "[message targeting this misconception]"
  [ERROR_TAG_2]: "[message targeting this misconception]"

BUILD ORDER: LEVEL_CONFIG → puzzle engine → HTML screens →
CSS → SVG backgrounds → game object → FSM → UI module →
reuse modules → event listeners → runPuzzleTests() → assemble.

SELF-TEST BEFORE HANDOFF: run runPuzzleTests logic internally.
All 200×[N] checks must pass. Fix failures before handing file.

POST-BUILD: create [GAMEFOLDER]/CONTEXT.md from _scaffold/CONTEXT.md
template. Update _scaffold/COVERAGE.md status to SHIPPED.
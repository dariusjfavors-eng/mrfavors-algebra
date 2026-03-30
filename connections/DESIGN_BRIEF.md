# DESIGN_BRIEF.md — Mr. Favors' Connections
# Exhaustive Regents Edition
# Created: 2026-03-30 | Status: V1 BUILT — V2 Bug Fixes In Progress

---

## HEADER
Game:             Mr. Favors' Connections
Standard:         NYS Algebra 1 NGLS (2025–2026)
Visual identity:  Neo-brutalist, NOT Alchemist's Apprentice
Author:           Darius J. Favors ☘️
Version:          2.0
Date:             2026-03-30
Levels:           7 (Levels 1–6 thematic, Level 7 = cumulative boss)
Data collection:  Anonymous session only (no FERPA risk, no Google Sheets needed)

---

## GAME IDENTITY
Name: Mr. Favors' Connections: Exhaustive Regents Edition
Tagline: "Find the four groups hiding in your Algebra 1 vocabulary — before you run out of chances."
Standards: N.RN.3, N.Q.1/2, S.ID.1–9, A.CED.1–4, A.REI.1/3/5/6, F.IF.1–9, F.BF.1/3, F.LE.1–5, A.APR.1
Player action: Tap 4 tiles to select a group, then tap Submit. Correct = category solved and removed from board. Wrong = lose one of 4 mistakes.

---

## VISUAL THEME
Setting: Bold, high-contrast classroom game — deliberately school-coded but energetic.
Metaphor: Physical flash cards / tiles that feel solid and satisfying to press.
Mood: Confident, clean, brutalist — math that punches you in the eye in a good way.
Reference: NYT Connections game aesthetic. Neo-brutalist UI: thick black borders,
           offset drop shadows, no gradients. Makes the game feel premium on a Chromebook.

**IMPORTANT DESIGN DEVIATION FROM DESIGN_SYSTEM.md:**
This game intentionally uses a LIGHT theme (#FDFBF7 background, #111111 text) with a
dotted grid pattern. Reason: Connections is a vocabulary/classification game, not an
action game. The light brutalist aesthetic signals "this is a thinking puzzle" distinct
from the dark action-game feel of Alchemist and Junkyard. This deviation is documented here.
Font family is Lexend/Lexend Mega (dyslexia-friendly) instead of Cinzel/Inter.
This is intentional for vocabulary readability.

---

## COLOR PALETTE
Background:  #FDFBF7  (warm white with dot-grid pattern)
Surface:     #FFFFFF  (tile background)
Surface2:    #F5F5F5  (not used currently — inset panels)
Primary:     #3E8ED0  (blue — btn-primary, selected state context)
Accent:      #FFD43B  (yellow — level badges, modal shadows)
Text:        #111111  (near-black for brutalist contrast)
Muted:       #555555  (not currently defined — labels)
Success:     #34C759  (green — correct categories, btn-success)
Error:       #FF3B30  (red — wrong answers, keyword highlights, boss borders)
Warning:     #FFD43B  (yellow — "one away" toast, subtitle badges)

Game tile colors (4 categories):
  Yellow:  #FFE066
  Green:   #8CE99A
  Blue:    #74C0FC
  Purple:  #B197FC

---

## TYPOGRAPHY
Display font: Lexend Mega (700, 900) — headers, titles, tile text, level names
Body font:    Lexend (400, 600, 800) — vocab definitions, buttons, UI labels
Math font:    Lexend (uppercase, 800 weight) — all math terms in tiles

Deviation from DESIGN_SYSTEM.md: Lexend chosen for dyslexia-readability over Cinzel.
Tiles use uppercase + font-weight 800 for scanability under classroom conditions.

---

## GAME OBJECT
What is the game object? Flat rectangular tiles on a 4×4 grid.
Shape: Rectangular with rounded corners (border-radius: 8px), 4:3 aspect ratio.
Color source: Tiles start neutral white (#FFFFFF). Selected = inverted (#222222 bg / white text).
              Solved tiles take the category's assigned color (yellow/green/blue/purple).
Selected state: Dark inversion + offset shift (transform: translate(3px, 3px)) — feels like pressing a physical button.

**V2 KNOWN ISSUE (Bug 4):** aspect-ratio: 4/3 clips long Regents terms on narrow screens.
Fix: Remove aspect-ratio, use min-height instead. See Bug 4 fix task.

---

## GAME SCREENS
1. screen-intro — Title + "Select Level" CTA
2. screen-levels — Level cards (6 levels + boss) with category count badges
3. screen-vocab — Word Bank Refresher (scrollable list) before each game
4. screen-game — 4×4 grid + mistakes tracker + solved rows + controls

---

## LEVELS
| # | ID     | Title                    | Pool Size | Notes                          |
|---|--------|--------------------------|-----------|--------------------------------|
| 1 | unit1  | The Basics               | 6 cats    | N.RN.3, S.ID.1–3 vocab        |
| 2 | unit2  | Equations                | 6 cats    | A.CED.1–4, A.REI vocab        |
| 3 | unit3  | Linear Functions         | 6 cats    | F.IF, S.ID.7 vocab            |
| 4 | unit5  | Systems & Exponents      | 6 cats    | A.REI.6, F.LE vocab           |
| 5 | unit7  | Factoring Review         | 8 cats    | A.APR.1 vocab                 |
| 6 | boss   | REGENTS BOSS             | ALL cats  | Aggregates all prior levels   |

Each play randomly selects 4 categories from the pool.
Boss level aggregates ALL categories from all levels + its own 5.

---

## FEEDBACK ANIMATIONS
Correct: Tiles jump (anim-jump) then tile colors flip to category color, row slides in with stampIn.
Wrong: Tiles shake (anim-shake), mistake dot fades out.
Partial: Toast "One away..." appears for 2 seconds.
On fire: Not implemented in V1. Planned for V2 if appropriate.

---

## SOUND CHARACTER
V1: No audio. Web Audio API sounds are planned for V2 if appropriate for the game type.

---

## UNIQUE MECHANIC NOTES
- Randomized board: Each play draws 4 of N available categories. Replayability is a core feature.
- isCapstone flag: Boss level aggregates all categories from all levels + boss-specific categories.
- Matrix validation: The validator builds a 4×(N) truth matrix and multiplies to detect
  exact matches and "one away" states. This is the core validation engine.
- Category pool: Categories are defined in JS LEVELS array. Adding a category requires
  exactly 4 items (enforced by Bug 2 fix) and no items shared with other categories
  in the same pool (enforced by Bug 3 fix).
- Vocab screen: Each level has its own vocab glossary shown before play.

---

## KNOWN BUGS (V2 Fix Priority)
1. [CRITICAL] indexOf finds first duplicate — wrong matrix row → wrong answer silently
2. [CRITICAL] Vector hardcoded to 16 — breaks if any category has ≠ 4 items
3. [CRITICAL] No collision guard on category draw — currently fires with existing data
4. [MEDIUM]   aspect-ratio: 4/3 clips long terms on Chromebook/mobile

---

## WHAT TO REUSE FROM ALCHEMIST
[ ] Storage module — not applicable (no progress to persist)
[ ] Sheets module — planned for V2 data collection
[ ] Audio module — planned for V2
[ ] trapFocus / releaseFocus — modals need this (not yet implemented)
[ ] Feedback message system — using toast instead
[ ] Achievement popup — not applicable
[ ] Settings modal — not applicable
[ ] Star field ambient background — intentionally NOT used (light theme)
[X] Screen management pattern — implemented (navTo function)
[X] SR announce region — MISSING, needs to be added in V2
[ ] Cauldron component — not applicable
[ ] X-Board component — not applicable
[ ] Bottle tile system — not applicable

---

## NOTES FOR CLAUDE
- One change per message. Show diffs only. Do not rewrite the full file.
- Do not touch any [STABLE] section when fixing a bug in another section.
- The brutalist light theme and Lexend fonts are INTENTIONAL — do not "fix" them
  to match DESIGN_SYSTEM.md. The deviation is documented above.
- Every category added to LEVELS must have EXACTLY 4 items.
- Every category added must not share any item string with any other category
  in the same level's pool (including boss, which aggregates all).
- The matrix engine is the heart of the validator — understand it before touching it.
- The isCapstone: true flag causes Boss to aggregate ALL categories from all levels.
  Any duplicate item added to any level will surface as a Bug 1 collision in Boss mode.

# WORKFLOW.md — Complete Operating Manual
# Mr. Favors Algebra Game Suite | Mac | No terminal required
# ─────────────────────────────────────────────────────────

## FILE SYSTEM

```
mrfavors-algebra/              ← GitHub repo, lives on your Desktop
├── _scaffold/                 ← shared rules, never game code
│   ├── WORKFLOW.md            ← this file
│   ├── STANDARDS.md           ← NYS standards, read-only
│   ├── COVERAGE.md            ← one line per game, update on ship
│   ├── DESIGN_SYSTEM.md       ← technical rules, read-only
│   ├── FERPA_RULES.md         ← compliance, read-only
│   ├── GAME_REGISTRY.md       ← all games + URLs
│   ├── CONTEXT.md             ← active game memory, update every session
│   ├── DESIGN_BRIEF_TEMPLATE.md ← copy per new game
│   ├── NEW_GAME_PROMPT.md     ← prompt to build any new game
│   ├── UPDATE_STANDARDS_PROMPT.md
│   └── APPS_SCRIPT_TEMPLATE.gs
├── alchemist/
│   ├── index.html
│   ├── CONTEXT.md
│   └── DESIGN_BRIEF.md
├── junkyard/
│   ├── index.html
│   ├── CONTEXT.md
│   └── DESIGN_BRIEF.md
├── [future-game]/
│   ├── index.html
│   ├── CONTEXT.md
│   └── DESIGN_BRIEF.md
└── index.html                 ← hub page (after 2+ games)
```

RULE: each game = its own folder. _scaffold = shared by all games.
CONTEXT.md in _scaffold = the game you're working on RIGHT NOW.
Switch games = update CONTEXT.md.

---

## FILE PERMISSIONS

| File | Claude reads | Claude writes | You write |
|---|---|---|---|
| _scaffold/CONTEXT.md | Every session | End of session only | Initial setup |
| _scaffold/STANDARDS.md | Planning only | NEVER | NEVER |
| _scaffold/COVERAGE.md | Planning + ship | Only on ship | Via UPDATE prompt |
| _scaffold/DESIGN_SYSTEM.md | New game builds | NEVER | NEVER |
| _scaffold/FERPA_RULES.md | Storage features | NEVER | NEVER |
| [game]/CONTEXT.md | That game | End of session | Initial setup |
| [game]/DESIGN_BRIEF.md | When building | NEVER after build | You fill before build |

---

## SESSION TYPE 1 — FIX OR IMPROVE AN EXISTING GAME

Step 1: Open VS Code → File → Open Folder → Desktop → mrfavors-algebra
Step 2: Open _scaffold/CONTEXT.md. Read section 8 (what's stable).

Paste to start every session:
```
Read _scaffold/CONTEXT.md fully.
Game: [NAME] at [GAMEFOLDER]/index.html.
Do not modify any [STABLE] section.
Confirm status of [what I'm working on] before writing code.
```

One change per message. Always. Show diffs, not full rewrites.

Review after every change: "Did you touch anything besides what I asked?"
If yes: "Revert those changes."

Test: double-click index.html → Chrome. F12 → Console → window.runPuzzleTests()

End every session:
```
Update _scaffold/CONTEXT.md section 8: [component] = [status], [date].
Section 11: add [filename], [what changed].
Do nothing else.
```

Push to GitHub: GitHub Desktop → type summary → Commit to main → Push origin.

---

## SESSION TYPE 2 — BUILD A NEW GAME

Step 1 — Plan (paste into Claude Code, no files written):
```
Read _scaffold/STANDARDS.md and _scaffold/COVERAGE.md only.
List Wt=5 Pri=Y standards not in any SHIPPED game.
Recommend which cluster to build next.
```

Step 2 — Create folder in VS Code sidebar:
Right-click sidebar → New Folder → [game-name]
Create empty: [game-name]/index.html and [game-name]/DESIGN_BRIEF.md

Step 3 — Fill DESIGN_BRIEF.md (15-20 min, be specific):
Open _scaffold/DESIGN_BRIEF_TEMPLATE.md → copy all → paste into [game]/DESIGN_BRIEF.md
Fill every bracket. Colors, fonts, theme, game object, backgrounds. No brackets left blank.

Step 4 — Create Google Sheet + Apps Script:
1. sheets.google.com (DOE account) → new spreadsheet → name it "[Game] Data"
2. Rename Sheet1 tab to: GameData
3. Row 1 headers A-L:
   Timestamp|SessionID|Level|Attempts|Correct|Wrong|Accuracy|HintsUsed|TimeOnTask(s)|CoinsTotal|AchievementsCount|LevelComplete
4. Extensions → Apps Script → delete existing code
5. Open _scaffold/APPS_SCRIPT_TEMPLATE.gs → copy all → paste → save
6. Deploy → New Deployment → Web App → Execute as: Me → Access: Anyone → Deploy
7. Copy the URL
8. TEST: paste URL in new browser tab → must see: OK
   If you see Google login page: email DOE IT to enable anonymous Apps Script access

Step 5 — Run NEW_GAME_PROMPT.md:
Open _scaffold/NEW_GAME_PROMPT.md → fill brackets (name, standards, storage key, URL, folder)
Paste STEP 1 into Claude Code → review summary → paste STEP 2

Step 6 — Test:
Save file → open in Chrome → manual test every level
F12 → runPuzzleTests() → all pass required

Step 7 — Create game CONTEXT.md:
```
Create [GAMEFOLDER]/CONTEXT.md from _scaffold/CONTEXT.md template.
Fill all sections for [GAME NAME]. Mark copied modules [STABLE].
```

Step 8 — Update COVERAGE.md via UPDATE_STANDARDS_PROMPT.md → Action A

Step 9 — Push: GitHub Desktop → "[Game Name] initial build" → Commit → Push

Live at: https://dariusjfavors-eng.github.io/mrfavors-algebra/[gamefolder]/

---

## SESSION TYPE 3 — PLANNING ONLY

```
Read _scaffold/STANDARDS.md and _scaffold/COVERAGE.md only.
Do not open any game files.
[your question]
```
No HTML touched. No CONTEXT.md update needed.

---

## HUB PAGE (build after 2+ games)

```
Read _scaffold/COVERAGE.md.
Build mrfavors-algebra/index.html as a navigation hub page.
Not a game. Navigation only — links to all SHIPPED games.
Each game card: name, tagline, standard covered.
Links to: https://dariusjfavors-eng.github.io/mrfavors-algebra/[gamefolder]/
Single-file HTML, vanilla JS, Google Fonts only, mobile responsive.
No localStorage, no Sheets, no tracking.
Visual direction: [describe — e.g. "dark theme, game cards with colored borders, professional"]
```

---

## EMBEDDING IN GOOGLE SITES

1. Open your Google Site (DOE account)
2. Open the page for this game
3. Insert → Embed
4. URL: https://dariusjfavors-eng.github.io/mrfavors-algebra/[gamefolder]/
5. Width: 100% | Height: 700px
6. Insert → Publish
7. Test on a Chromebook

---

## PROMPT CHEAT SHEET

SESSION START:
```
Read _scaffold/CONTEXT.md. Game: [NAME] at [FOLDER]/index.html.
No [STABLE] changes. Confirm [what I'm working on] status first.
```

BUG:
```
Bug: [what happens] vs [what should happen].
Cause only. Changed function only. Don't touch unrelated functions.
```

VISUAL:
```
CSS and SVG only. No JS. No game logic. No localStorage. No ARIA changes.
[describe change]
```

FEATURE:
```
Add [feature]. Before code: list functions touched, [STABLE] risks,
new localStorage fields (check FERPA_RULES.md if any).
Show diffs only.
```

SESSION END:
```
_scaffold/CONTEXT.md section 8: [component] = [status], [date].
Section 11: [filename], [what changed]. Nothing else.
```

SWITCH GAMES:
```
Switching to [GAME] at [FOLDER]/index.html.
Update _scaffold/CONTEXT.md for this game. Confirm status.
```

---

## QUICK REFERENCE

FIX BUG:         Type 1 → opener → bug prompt → diff → test → end → push
VISUAL:          Type 1 → opener → visual prompt → test → end → push
NEW FEATURE:     Type 1 → opener → feature prompt → diff → test → end → push
NEW GAME:        Type 2 → plan → brief → sheet → prompt → test → context → coverage → push
PLAN ONLY:       Type 3 → standards + coverage → no files touched
SHIP:            update COVERAGE.md → push → embed in Sites
HUB PAGE:        after 2+ games → hub prompt → push → embed
BROKEN:          check CONTEXT.md → runPuzzleTests → fix one thing
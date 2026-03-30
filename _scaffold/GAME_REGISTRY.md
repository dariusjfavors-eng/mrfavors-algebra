# GAME_REGISTRY.md — Algebra 1 Game Suite Registry
> This is the master list of all games: shipped, in-progress, and planned.
> Update this file whenever a game reaches a new milestone.
> Use this as the source of truth when expanding the Google Site.

---

## SITE STRUCTURE MAP

```
Google Site — Algebra 1 Learning Suite (DOE Domain)
│
├── /algebra1 (landing page)
│   └── Suite overview + navigation cards
│
├── /polynomials
│   ├── Junkyard Algebra          ← A-APR.1 (like terms, distribution, FOIL)
│   └── Alchemist's Apprentice   ← A-APR.1 (AC/X factoring)
│
├── /equations (planned)
│   ├── Balance Breaker           ← A-REI.3
│   └── Equation Forge            ← A-CED.1
│
├── /quadratics (planned)
│   ├── Zero Hunter               ← A-SSE.3a, A-REI.4b
│   └── [Quadratic Formula game]  ← A-REI.4b
│
├── /functions (planned)
│   ├── Function Machine          ← F-IF.1
│   └── Graph Lab                 ← F-IF.7a
│
└── /teacher
    └── Teacher notes + standards alignment PDF
```

---

## SHIPPED GAMES

---

### 🟢 Game 1: Junkyard Algebra
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | ✅ SHIPPED                                         |
| Standard      | NYS Algebra 1 — A-APR.1                           |
| Mechanic      | 5-tier progression: like terms → distribution →    |
|               | stacked polynomials → FOIL → mixed synthesis       |
| Architecture  | Single-file HTML, vanilla JS, localStorage         |
| Storage Key   | `junkyardProgress`                                 |
| PII           | None — fully anonymous                             |
| Google Site   | /polynomials                                       |
| Embed Code    | `<iframe src="[URL]" width="100%" height="700px" frameborder="0"></iframe>` |
| Context File  | `junkyard-algebra/CONTEXT.md`                      |
| Known Issues  | None active                                        |
| Last Updated  | [date]                                             |

---

### 🟢 Game 2: The Alchemist's Apprentice: Factor Fusion
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | ✅ SHIPPED                                         |
| Standard      | NYS Algebra 1 — A-APR.1                           |
| Mechanic      | AC/X-Method — find factor pair (p,q) where        |
|               | p×q = a×c and p+q = b; 6-level progression        |
| Architecture  | Single-file HTML, vanilla JS, localStorage         |
| Storage Key   | `alchemistSession`                                 |
| PII           | None — anonymous sessionId only                   |
| Google Site   | /polynomials                                       |
| Embed Code    | `<iframe src="[URL]" width="100%" height="700px" frameborder="0"></iframe>` |
| Context File  | `alchemist-factor-fusion/CONTEXT.md`              |
| Fonts         | Cinzel 700/900 + Inter 400/600/700                |
| Theme         | Alchemy lab — dark navy, teal, gold, purple        |
| Levels        | 1 Sandbox → 2 Negatives → 3 Backwards →           |
|               | 4 Frenzy (timed) → 5 Boss → Regents Boss          |
| Gamification  | Coins, shop, achievements (11), streak/fire mode  |
| Teacher View  | In-game summary screen + CSV download             |
| Known Issues  | None active                                        |
| Last Updated  | [date]                                             |

---

### 🟢 Game 3: Mr. Favors' Connections: Exhaustive Regents Edition
| Field         | Value                                                                          |
|---------------|--------------------------------------------------------------------------------|
| Status        | ✅ SHIPPED                                                                     |
| Version       | 2.0                                                                            |
| Author        | Darius J. Favors ☘️                                                           |
| Standards     | NYS NGLS Algebra 1 — N-RN.3, N-Q.1/2, S-ID.1–9,                             |
|               | A-CED.1–4, A-REI.1a/3/6a/7a, F-IF.1–9,                                       |
|               | F-BF.1a/3a, F-LE.1–5, A-APR.1, A-SSE.2/3c                                    |
| Mechanic      | NYT Connections-style: find 4 groups of 4 items                               |
|               | sharing a math connection; 7 levels + boss                                     |
| Architecture  | Single-file HTML, vanilla JS, no localStorage                                  |
| Storage Key   | None                                                                           |
| PII           | None — no data collection                                                      |
| Google Site   | /connections (planned embed)                                                   |
| URL           | https://dariusjfavors-eng.github.io/mrfavors-algebra/connections/              |
| Embed Code    | `<iframe src="https://dariusjfavors-eng.github.io/mrfavors-algebra/connections/" width="100%" height="800px" frameborder="0"></iframe>` |
| Context File  | connections/CONTEXT.md                                                         |
| Design Brief  | connections/DESIGN_BRIEF.md                                                    |
| Fonts         | Lexend Mega 700/900 + Lexend 400/600/800                                       |
| Theme         | Neo-brutalist light — #FDFBF7 bg, #111111 borders                             |
| Levels        | L1 Number & Qty → L2 Equations → L3 Linear →                                 |
|               | L4 Systems → L5 Factoring → L6 Stats → L7 Boss                               |
| Boss Level    | isCapstone:true — aggregates all 49 categories                                |
| Replayability | Random draw of 4/N categories per play                                        |
| Validation    | 4×16 truth matrix engine + collision guard                                    |
| Debug Tool    | window.validateCategories() in browser console                                |
| Known Issues  | See connections/CONTEXT.md section 8                                          |
| Last Updated  | 2026-03-30                                                                    |

---

## IN DEVELOPMENT

*(None currently — update when a game enters active development)*

---

## PLANNED GAMES (Priority Order)

---

### 🔵 Game 3: Zero Hunter
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | 🔵 PLANNED                                        |
| Priority      | HIGH                                               |
| Standard      | A-SSE.3a, A-REI.4b                               |
| Prerequisite  | Alchemist's Apprentice (factoring fluency)        |
| Mechanic      | After factoring, tap the x-intercepts on a        |
|               | number line to find the zeros                     |
| Theme         | TBD — hunting/exploration metaphor                |
| Design notes  | Requires SVG-based number line component           |
|               | Must work in single-file HTML without Chart.js    |
| Estimated LOE | Medium — number line interaction is new component |

---

### 🔵 Game 4: Balance Breaker
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | 🔵 PLANNED                                        |
| Priority      | HIGH                                               |
| Standard      | A-REI.3                                           |
| Mechanic      | Balance scale — perform same operation to both    |
|               | sides via tile drag; solve for x                  |
| Theme         | Forge / scales of justice metaphor                |
| Design notes  | Two-column layout with animated balance beam      |
|               | Operations as draggable tiles                     |
| Estimated LOE | Medium-High — balance animation is complex        |

---

### 🔵 Game 5: Function Machine
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | 🔵 PLANNED                                        |
| Priority      | HIGH                                               |
| Standard      | F-IF.1                                            |
| Mechanic      | Input value enters a machine; student identifies  |
|               | the rule (f(x) = ?) from multiple outputs         |
| Theme         | Industrial machine / factory                      |
| Design notes  | Animated "machine" SVG with conveyor belt feel    |
| Estimated LOE | Low-Medium                                        |

---

### 🔵 Game 6: Equation Forge
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | 🔵 PLANNED                                        |
| Priority      | MEDIUM                                             |
| Standard      | A-CED.1                                           |
| Mechanic      | Word problem → drag to build the equation          |
|               | → solve                                           |
| Theme         | Blacksmith / crafting metaphor                    |
| Design notes  | Word problem text must be accessible (large font, |
|               | high contrast). Equation builder uses tile drag.  |
| Estimated LOE | High — word problem generation is complex         |

---

### 🔵 Game 7: Graph Lab
| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Status        | 🔵 PLANNED                                        |
| Priority      | MEDIUM                                             |
| Standard      | F-IF.7a                                           |
| Mechanic      | Match equation to graph; identify zeros, vertex,  |
|               | axis of symmetry by clicking on graph             |
| Theme         | Science lab                                        |
| Design notes  | SVG coordinate plane — no external charting libs  |
|               | Must handle quadratic and linear graphs           |
| Estimated LOE | High — coordinate plane is the most complex UI    |

---

## GOOGLE SITE EXPANSION CHECKLIST

When adding a new game to the Google Site:

```
[ ] Game is fully tested at 1024×768 (Chromebook resolution)
[ ] Game is tested inside a Google Sites iframe (not just standalone)
[ ] FERPA_RULES.md checklist passed
[ ] Context file created and CONTEXT.md updated
[ ] STANDARDS.md updated with coverage status
[ ] GAME_REGISTRY.md updated (status, embed code, storage key)
[ ] localStorage key is unique and documented here
[ ] Teacher summary / CSV export tested
[ ] Accessibility: keyboard nav, ARIA labels, SR announce tested
[ ] Tested on mobile (students use phones for homework)
```

---

## EMBED CODE TEMPLATE

```html
<!-- Standard Google Sites embed — copy and adjust URL and height -->
<iframe
  src="YOUR_GITHUB_PAGES_OR_DRIVE_URL_HERE"
  width="100%"
  height="700px"
  frameborder="0"
  scrolling="no"
  title="[Game Name] — NYS Algebra 1 [Standard]"
  allow="autoplay"
></iframe>
```

**Height guide:**
- Games with fixed layout (no scrolling): `700px`
- Games with scrollable content: `800px–900px`
- Always test in the actual Google Sites editor after embedding

---

## HOSTING REGISTRY

| Game                        | Host            | URL                        | Updated    |
|-----------------------------|-----------------|----------------------------|------------|
| Junkyard Algebra            | [TBD]           | [TBD]                                                              | [date]     |
| Alchemist's Apprentice      | [TBD]           | [TBD]                                                              | [date]     |
| Mr. Favors' Connections     | GitHub Pages    | https://dariusjfavors-eng.github.io/mrfavors-algebra/connections/ | 2026-03-30 |

*(Fill in URLs when games are deployed)*
# DESIGN_SYSTEM.md — Algebra Game Suite Visual & Interaction Language
> Every new game MUST reference this file before writing any CSS or HTML.
> Deviations require a documented reason in that game's CONTEXT.md.
> Consistency across games is what makes this feel like a suite, not a
> collection of disconnected experiments.

---

## 1. PHILOSOPHY

These games are built for NYC DOE classroom use — they run on aging Chromebooks,
must be readable under fluorescent lighting, and must feel engaging enough to
compete with TikTok for a 14-year-old's attention for 8 minutes.

**Design commitments:**
- Dark theme by default — reduces eye strain, hides the "school computer" feel
- Game aesthetic, not worksheet aesthetic — students should feel like they're
  doing something, not answering questions
- Every mechanic should have a physical metaphor (cauldron, junkyard, forge)
- Feedback is immediate and visceral — sound, animation, color all fire at once
- Accessibility is non-negotiable — ARIA labels, focus management, keyboard nav

---

## 2. COLOR PALETTE

These CSS custom properties are the single source of truth.
Copy them verbatim into every new game's `:root` block.

```css
:root {
  /* Backgrounds */
  --c-bg:       #080c17;   /* Page background — deep navy-black        */
  --c-surface:  #111827;   /* Card / panel surface                     */
  --c-surface2: #1c2840;   /* Inset surface, secondary panels          */
  --c-navy:     #0d1520;   /* Darkest accent surface                   */

  /* Brand / Accent */
  --c-teal:     #2ab8b8;   /* Primary interactive color (borders, CTA) */
  --c-gold:     #f5c842;   /* Reward, titles, highlights               */
  --c-coin:     #f5c842;   /* Coin displays (alias of gold)            */

  /* Semantic */
  --c-success:  #38c172;   /* Correct answers, unlocked states         */
  --c-error:    #e53e3e;   /* Wrong answers, danger actions, boss       */
  --c-warn:     #f6ad55;   /* Partial credit, hints, timer urgent       */

  /* Text */
  --c-text:     #e8eeff;   /* Primary text                             */
  --c-muted:    #7a8fb5;   /* Secondary text, labels, placeholders     */

  /* Game-specific (override per game) */
  --c-bottle:   #c084d1;   /* Alchemist: potion bottle color           */
                           /* Override this per cosmetic unlock         */

  /* Layout */
  --radius:     10px;
  --shadow:     0 6px 24px rgba(0,0,0,.7);
}
```

**Color usage rules:**
- Never use `--c-error` for anything other than wrong/danger
- Never use `--c-success` before the student has submitted an answer
- `--c-gold` is for achievement/reward only — not general decoration
- Background colors must maintain ≥ 4.5:1 contrast ratio with `--c-text`

---

## 3. TYPOGRAPHY

### Font Stack

```css
/* Display / Headers — game titles, level names, card headers */
font-family: 'Cinzel', serif;
/* Weights used: 700 (headers), 900 (titles, large numbers) */

/* Body / UI — all other text */
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', sans-serif;
/* Weights used: 400 (body), 600 (labels), 700 (values, buttons) */
```

### Google Fonts Import (copy into every `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### Type Scale

```css
/* Game title (hero) */
font-size: clamp(1.4rem, 4vw, 2.4rem);
font-family: 'Cinzel', serif;
font-weight: 900;
letter-spacing: 2px;
/* Apply gold gradient text:
   background: linear-gradient(135deg, var(--c-warn) 0%, var(--c-gold) 60%, #fff8d0 100%);
   -webkit-background-clip: text; -webkit-text-fill-color: transparent; */

/* Screen / card headers */
font-family: 'Cinzel', serif;
font-size: 1.3rem–1.5rem;
color: var(--c-gold);

/* Large game numbers (X-board values, scores) */
font-size: clamp(2rem, 6vw, 3rem);
font-weight: 900;
color: var(--c-text);

/* Body copy */
font-size: 0.9rem–1rem;
line-height: 1.6;
color: var(--c-muted);

/* Labels / badges / metadata */
font-size: 0.7rem–0.8rem;
text-transform: uppercase;
letter-spacing: 1px;
color: var(--c-muted);
```

---

## 4. COMPONENT LIBRARY

### Buttons

```css
/* Base */
.btn {
  border-radius: var(--radius);
  padding: 0.65rem 1.4rem;
  font-weight: 700;
  font-size: 0.9rem;
  min-height: 44px;       /* Touch target — never go below 44px */
  letter-spacing: .5px;
  transition: transform .12s, box-shadow .12s, opacity .12s;
}
.btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Variants */
.btn--primary  { background: var(--c-teal);    color: #fff;  }
.btn--danger   { background: var(--c-error);   color: #fff;  }
.btn--ghost    { background: transparent; border: 1.5px solid var(--c-muted); }
.btn--warn     { background: var(--c-warn);    color: #111;  }
.btn--gold     { background: var(--c-gold);    color: #111;  }

/* Icon button (circular) */
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--c-surface); border: 1.5px solid var(--c-surface2);
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
}
```

**Rule:** All interactive elements must have `min-height: 44px` for touch targets.

### Cards

```css
/* Standard card */
.card {
  background: var(--c-surface);
  border: 2px solid var(--c-teal);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,.7),
              inset 0 1px 0 rgba(255,255,255,.04);
}

/* Danger/boss variant — swap border to --c-error */
/* Achievement/reward variant — swap border to --c-coin */
```

### Feedback Messages

```css
/* Full-screen centered overlay for answer feedback */
position: fixed; top: 50%; left: 50%;
transform: translate(-50%, -50%);
font-size: clamp(1rem, 3vw, 1.3rem);
font-weight: 900;
padding: 1rem 2rem; border-radius: 10px;
animation: feedbackPop .2s ease;

/* Correct  */ { background: rgba(0,30,0,.9);  color: var(--c-success); border: 2px solid var(--c-success); }
/* Partial  */ { background: rgba(30,20,0,.9); color: var(--c-warn);    border: 2px solid var(--c-warn);    }
/* Incorrect*/ { background: rgba(30,0,0,.9);  color: var(--c-error);   border: 2px solid var(--c-error);   }
```

---

## 5. ANIMATION VOCABULARY

Every animation in the suite falls into one of these named categories.
Reuse the names and timing — don't invent new keyframe names for the same concept.

| Name            | Use case                        | Duration  |
|-----------------|---------------------------------|-----------|
| `feedbackPop`   | Answer feedback message appears | 0.2s ease |
| `popIn`         | Modal/overlay enters            | 0.3s ease |
| `slideInRight`  | Achievement toast enters        | 0.4s ease |
| `cauldronSparkle`| Correct answer on game object  | 0.8s      |
| `cauldronShake` | Wrong answer on game object     | 0.6s      |
| `cauldronBubble`| Partial answer on game object   | 0.8s loop |
| `idleGlow`      | Selectable tile ambient pulse   | 2s loop   |
| `fireEffect`    | On-fire tile state              | 0.35s alt |
| `fireGlow`      | Streak meter on-fire state      | 0.5s alt  |
| `twinkle`       | Background star field           | 3s loop   |
| `orbDrift`      | Background ambient orbs         | 18–25s alt|
| `liquidBob`     | Decorative game object idle     | 2s loop   |
| `smokeFloat`    | Particle effect upward drift    | 2s loop   |
| `pulse`         | Urgent state (timer < 10s)      | 0.5s alt  |
| `fadeIn`        | Hint text or info box appears   | 0.3s ease |
| `victoryGlow`   | Boss/win screen glow            | 1s alt    |

**Rules:**
- Wrong answer always uses shake/error
- Correct answer always uses sparkle/success
- Partial always uses bubble/warn
- Animations on game objects must not block input — use CSS only, no JS delays
  on UI during animation

---

## 6. AMBIENT BACKGROUND SYSTEM

Every game uses this two-layer ambient system — it creates depth without images.

```html
<!-- Layer 1: Star field (JS-generated) -->
<div id="stars" aria-hidden="true"></div>

<!-- Layer 2: Floating orbs (CSS only) -->
<div class="orb orb-1" aria-hidden="true"></div>
<div class="orb orb-2" aria-hidden="true"></div>
<div class="orb orb-3" aria-hidden="true"></div>
```

```css
/* Orb CSS — adjust colors per game theme */
.orb {
  position: fixed; border-radius: 50%; filter: blur(80px);
  pointer-events: none; z-index: 0;
  animation: orbDrift var(--orb-dur, 20s) ease-in-out infinite alternate;
}
.orb-1 { width:400px; height:400px; background:rgba(42,184,184,.07);
          top:-10%; left:-10%; --orb-dur:22s; }
.orb-2 { width:300px; height:300px; background:rgba(245,200,66,.05);
          bottom:10%; right:-5%; --orb-dur:18s; }
.orb-3 { width:200px; height:200px; background:rgba(192,132,209,.06);
          top:40%; left:30%; --orb-dur:25s; }
```

**Per-game theming:** Change orb RGBA colors to match the game's accent color.
Alchemist uses teal/gold/purple. Future games can shift to other hues.

---

## 7. SCREEN MANAGEMENT PATTERN

```css
.screen { display: none; min-height: 100vh; flex-direction: column; align-items: center; }
.screen.active { display: flex; }
```

```js
// Standard showScreen function — copy into every game
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
```

---

## 8. ACCESSIBILITY REQUIREMENTS [NON-NEGOTIABLE]

Every game must include:

```html
<!-- Screen reader announcement region -->
<div id="srAnnounce" class="sr-only" role="status"
     aria-live="polite" aria-atomic="true"></div>
```

```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

**Checklist for every interactive element:**
- `aria-label` on all icon buttons
- `aria-pressed` on toggle/selectable tiles
- `aria-live` on feedback regions
- `aria-modal="true"` + `role="dialog"` on all overlays
- Focus trap on modals (`trapFocus` / `releaseFocus` pattern from Alchemist)
- Keyboard navigation (arrow keys for tile banks, Enter/Space for selection)
- `focus-visible` outline: `outline: 3px solid var(--c-warn); outline-offset: 2px;`

---

## 9. AUDIO CONVENTIONS

Web Audio API only — no audio files, no external libraries.

**Sound event mapping (apply consistently across all games):**
| Event            | Sound Type        | Notes                          |
|------------------|-------------------|--------------------------------|
| Correct answer   | Rising arpeggio   | 3-4 ascending tones            |
| Wrong answer     | Descending tones  | 3 tones, descending pitch      |
| Partial credit   | Triple ping       | Same pitch, 3 quick pulses     |
| Item selected    | Quick glide down  | Single oscillator, 0.3s        |
| Streak / fire    | Flourish          | 3 tones, ascending             |
| Background music | Simple loop       | 4-note sequence, 500ms tempo   |
| Fire mode music  | Same loop, 2×speed| 250ms tempo                    |

**Tab visibility rule:** Always pause audio (music + timer) when
`document.visibilitychange` fires with `document.hidden === true`.
Resume on return.

---

## 10. RESPONSIVE BREAKPOINTS

```css
/* Mobile first — default styles target 320px–480px */

@media (max-width: 480px) {
  /* Tighten tile sizes, font sizes, slot dimensions */
}

@media (min-width: 768px) {
  /* More padding, slightly larger game areas */
}
```

**Max content width:** `700px` for game areas, `600px` for grids/banks.
Always `width: 100%` with `max-width` — never fixed pixel widths on containers.

---

## 11. GOOGLE SITES IFRAME RULES

When embedding in Google Sites:
- Use `width="100%" height="700px"` on the iframe
- Set `frameborder="0"` and `scrolling="no"` if the game is designed
  to fit one viewport height
- Test at 1024×768 (common Chromebook resolution)
- Avoid `position: fixed` elements that depend on the full viewport —
  in an iframe, the viewport is the iframe, which is correct behavior
- Glossary sidebar (`translateX` slide-in) works fine in iframes
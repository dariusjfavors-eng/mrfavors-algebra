# DESIGN_BRIEF_TEMPLATE.md
# Copy this file into your game folder as DESIGN_BRIEF.md.
# Fill in ALL brackets before pasting NEW_GAME_PROMPT.md into Claude Code.
# This file defines the look and feel. DESIGN_SYSTEM.md defines the rules.
# Claude reads this file to design the visual language. Be specific.

---

## GAME IDENTITY
Name: [FULL GAME NAME — e.g. "Mr. Favors' Balance Breaker"]
Tagline: [one sentence, e.g. "Master solving linear equations by keeping the scale balanced"]
Standards: [from STANDARDS.md — e.g. A.REI.3, A.CED.1]
Player action: [what does the student physically do? e.g. "drag operation tiles to both sides of a scale"]

---

## VISUAL THEME
Setting: [the world this game takes place in — e.g. "a medieval blacksmith forge", "an underwater lab", "a neon arcade"]
Metaphor: [the core physical object — e.g. "balance scale", "forge hammer", "arcade machine"]
Mood: [e.g. "focused and industrial", "playful and colorful", "mysterious and ancient"]
Reference: [describe 2-3 images or aesthetics that inspire this — e.g. "pixel art RPG forge, warm orange glow, dark iron textures"]

---

## COLOR PALETTE (all 6 required)
Background:   [hex — e.g. #0a0a14 for dark, #1a0a2e for purple, #0a1a0a for forest]
Surface:      [hex — card/panel color, should be 15-20% lighter than background]
Surface2:     [hex — inset panels, slightly lighter than surface]
Primary:      [hex — main interactive color, replaces --c-teal from Alchemist]
Accent:       [hex — reward/gold color, replaces --c-gold from Alchemist]
Text:         [hex — primary text, must be light enough for dark backgrounds]
Muted:        [hex — secondary text, labels]
Success:      [hex — correct answer]
Error:        [hex — wrong answer]
Warning:      [hex — partial credit, hints]

Note: These replace the CSS custom property names in the build.
Claude will map them to --c-bg, --c-surface, --c-teal etc.
You are just picking the values. The structure stays the same.

---

## TYPOGRAPHY
Display font: [Google Font name for headers/titles — e.g. "Cinzel", "Press Start 2P", "Playfair Display", "Oswald"]
Body font:    [Google Font name for UI text — e.g. "Inter", "Lato", "Nunito", "Space Mono"]
Math font:    [Usually monospace — e.g. "Courier New", "Space Mono", "Roboto Mono"]

---

## GAME OBJECT (the interactive element students click)
What is the game object? [e.g. "forge hammer striking an anvil", "scale pans", "test tubes", "playing cards"]
Shape: [e.g. "tall and narrow", "round", "rectangular with rounded corners", "irregular"]
Color source: [does color convey information? e.g. "each tile is a different potion color" or "tiles change color based on correctness"]
Selected state: [what happens visually when student selects one? e.g. "glows gold and lifts up", "flips face up", "ignites"]

---

## BACKGROUND SCENES
Title screen scene: [describe what the player sees behind the menu — e.g. "a warm blacksmith shop with an anvil and glowing forge in the background, brick walls, scattered metal tools"]
Game screen scene: [describe what sits behind the gameplay — e.g. "a dark cave with glowing lava cracks on the floor, stone pillars with iron brackets"]
Boss screen: [describe the boss/victory background — e.g. "a massive forge with multiple fires blazing, dramatic orange light"]

---

## FEEDBACK ANIMATIONS
Correct: [what happens? e.g. "anvil sparks and rings", "scale balances with a satisfying click", "explosion of stars"]
Wrong: [what happens? e.g. "scale tilts wildly", "hammer misses and clangs", "shake with red glow"]
Partial: [what happens? e.g. "scale wobbles but doesn't balance", "soft buzz"]
On fire (streak 10+): [how does the game look when student is on a streak?]

---

## SOUND CHARACTER
Overall sound feel: [e.g. "industrial metallic clangs", "soft magical tones", "8-bit arcade blips"]
Correct sound: [describe the feel, not the frequency — e.g. "a triumphant rising chord", "three quick bell tones"]
Wrong sound: [e.g. "a heavy clang downward", "a buzzer"]

---

## UNIQUE MECHANIC NOTES
[Any interaction specific to this game that differs from Alchemist.
Examples:
- "The scale has two pans that physically tilt based on equation state"
- "Student drags tiles rather than clicks them"
- "There is a central board that student fills in step by step"
- "Multiple correct paths exist, student chooses one"]

---

## WHAT TO REUSE FROM ALCHEMIST (check all that apply)
[X] Storage module (anonymous localStorage)
[X] Sheets module (Apps Script POST)
[X] Audio module (Web Audio API)
[X] trapFocus / releaseFocus
[X] Feedback message system (#feedbackMsg)
[X] Achievement popup (#achievementPopup)
[X] Settings modal (font size, mute, reset)
[X] Star field ambient background
[X] Screen management pattern
[X] SR announce region
[ ] Cauldron component (Alchemist-specific, do not reuse)
[ ] X-Board component (Alchemist-specific, do not reuse)
[ ] Bottle tile system (Alchemist-specific, do not reuse)

---

## NOTES FOR CLAUDE
[Anything else you want Claude to know before designing this game.
Be specific. Examples:
- "Students are 9th graders, keep language accessible"
- "This game will be used as an intro activity, so Level 1 must be very gentle"
- "The boss level should feel dramatically different from the regular levels"
- "I want the shop to sell different color schemes for the forge, not just bottles"]
# FERPA_RULES.md — NYC DOE / FERPA / AIMEE Compliance
> Review this file before adding ANY feature that involves:
> storage, network requests, user input, third-party scripts,
> or anything that could touch student identity.
> When in doubt: don't store it.

---

## 1. YOUR COMPLIANCE POSTURE (CURRENT)

The Alchemist's Apprentice and Junkyard Algebra are currently:

✅ **FERPA-safe by architecture** — no PII is collected, stored, or transmitted.

| Requirement          | Status | How it's met                                   |
|----------------------|--------|------------------------------------------------|
| No student PII       | ✅     | SessionID is `anon_<timestamp>` — no name/ID  |
| No external data     | ✅     | No API calls during gameplay                   |
| No analytics/tracking| ✅     | No GA, no pixels, no telemetry                 |
| No login/accounts    | ✅     | localStorage only, no auth                     |
| Data stays on device | ✅     | localStorage is browser-local, never sent      |
| Teacher CSV export   | ✅     | Anonymous aggregate — no student identifiers   |
| No 3rd party scripts | ✅     | Google Fonts only (style asset, no tracking)   |

---

## 2. ABSOLUTE RULES — NEVER VIOLATE

```
NEVER store:
  - Student names
  - Student OSIS numbers
  - Student email addresses
  - Class period / section identifiers linked to individuals
  - School/teacher name paired with student identifier
  - IP addresses
  - Device fingerprints
  - Biometric data (including typing patterns)

NEVER call during gameplay:
  - Any external API (Anthropic, OpenAI, Google, etc.)
  - Any analytics endpoint (Google Analytics, Mixpanel, etc.)
  - Any CDN that sets tracking cookies

NEVER use:
  - Third-party login (Google Sign-In, Clever, etc.) without DOE approval
  - sessionStorage for student work if it contains any identifier
  - Cookies (stick to localStorage with anonymous keys)
```

---

## 3. APPROVED DATA KEYS — localStorage

These keys are explicitly approved for use. Any new key must be reviewed
against the rules in Section 2 before implementation.

```
alchemistSession     — Alchemist's Apprentice game state (see CONTEXT.md)
junkyardProgress     — Junkyard Algebra game state (see Junkyard CONTEXT.md)
```

**Approved fields within session objects:**
```
sessionId:            "anon_<timestamp>"     ← anonymous, no user link
level:                integer
streak:               integer
coins:                integer
stats:                aggregate counts only (no per-answer timestamps)
unlockedCosmetics:    string array
achievements:         string array (achievement IDs, not student names)
soundMuted:           boolean
musicMuted:           boolean
createdAt:            timestamp (no user link)
lastPlayed:           timestamp (no user link)
hintsRemaining:       object
dailyCoins:           integer
dailyCoinsDate:       locale date string (no user link)
tutorialSeen:         boolean
levelsCompleted:      string array
fontSize:             integer
```

**Fields that are NEVER approved:**
```
studentName, osis, email, classId, teacherName, userId, googleId
```

---

## 4. TEACHER SUMMARY — COMPLIANCE NOTES

The in-game teacher summary and CSV export are compliant because:
- They aggregate performance data (accuracy, attempts, hints) per level
- They are keyed to an anonymous `sessionId` — not to any student
- The CSV is downloaded to the local device — never uploaded anywhere
- A teacher using this must manually correlate a device to a student
  by asking the student — the app itself never does that correlation

**If you ever add a "enter your name" feature:**
→ Stop. Read this file. That single field breaks FERPA compliance.
→ If a name field is needed for classroom context, the teacher must
  maintain the device-to-student mapping externally (e.g., on paper
  or in a private Google Sheet they own).

---

## 5. GOOGLE SITES HOSTING — COMPLIANCE NOTES

Hosting via Google Sites under the DOE Google Workspace domain is the
safest path because:
- Content is within the DOE's own managed environment
- DOE has a data processing agreement (DPA) with Google
- Students access via their DOE Google accounts (managed by DOE)
- No additional vendor agreement needed

**Hosting options ranked by compliance safety:**

| Option                    | Compliance Risk | Notes                                 |
|---------------------------|-----------------|---------------------------------------|
| Google Sites (DOE domain) | ✅ Lowest       | Within DOE's DPA with Google          |
| GitHub Pages (public)     | ✅ Very Low     | No student data processed by GitHub   |
| Cloudflare Pages          | ✅ Very Low     | No student data processed; review ToS |
| Google Drive (published)  | ✅ Low          | Within DOE domain if shared correctly |
| Replit                    | ⚠️ Review       | No DOE DPA; do not store student data |
| Any server you control    | ⚠️ Complex      | Requires school's InfoSec approval    |
| Vercel / Netlify          | ⚠️ Review       | No DOE DPA; review before using       |

---

## 6. AI TOOL USAGE — NYC DOE AIMEE POLICY

The DOE's AI guidance (AIMEE framework) requires:

**DO:**
- Use Claude Code / AI editors to write and generate code — this is fine
- Use AI to debug, refactor, and improve the HTML/JS files
- Use AI to generate pedagogical content (problem sets, hint text)
  when that content does not contain real student data

**DO NOT:**
- Paste real student work, names, or scores into any AI prompt
- Use AI tools to analyze, summarize, or process student performance data
- Integrate AI APIs into the student-facing game without DOE approval
- Use AI-generated content that was trained on student data from your school

**The bright line:** Claude Code generates your code. That code runs in
students' browsers. Claude never sees the students or their responses.

---

## 7. FUTURE FEATURE COMPLIANCE CHECKLIST

Before implementing any new feature, answer these questions:

```
[ ] Does this feature collect any new data field?
    If yes → review against Section 2 before writing a line of code.

[ ] Does this feature make a network request?
    If yes → what endpoint? What data is sent? Is there a DOE DPA?

[ ] Does this feature involve student names, emails, or IDs?
    If yes → STOP. Consult your school's data privacy officer first.

[ ] Does this feature use a third-party library or CDN?
    If yes → does that CDN set cookies or collect analytics?

[ ] Does this feature involve Google Classroom API?
    If yes → you need DOE-approved OAuth scopes and your Google Site
    must be within the DOE Workspace domain. Consult IT.

[ ] Does this feature store data across students (leaderboard, class view)?
    If yes → data must be aggregate and anonymous, or stored by the
    teacher on their own device only.
```

---

## 8. INCIDENT RESPONSE

If you accidentally build something that stores PII:
1. Do not deploy it
2. Clear localStorage in all test browsers: `localStorage.clear()`
3. Remove the PII field from the code immediately
4. If any PII was ever in a deployed version, notify your school's
   data privacy officer — do not self-remediate silently

---

## 9. ANNUAL REVIEW

Review this file at the start of each school year.
NYC DOE policies update regularly. Check:
- https://www.schools.nyc.gov/school-life/technology/internet-safety
- DOE's AIMEE AI guidance (updated as of 2024-2025 school year)
- Any new vendor agreements your school has signed
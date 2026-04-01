# COVERAGE.md — Game-to-Standard Map
# This is the ONLY file updated when a game ships.
# Format: GAME | STANDARDS_COVERED | STATUS | FILE | STORAGE_KEY
# Status: SHIPPED / PLANNED / IN_DEV

Junkyard Algebra        | A.APR.1                                    | SHIPPED  | junkyard_algebra.html      | junkyardProgress
Alchemist Factor Fusion | A.APR.1                                    | SHIPPED  | alchemist_factor_fusion.html | alchemistSession
Mr. Favors Connections  | N-RN.3, N-Q.1/2, S-ID.1–9, A-CED.1–4, A-REI.1a/3/6a/7a, F-IF.1–9, F-BF.1a/3a, F-LE.1–5, A-APR.1, A-SSE.2/3c | SHIPPED | connections/index.html | connections_player · connections_count · connections_session
Mr. Favors' Wordle      | A-SSE.1a, A-SSE.2, A-APR.1 (Unit 7 vocab fluency)            | SHIPPED  | wordle/index.html          | mrfavors_wordle_session
Balance Breaker         | A.CED.1,A.CED.2,A.CED.3,A.CED.4,A.REI.1,A.REI.3,A.REI.6 | PLANNED | — | —
Function Machine        | F.IF.1,F.IF.2,F.IF.4,F.IF.5,F.IF.6        | PLANNED  | —                          | —
Zero Hunter             | A.REI.4,F.IF.8a                            | PLANNED  | —                          | —
Data Detective          | S.ID.7,S.ID.8,S.ID.9                       | PLANNED  | —                          | —
Sequence Forge          | F.IF.3,F.BF.1,F.BF.1a                      | PLANNED  | —                          | —

## GAP QUERY
# To find all Wt=5 Pri=Y standards with no shipped game:
# Cross-reference STANDARDS.md Wt=5 Pri=Y rows against SHIPPED entries above.
# Any standard code not appearing in a SHIPPED row = uncovered high-priority gap.
# Current Wt=5 Pri=Y uncovered: A.REI.4
# COVERAGE.md — Game-to-Standard Map
# This is the ONLY file updated when a game ships.
# Format: GAME | STANDARDS_COVERED | STATUS | FILE | STORAGE_KEY
# Status: SHIPPED / PLANNED / IN_DEV

Junkyard Algebra        | A.APR.1                                    | SHIPPED  | junkyard_algebra.html      | junkyardProgress
Alchemist Factor Fusion | A.APR.1                                    | SHIPPED  | alchemist_factor_fusion.html | alchemistSession
Balance Breaker         | A.CED.1,A.CED.2,A.CED.3,A.CED.4,A.REI.1,A.REI.3,A.REI.6 | PLANNED | — | —
Function Machine        | F.IF.1,F.IF.2,F.IF.4,F.IF.5,F.IF.6        | PLANNED  | —                          | —
Zero Hunter             | A.REI.4,F.IF.8a                            | PLANNED  | —                          | —
Data Detective          | S.ID.7,S.ID.8,S.ID.9                       | PLANNED  | —                          | —
Sequence Forge          | F.IF.3,F.BF.1,F.BF.1a                      | PLANNED  | —                          | —

## GAP QUERY
# To find all Wt=5 Pri=Y standards with no shipped game:
# Cross-reference STANDARDS.md Wt=5 Pri=Y rows against SHIPPED entries above.
# Any standard code not appearing in a SHIPPED row = uncovered high-priority gap.
# Current Wt=5 Pri=Y uncovered: A.CED.1-4, A.REI.1,3,6, F.IF.1,2,4,5,6,
#   F.IF.3, F.BF.1,1a, A.REI.4, S.ID.7,8,9
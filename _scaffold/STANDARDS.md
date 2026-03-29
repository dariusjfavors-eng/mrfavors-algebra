# STANDARDS.md — NYS Algebra 1 Game Suite
# Source: Favors Tracker (full regents-aligned standard set)
# Format: CODE | Weight | Priority | Unit | Error1 | Error2 | Coverage
# Weight 1-5 (5=highest regents frequency) | Priority Y/N
# Coverage: SHIPPED / PLANNED / OPEN


## ERROR TAG LEGEND
# CALC=CALCULATION_ERROR  MULTI=MULTI_STEP_REASONING  UNITS=UNITS_CONTEXT
# GRAPH=GRAPHING_ERROR    INEQ=INEQUALITY_DIRECTION   DOMAIN=DOMAIN_RANGE
# TABLE=TABLE_TO_EQUATION INVERSE=INVERSE_OPS         FUNC=FUNCTION_NOTATION


## DASHBOARD: 50 total | 2 shipped | 5 planned | 43 open


---
## U1 — QUANTITIES & DATA


| Code   |Wt|Pri| Errors       | Context                       |Coverage|
|--------|--|---|--------------|-------------------------------|--------|
|N.RN.3  | 2| N | CALC,MULTI   | Rational vs Irrational        | OPEN   |
|N.Q.1   | 3| Y | UNITS,CALC   | Units and Measurement         | OPEN   |
|N.Q.2   | 3| Y | UNITS,DOMAIN | Defining Modeling Variables   | OPEN   |
|N.Q.3   | 2| N | CALC,UNITS   | Precision and Rounding        | OPEN   |
|S.ID.1  | 1| N | GRAPH,CALC   | Box Plots / Histograms        | OPEN   |
|S.ID.2  | 1| N | CALC,MULTI   | Center and Spread Mean/SD/IQR | OPEN   |
|S.ID.3  | 1| N | MULTI,UNITS  | Outliers and Shape            | OPEN   |


---
## U2 — EQUATIONS, INEQUALITIES & SYSTEMS


| Code    |Wt|Pri| Errors        | Context                       |Coverage|
|---------|--|---|---------------|-------------------------------|--------|
|A.CED.1  | 5| Y | INEQ,CALC     | Creating Linear Equations     | OPEN   |
|A.CED.2  | 5| Y | TABLE,CALC    | Graphing Linear Relationships | OPEN   |
|A.CED.3  | 5| Y | DOMAIN,MULTI  | Systems/Inequality Constraints| OPEN   |
|A.CED.4  | 5| Y | INVERSE,CALC  | Rearranging Formulas          | OPEN   |
|A.REI.1  | 5| Y | MULTI,INVERSE | Properties of Equality        | OPEN   |
|A.REI.3  | 5| Y | INEQ,INVERSE  | Solving Multi-Step Linear Eq  | OPEN   |
|A.REI.5  | 2| N | CALC,INVERSE  | Systems by Elimination        | OPEN   |
|A.REI.6  | 4| Y | CALC,MULTI    | Systems Substitution/Graphing | OPEN   |
|A.REI.12 | 3| N | GRAPH,INEQ    | Graphing Linear Inequalities  | OPEN   |


Critical error pattern: INEQ — sign flip when dividing by negative


---
## U3 — BIVARIATE DATA & STATISTICS


| Code    |Wt|Pri| Errors      | Context                       |Coverage|
|---------|--|---|-------------|-------------------------------|--------|
|S.ID.5   | 3| N | CALC,UNITS  | Two-Way Frequency Tables      | OPEN   |
|S.ID.6   | 3| N | GRAPH,CALC  | Scatter Plot Trends           | OPEN   |
|S.ID.6a  | 3| N | GRAPH,MULTI | Line of Best Fit Modeling     | OPEN   |
|S.ID.6b  | 3| N | GRAPH,MULTI | Residual Analysis             | OPEN   |
|S.ID.6c  | 3| N | CALC,UNITS  | Linear Regression Equations   | OPEN   |
|S.ID.7   | 5| Y | UNITS,CALC  | Interpreting Slope/Intercept  | OPEN   |
|S.ID.8   | 5| Y | CALC,MULTI  | Correlation Coefficient r     | OPEN   |
|S.ID.9   | 5| Y | MULTI,UNITS | Correlation vs Causation      | OPEN   |


---
## U4 — FUNCTIONS


| Code    |Wt|Pri| Errors       | Context                        |Coverage|
|---------|--|---|--------------|--------------------------------|--------|
|A.REI.10 | 3| N | GRAPH,CALC   | Solutions on Coordinate Plane  | OPEN   |
|A.REI.11 | 3| N | GRAPH,CALC   | Intersection f(x)=g(x)         | OPEN   |
|F.IF.1   | 5| Y | DOMAIN,MULTI | Definition of a Function       | OPEN   |
|F.IF.2   | 5| Y | FUNC,CALC    | Evaluating Function Notation   | OPEN   |
|F.IF.4   | 5| Y | UNITS,GRAPH  | Key Features of Graphs         | OPEN   |
|F.IF.5   | 5| Y | DOMAIN,UNITS | Real-World Domain and Range    | OPEN   |
|F.IF.6   | 5| Y | CALC,UNITS   | Average Rate of Change         | OPEN   |
|F.IF.9   | 3| N | MULTI,CALC   | Comparing Multiple Functions   | OPEN   |


---
## U5 — LINEAR & EXPONENTIAL FUNCTIONS


| Code    |Wt|Pri| Errors      | Context                        |Coverage|
|---------|--|---|-------------|--------------------------------|--------|
|F.IF.3   | 5| Y | MULTI,CALC  | Arithmetic/Geometric Sequences | OPEN   |
|F.IF.7a  | 1| N | GRAPH,CALC  | Graphing Quadratic Functions   | OPEN   |
|F.BF.1   | 5| Y | MULTI,CALC  | Building Function Rules        | OPEN   |
|F.BF.1a  | 5| Y | TABLE,CALC  | Recursive and Explicit Formulas| OPEN   |
|F.LE.1   | 3| N | MULTI,UNITS | Linear vs Exponential Growth   | OPEN   |
|F.LE.1a  | 3| N | MULTI,UNITS | Constant Differences vs Ratios | OPEN   |
|F.LE.1b  | 3| N | TABLE,CALC  | Exponential Percent Growth     | OPEN   |
|F.LE.1c  | 3| N | TABLE,CALC  | Exponential Decay Models       | OPEN   |
|F.LE.2   | 3| Y | TABLE,CALC  | Constructing Exponential Funcs | OPEN   |
|F.LE.3   | 3| N | MULTI,GRAPH | Exponential vs Polynomial      | OPEN   |
|F.LE.5   | 3| N | UNITS,MULTI | Parameters in f(x)=a(b)^x     | OPEN   |


---
## U6 — QUADRATIC FUNCTIONS & TRANSFORMATIONS


| Code    |Wt|Pri| Errors        | Context                         |Coverage|
|---------|--|---|---------------|---------------------------------|--------|
|F.IF.7   | 3| N | GRAPH,DOMAIN  | Graphing Abs Value/Step Funcs   | OPEN   |
|F.IF.7b  | 1| N | GRAPH,CALC    | Graphing Piecewise Functions    | OPEN   |
|F.IF.8   | 3| N | MULTI,INVERSE | Std/Vertex/Factored Forms       | OPEN   |
|F.IF.8a  | 3| N | CALC,INVERSE  | Quadratic Zeros and Vertices    | OPEN   |
|F.BF.3   | 1| N | GRAPH,MULTI   | Transformations Shifts/Stretches| OPEN   |


---
## U7 — QUADRATIC EQUATIONS


| Code     |Wt|Pri| Errors       | Context                      |Coverage|
|----------|--|---|--------------|------------------------------|--------|
|A.REI.4   | 5| Y | CALC,INVERSE | Solving Quadratic Equations  | OPEN   |
|A.REI.4a  | 1| N | CALC,MULTI   | Completing the Square        | OPEN   |
|A.REI.4b  | 1| N | CALC,INVERSE | Quadratic Formula & Radicals | OPEN   |


---
## SHIPPED GAMES


### Junkyard Algebra
Standards: A.APR.1
Mechanic: Like terms→distribution→stacked poly→FOIL→mixed synthesis
Tiers: 5 | File: junkyard_algebra.html | Storage: junkyardProgress


### Mr. Favors' Alchemist's Apprentice: Factor Fusion
Standards: A.APR.1
Mechanic: AC/X-Method — find p,q where p×q=a×c AND p+q=b
Error targets: CALC (wrong pair), INVERSE (sign flip → PARTIAL_SIGN_ERROR)
Levels: Sandbox→Negatives→Backwards→Frenzy→Boss→Regents Boss
File: alchemist_factor_fusion.html | Storage: alchemistSession


---
## BUILD PRIORITY QUEUE (Wt=5 Pri=Y first)


1. PLANNED — Balance Breaker: A.CED.1/2/3/4 + A.REI.1/3/6 (U2 cluster)
2. PLANNED — Function Machine: F.IF.1/2/4/5/6 (U4 cluster)
3. PLANNED — Zero Hunter: A.REI.4 + F.IF.8a (prereq: Factor Fusion)
4. PLANNED — Data Detective: S.ID.7/8/9 (U3 cluster)
5. PLANNED — Sequence Forge: F.IF.3 + F.BF.1/1a (U5 cluster)


---
## TAGGING CONVENTION
# Tag every JS function in every game file:
# // [A.CED.1] equation generation from context
# Enables: grep -r "A.CED.1" . to find all coverage across suite


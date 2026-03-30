/* ============================================================
   SHEETS MODULE — [GAME NAME]
   Fire-and-forget POST to Master Apps Script.
   Payload is fully anonymous. No names, no IDs, no device data.
   Silent failure with localStorage retry queue.
   ============================================================ */
const Sheets = {
  URL: 'https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec',
  _queue: [],

  send(payload) {
    // Always stamp these fields before sending
    payload.gameName     = '[GAME_NAME_KEY]'; // must match GAME_HEADERS key exactly
    payload.sessionId    = Storage.get().sessionId || ('anon_' + Date.now());
    payload.timeOnTask   = payload.timeOnTask || 0;
    payload.sessionComplete = payload.sessionComplete !== undefined
                             ? payload.sessionComplete : true;

    this._dispatch(payload);

    // Retry any previously failed sends
    if (this._queue.length > 0) {
      const queued = [...this._queue];
      this._queue = [];
      queued.forEach(p => this._dispatch(p));
    }
  },

  _dispatch(payload) {
    fetch(this.URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      this._queue.push(payload);
      // Persist queue to localStorage so retry survives page reload
      try {
        localStorage.setItem('sheetsQueue_[GAME_NAME_KEY]',
          JSON.stringify(this._queue));
      } catch(e) {}
    });
  },

  // Call this once on game init to retry any queued sends from prior sessions
  flushQueue() {
    try {
      const stored = localStorage.getItem('sheetsQueue_[GAME_NAME_KEY]');
      if (stored) {
        this._queue = JSON.parse(stored);
        localStorage.removeItem('sheetsQueue_[GAME_NAME_KEY]');
        if (this._queue.length > 0) {
          const queued = [...this._queue];
          this._queue = [];
          queued.forEach(p => this._dispatch(p));
        }
      }
    } catch(e) {}
  }
};
```

---

## Step 5: Game-by-Game Claude Code Prompts

Paste each of these into Claude Code **one game at a time**. Replace `[YOUR_MASTER_URL]` with your actual deployment URL in each prompt.

---

### Junkyard Algebra
```
Read junkyard/index.html fully. Do not modify any game logic, puzzle 
generation, audio, or visual code. Your only job is adding a Sheets 
data layer.

ADD this Sheets module after the Audio module:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  send(payload) {
    payload.gameName = 'JunkyardAlgebra';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
    if (this._queue.length > 0) {
      const q = [...this._queue]; this._queue = [];
      q.forEach(p => this._dispatch(p));
    }
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the triggerEndGame(success) function and the showChallengeComplete()
function. At the start of each, add a Sheets.send() call with this payload:

Sheets.send({
  mode:            G.mode,
  tier:            G.challengeTier || 1,
  roundsCompleted: G.challengeRound || 0,
  totalMerges:     G.mergeCount,
  totalScore:      G.score,
  wrong:           0,          // Junkyard doesn't track wrong separately — leave 0
  timeOnTask:      Math.round((Date.now() - G._sessionStart) / 1000),
  won:             success,
  sessionComplete: true
});

ALSO add G._sessionStart = Date.now() at the top of initMerge(), initSort(),
initExpr(), and initChallenge() to track time per session.

Show only the changed functions as a diff. Do not rewrite the full file.
```

---

### Mr. Favors Wordle
```
Read wordle/index.html fully. Do not modify any game logic or visual code.
Add a Sheets data layer only.

ADD this Sheets module in the <script> block after the dictionary constant:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'MrFavorsWordle';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the triggerEndGame(success) function.
At the start of it, add:

Sheets.send({
  targetWord:      targetWord,
  guessCount:      currentRow,
  maxGuesses:      maxAttempts,
  hintsUsed:       document.getElementById('btn-hint').disabled ? 1 : 0,
  won:             success,
  timeOnTask:      Math.round((Date.now() - Sheets._startTime) / 1000),
  sessionComplete: true
});

Also reset Sheets._startTime = Date.now() inside the resetGame() function.

Show only changed functions as a diff.
```

---

### Meme Race
```
Read meme_race/index.html fully. Do not modify game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback, 
after the generateNewProblem() function:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  _wrongCount: 0,
  _attemptCount: 0,
  send(payload) {
    payload.gameName = 'MemeRace';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the checkPrediction() function.
1. At every wrong answer branch: increment Sheets._wrongCount++ and 
   Sheets._attemptCount++
2. At the correct answer branch, increment Sheets._attemptCount++, then add:

Sheets.send({
  correctDay:      currentSolutionDay,
  studentGuess:    userPrediction,
  attemptCount:    Sheets._attemptCount,
  wrongAttempts:   Sheets._wrongCount,
  timeTaken:       Math.round((Date.now() - Sheets._startTime) / 1000),
  solved:          true,
  won:             true,
  sessionComplete: true
});

FIND the resetGame() function (inside resetButton click handler).
At the top of it, if a game was in progress and unsolved, send:

Sheets.send({
  correctDay:      currentSolutionDay,
  studentGuess:    null,
  attemptCount:    Sheets._attemptCount,
  wrongAttempts:   Sheets._wrongCount,
  timeTaken:       Math.round((Date.now() - Sheets._startTime) / 1000),
  solved:          false,
  won:             false,
  sessionComplete: true
});
Then reset: Sheets._startTime = Date.now(); Sheets._wrongCount = 0; 
Sheets._attemptCount = 0;

Show only changed functions as a diff.
```

---

### Function Challenges (NYC Function Challenges)
```
Read function_challenge/index.html fully. Do not modify game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _sessionId: 'anon_' + Date.now(),
  send(payload) {
    payload.gameName = 'FunctionChallenges';
    payload.sessionId = Sheets._sessionId;
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the showFeedback() function. After it renders feedback, check if 
isCorrect is true and call:

Sheets.send({
  scenario:        element.id.replace('-feedback',''),  // e.g. 'subway', 'bike'
  questionType:    isCorrect ? 'correct' : 'wrong',
  correct:         isCorrect ? 1 : 0,
  attempts:        1,
  wrongAttempts:   isCorrect ? 0 : 1,
  timeTaken:       0,
  sessionComplete: true,
  won:             isCorrect
});

Show only the changed showFeedback function as a diff.
```

---

### Birthday Function
```
Read birthday_function/index.html fully. Do not modify game logic or visuals.
This file has nearly identical structure to function_challenge/index.html.
Apply the exact same Sheets data layer as function_challenge but with:
  payload.gameName = 'BirthdayFunction';

Show only changed functions as a diff.
```

---

### Combo Builder
```
Read combo_master/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module after the State object definition:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'ComboBuilder';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the goToSummary() function. Before it calls render(), add:

Sheets.send({
  phaseReached:    State.phaseIndex + 1,
  totalTasks:      State.sessionTotal,
  correctFirstTry: State.sessionCorrect,
  totalWrong:      State.sessionTotal - State.sessionCorrect,
  streakTotal:     State.streakHits.filter(Boolean).length,
  timeOnTask:      Math.round((Date.now() - Sheets._startTime) / 1000),
  won:             State.phasesCompleted.length === PHASES.length,
  sessionComplete: true
});

Also reset Sheets._startTime = Date.now() inside the State.reset() call
path when the player clicks Play Again.

Show only changed functions as a diff.
```

---

### Algebra Blaster
```
Read alg_blaster/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module after the gameState variables:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'AlgebraBlaster';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the triggerGameOver(reason) function. At the start of it, add:

Sheets.send({
  levelReached:    level,
  finalScore:      score,
  termsCollected:  collectedTerms.length,
  fuelOnExit:      Math.round(fuel),
  timeOnTask:      Math.round((Date.now() - Sheets._startTime) / 1000),
  won:             false,
  sessionComplete: true
});

FIND the checkAnswer() function. In the correct answer branch (if correct),
add before the level reset:

Sheets.send({
  levelReached:    level,
  finalScore:      score,
  termsCollected:  collectedTerms.length,
  fuelOnExit:      Math.round(fuel),
  timeOnTask:      Math.round((Date.now() - Sheets._startTime) / 1000),
  won:             true,
  sessionComplete: true
});

Reset Sheets._startTime = Date.now() inside the startGame() function.

Show only changed functions as a diff.
```

---

### Linear Sim (Slope-Intercept Graphing Simulator)
```
Read linear_sim/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback, 
after the appState object:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'LinearSim';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the showModal() function. At the start of it, add:

Sheets.send({
  slope:             currentEquation.m,
  intercept:         currentEquation.b,
  stepsCompleted:    appState.step,
  pointsPlotted:     appState.plottedPoints.length,
  finalAnswerCorrect: true,
  timeOnTask:        Math.round((Date.now() - Sheets._startTime) / 1000),
  won:               true,
  sessionComplete:   true
});

Reset Sheets._startTime = Date.now() inside the loadNewProblem() function.

Show only changed functions as a diff.
```

---

### Pirate Treasure
```
Read pirate_treasure/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module in the <script> block after the game state variables:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  _step1: false,
  _step2: false,
  _step3: false,
  _attempts: 0,
  send(payload) {
    payload.gameName = 'PirateTreasure';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the handleCheckStep1() function. When answer is correct, set 
Sheets._step1 = true.

FIND the handlePlotLine2() function. When mCorrect && bCorrect, set 
Sheets._step2 = true.

FIND the handleCheckSolution() function.
- On every call increment Sheets._attempts++
- On correct answer (x === solution.x && y === solution.y), set 
  Sheets._step3 = true, then call:

Sheets.send({
  step1Correct:     Sheets._step1,
  step2Correct:     Sheets._step2,
  step3Correct:     true,
  solutionAttempts: Sheets._attempts,
  solved:           true,
  won:              true,
  timeOnTask:       Math.round((Date.now() - Sheets._startTime) / 1000),
  sessionComplete:  true
});

FIND the generateNewProblem() function. At the top, if Sheets._attempts > 0
(meaning a prior game was in progress), send the unsolved session first:

if (Sheets._attempts > 0) {
  Sheets.send({
    step1Correct:     Sheets._step1,
    step2Correct:     Sheets._step2,
    step3Correct:     Sheets._step3,
    solutionAttempts: Sheets._attempts,
    solved:           false,
    won:              false,
    timeOnTask:       Math.round((Date.now() - Sheets._startTime) / 1000),
    sessionComplete:  true
  });
}
Then reset: Sheets._startTime=Date.now(); Sheets._step1=Sheets._step2=
Sheets._step3=false; Sheets._attempts=0;

Show only changed functions as a diff.
```

---

### Safe Cracker
```
Read safe_cracker/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback,
after the currentTotals state variables:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'SafeCracker';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the checkAnswer() function (the one that checks 
studentAnswer vs correctAnswer).

On correct answer branch, add:
Sheets.send({
  mode:         challengeMode ? 'challenge' : 'normal',
  correctX2:    correctAnswer.x2,
  correctX:     correctAnswer.x,
  correctY:     correctAnswer.y,
  correctConst: correctAnswer.const,
  studentX2:    studentAnswer.x2,
  studentX:     studentAnswer.x,
  studentY:     studentAnswer.y,
  studentConst: studentAnswer.const,
  totalScore:   0,
  won:          true,
  timeOnTask:   Math.round((Date.now() - Sheets._startTime) / 1000),
  sessionComplete: true
});

On incorrect answer branch, add the same call but with won: false.

Reset Sheets._startTime = Date.now() inside the initGame() function.

Show only changed functions as a diff.
```

---

### Slope Race
```
Read slope_race/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback,
after the leaderboard variables:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  send(payload) {
    payload.gameName = 'SlopeRace';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the advanceLevel(completedLevel) function.
When completedLevel === 3 (all levels done), before stopTimer() add:

Sheets.send({
  l1Stars:          levelProgress[1],
  l2Stars:          levelProgress[2],
  l3Stars:          levelProgress[3],
  allLevelsComplete: true,
  finalTime:        Math.floor((Date.now() - startTime) / 1000),
  won:              true,
  sessionComplete:  true
});

Show only changed functions as a diff.
```

---

### Rocket Sim
```
Read rocket_sim/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback,
after the stepData and stepAttempts variables:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  send(payload) {
    payload.gameName = 'RocketSim';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the simulateLaunch() function. At the point where landing result is
evaluated (after the rocket lands and xCorrect/yCorrect are determined), add:

Sheets.send({
  stepsCompleted:     stepData.filter((_,i) => {
                        const inp = document.getElementById('step-input-'+i);
                        return inp && inp.disabled;
                      }).length,
  totalSteps:         stepData.length,
  solutionX:          currentSystem.solution.x,
  solutionY:          currentSystem.solution.y,
  finalAnswerCorrect: xCorrect && yCorrect,
  landingAccuracy:    xCorrect ? 'on-target' : (guessX < solution.x ? 'overshoot' : 'undershoot'),
  timeOnTask:         Math.round((Date.now() - Sheets._startTime) / 1000),
  won:                xCorrect && yCorrect,
  sessionComplete:    true
});

Reset Sheets._startTime = Date.now() inside the generateNewProblem() function.

Show only changed functions as a diff.
```

---

### XY Challenge
```
Read xy_challenge/index.html fully. Do not modify any game logic or visuals.
Add a Sheets data layer only.

ADD this Sheets module inside the DOMContentLoaded callback,
after the gameState object:

const Sheets = {
  URL: '[https://script.google.com/macros/s/AKfycbz4W7Wq2X5ywfA2AYvsNRvRpUgDMwEfmFptyI1qgxKQXmgA6oV1RKH5I3LVBBKxY40J/exec]',
  _queue: [],
  _startTime: Date.now(),
  _domainCorrect: 0,
  _rangeCorrect:  0,
  _pointCorrect:  0,
  _problems:      0,
  send(payload) {
    payload.gameName = 'XYChallenge';
    payload.sessionId = 'anon_' + Date.now();
    this._dispatch(payload);
  },
  _dispatch(payload) {
    fetch(this.URL, {
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).catch(() => this._queue.push(payload));
  }
};

FIND the handleCorrectNormalAnswer(type) function.
Inside it: if type === 'Domain' increment Sheets._domainCorrect++;
           if type === 'Range'  increment Sheets._rangeCorrect++;
Increment Sheets._problems++ on every correct normal answer.

FIND the checkChallengeAnswer() function.
In the correct branch, send:

Sheets.send({
  problemsAttempted:  Sheets._problems,
  domainCorrect:      Sheets._domainCorrect,
  rangeCorrect:       Sheets._rangeCorrect,
  pointCorrect:       Sheets._pointCorrect,
  challengeComplete:  true,
  timeOnTask:         Math.round((Date.now() - Sheets._startTime) / 1000),
  won:                true,
  sessionComplete:    true
});

FIND the checkPointAnswer() function.
In the all-checks-passed branch: Sheets._pointCorrect++;

Reset all Sheets counters and Sheets._startTime inside the generateProblem()
function when gameState.correctAnswers resets to 0.

Show only changed functions as a diff.
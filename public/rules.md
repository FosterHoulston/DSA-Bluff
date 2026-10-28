# DSA Bluff

A real-time party game for **2–8 players**. Solve short interview-style coding puzzles, spot convincing bugs, and earn points by misleading other players.

## Setup

- Join from your own device using a **room code**.
- Choose a DSA topic playlist or a mixed set.
- Each round has one **Bluffer**; everyone else is a **Solver**.
- The Bluffer role rotates evenly. A standard game lasts **one full rotation**. Choose two rotations for a longer session.

## The puzzles

Each puzzle includes:

- A **1–2 sentence problem statement** describing the objective and relevant constraints. Statements use common interview-pattern cues in clear language.
- A compact **Python code snippet** with **1–4 numbered, highlighted blanks**.
- Answer options containing a **complete set of replacements** for every blank. Players choose one whole option.

Each puzzle has exactly **one correct option**. Incorrect options contain plausible mistakes involving boundaries, conditions, updates, or other DSA implementation details.

## 1. Shared reading

Every round starts with **30 seconds** for everyone to read the problem statement and essential constraints together. Code and answer options are hidden from all players during this phase. Reading ends automatically; no points are at stake.

## 2. Bluffer selection

The Bluffer privately sees four unlabeled completion options, including the correct solution.

Their goal is to select an option that is **incorrect but convincing enough to fool Solvers**.

- **1–2 blanks:** 90 seconds.
- **3–4 blanks:** 120 seconds.
- The selection locks when submitted.
- Everyone can see the code with blanks during this phase. Only the Bluffer sees answer options; Solvers can reason about the code while they wait.
- The phase ends early when the Bluffer locks their choice.

If the Bluffer selects the correct solution, they **lose 1 point and cannot earn any points that round**. This outcome remains hidden until the reveal.

If the Bluffer times out, the same penalty applies.

## 3. Solver selection

Solvers see the puzzle and four shuffled options:

- The correct solution.
- The Bluffer’s selected incorrect option.
- Two other incorrect options supplied by the game.

If the Bluffer selected the correct solution or timed out, the game supplies three incorrect options instead. Solvers score normally.

Each Solver independently selects the option that correctly fills **all blanks**. Tapping an option previews its replacements in the code; submitting locks the answer.

- **1–2 blanks:** 90 seconds.
- **3–4 blanks:** 120 seconds.
- Other players’ answers remain hidden until the reveal.
- Solvers receive a fresh full timer. This phase ends early when all Solvers lock their answers.

## 4. Scoring

### Bluffer

When the Bluffer selects a valid bluff:

**Points = round up (3 × Solvers fooled ÷ total Solvers)**

A Solver is “fooled” only if they select **the Bluffer’s chosen option**.

| Outcome | Bluffer points |
|---|---:|
| Nobody selects the bluff | 0 |
| At least one Solver selects the bluff | 1–3, using the formula |
| Bluffer selects the correct solution | −1; no earnings that round |
| Bluffer times out | −1; no earnings that round |

The maximum is **3 points per round**, regardless of party size. Solvers who choose another incorrect option or time out remain included in the total Solver count.

For example, with seven Solvers:

| Solvers fooled | Bluffer points |
|---|---:|
| 0 | 0 |
| 1–2 | 1 |
| 3–4 | 2 |
| 5–7 | 3 |

### Solvers

| Outcome | Solver points |
|---|---:|
| Select the correct solution | +2 |
| Select the Bluffer’s option | −1 |
| Select another incorrect option | −1 |
| Time out | −1 |

**Scores can go below zero.**

## 5. Reveal and learning

After all Solvers submit or time expires, the game reveals:

- The correct solution and completed code.
- The Bluffer’s selection.
- Each player’s answer and points earned or lost.
- A brief explanation connecting the problem’s cues to the DSA pattern.
- Why the incorrect options fail, with small counterexamples where useful.

The host advances after players have had time to read and discuss.

## 6. Winning

The game ends after the chosen number of full rotations, giving everyone the same number of turns as Bluffer.

**The player with the highest total score wins. Tied players share the win.**

## Untimed practice mode

The host can choose untimed practice when creating a room. Reading and both decision phases have no countdown or automatic timeout. The host advances from shared reading when the group is ready; the Bluffer locks a choice to start Solver selection, and all Solvers must submit to reach the reveal. Scoring and role rotation are unchanged, including the penalty for selecting a correct solution as the Bluffer. There are no timeout penalties in practice mode. The host still advances after discussion.

Blank count is a starting guide for decision time, rather than a guarantee of difficulty. A timed round allows up to 3½ minutes for 1–2 blanks or 4½ minutes for 3–4 blanks, before discussion.

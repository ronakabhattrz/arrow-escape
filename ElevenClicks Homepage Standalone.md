**ARROW ESCAPE**

*Clear the grid. No collisions. No timer.*

Product Spec & AI Build Prompt  |  v1.0  |  May 2026

| Field | Details |
| :---- | :---- |
| App Name | **Arrow Escape** |
| Inspired by | Arrows – Puzzle Escape (Lessmore GmbH) — 116K ratings, 4.8 stars |
| Genre | Minimalist logic puzzle / sliding arrow |
| Platform | iOS \+ Android (Capacitor Latest version \+ React 18 \+ TypeScript) |
| Session length | 1–5 minutes per level (scales with difficulty) |
| Monetization | Free \+ AdMob ads \+ Remove Ads IAP ($4.99) \+ Hints IAP ($0.99) |
| Your edge | Procedural level generator \+ daily puzzle \+ diagonal arrows (hard mode) |
| Build target | 8–10 weeks from init to App Store submission |
| Author | Ronak Bhatt |

# **1\. Concept & Game Overview**

Arrow Escape is a minimalist logic puzzle game. A grid is populated with arrows, each pointing in a direction (up, down, left, right). The player's goal is to slide each arrow out of the grid — in the correct order — without any two arrows crossing paths or colliding. The puzzle is solved when every arrow has escaped the grid.

There are no timers and no penalties for wrong moves — just a "heart" system that counts mistakes on each level. The satisfaction comes from planning the correct extraction sequence, similar to a sliding block puzzle but with directional constraints.

## **1.1 Core Mechanic in Detail**

1. A grid (e.g. 5x5, 6x6, or 7x7) is filled with arrows at various positions

2. Each arrow has a fixed direction: up (↑), down (↓), left (←), right (→)

3. Tapping an arrow slides it in its direction until it exits the grid edge

4. If another arrow is in its path, the move is INVALID — costs one heart

5. Player must find the correct extraction order so no arrow blocks another

6. Level is complete when all arrows have exited the grid

7. 3 hearts per level — lose all 3 \= level restart (or use a heart refill IAP)

## **1.2 Your Differentiation vs Original**

| Feature | Arrows – Puzzle Escape | Your Arrow Escape |
| :---- | :---- | :---- |
| Levels | Handcrafted only | Handcrafted \+ procedural generator |
| Arrow directions | 4 (up/down/left/right) | 4 standard \+ 4 diagonal in hard mode |
| Daily puzzle | Yes | Yes \+ shareable result card |
| Hint system | Yes (paid) | Yes — 5 free, then $0.99 for 20 more |
| Remove Ads | $9.99 one-time | $4.99 one-time (lower barrier) |
| Themes | Light \+ dark | Light, dark, sepia, forest (unlockable) |
| Streak system | Yes | Yes \+ streak freeze item |
| Grid sizes | Varies | 4x4, 5x5, 6x6, 7x7, 8x8 |

# **2\. Game Mechanics (Full Spec)**

## **2.1 Grid & Arrow Rules**

* Grid is an N×N square (N \= 4 to 8 depending on difficulty)

* Each cell can be: empty, or occupied by exactly one arrow

* Arrow has two properties: position (row, col) and direction (up/down/left/right)

* Standard mode: 4 directions only. Hard mode: adds 4 diagonals (up-left, up-right, down-left, down-right)

* When tapped: arrow slides in its direction, passing through empty cells, until it exits the grid boundary

* If any occupied cell lies in the arrow's path: move is BLOCKED — show a brief shake animation, cost 1 heart

* An arrow that has exited the grid is REMOVED from the board permanently

* Level complete: board is empty

## **2.2 Validity Check Algorithm**

Run this on every tap before animating:

function isValidMove(grid, arrow) {

  const { row, col, direction } \= arrow;

  const path \= getCellsInPath(grid, row, col, direction);

  // path \= all cells between arrow and grid edge in its direction

  return path.every(cell \=\> grid\[cell.row\]\[cell.col\] \=== null);

}

function getCellsInPath(grid, row, col, direction) {

  const cells \= \[\];

  let \[dr, dc\] \= directionOffset(direction); // e.g. up \= \[-1, 0\]

  let r \= row \+ dr, c \= col \+ dc;

  while (r \>= 0 && r \< grid.size && c \>= 0 && c \< grid.size) {

    cells.push({ row: r, col: c });

    r \+= dr; c \+= dc;

  }

  return cells;

}

## **2.3 Direction Offsets**

| Direction | Symbol | Row delta | Col delta |
| :---- | :---- | :---- | :---- |
| Up | ↑ | \-1 | 0 |
| Down | ↓ | \+1 | 0 |
| Left | ← | 0 | \-1 |
| Right | → | 0 | \+1 |
| Up-Left (hard) | ↖ | \-1 | \-1 |
| Up-Right (hard) | ↗ | \-1 | \+1 |
| Down-Left (hard) | ↙ | \+1 | \-1 |
| Down-Right (hard) | ↘ | \+1 | \+1 |

## **2.4 Heart System**

* Each level starts with 3 hearts (shown as icons in the HUD)

* Invalid move: lose 1 heart \+ shake animation on blocked arrow

* 0 hearts: level fails — show "Try Again" modal with option to restart or watch ad for 1 heart refill

* Complete level with 3 hearts intact: award 3-star rating

* Complete with 2 hearts: 2-star rating

* Complete with 1 heart: 1-star rating

* Stars affect level select screen display and unlock bonus themes

## **2.5 Hint System**

* Hint: highlights the next correct arrow to tap (glows blue for 2 seconds)

* Each player starts with 5 free hints total (not per level — global lifetime pool)

* Depleted hints: prompt IAP — 20 hints for $0.99

* Hint button in HUD, always visible but greyed out at 0 hints

* Daily puzzle: hints disabled (purity of the daily challenge)

## **2.6 Procedural Level Generator**

This is your key differentiator. Generates infinite valid levels so the game never runs out of content.

Algorithm:

8. Start with an empty N×N grid

9. Place K arrows at random positions (K \= 3 to 12 depending on difficulty)

10. For each arrow, assign a random direction

11. Validate that a solution exists: simulate all possible extraction orders using BFS/DFS

12. If no valid solution found: discard and regenerate

13. If solution found: store the level as { grid, solution, difficulty }

14. Difficulty scoring: number of arrows \+ grid size \+ whether any move requires 2+ prior extractions

function generateLevel(size, arrowCount) {

  let attempts \= 0;

  while (attempts \< 1000\) {

    const grid \= placeArrowsRandom(size, arrowCount);

    const solution \= findSolution(grid); // BFS over extraction orders

    if (solution) return { grid, solution, difficulty: scoreDifficulty(grid, solution) };

    attempts++;

  }

  return null; // fallback to handcrafted

}

# **3\. Screens & UX**

## **3.1 Screen List**

| \# | Screen | Purpose & Key Elements |
| :---- | :---- | :---- |
| 1 | Home | App logo, PLAY button, daily puzzle button, level count, settings icon. AdMob banner at bottom. |
| 2 | Level Select | Grid of levels 1–N. Each shows difficulty (easy/medium/hard), star rating (0–3), lock state. Paginated by chapter (every 20 levels). |
| 3 | Game Board | Full-screen grid. HUD: hearts (top-left), level number (top-centre), hint button (top-right), undo button. No timer. |
| 4 | Level Complete | Star rating (1–3), score, best score, NEXT LEVEL \+ HOME \+ REPLAY. AdMob interstitial fires every 3rd level complete. |
| 5 | Level Failed | 0 hearts reached. Options: Restart (free), Watch Ad for \+1 heart, or Home. |
| 6 | Daily Puzzle | One unique level per day (seeded from date). Shows streak counter. No hints. Share result card on complete. |
| 7 | Infinite Mode | Procedurally generated levels, no end. Player picks difficulty. Ad every 5 levels. |
| 8 | Settings | Theme selector, sound toggle, haptics toggle, remove ads IAP, restore purchases, privacy policy, version. |
| 9 | Stats | Total levels completed, best streak, total hints used, perfect levels (3-star), daily puzzle streak. |

## **3.2 Navigation Flow**

Home → Level Select → Game Board → Level Complete → \[Next Level | Home\]

Home → Daily Puzzle → Game Board → Level Complete → Share Card → Home

Home → Infinite Mode → Game Board → Level Complete → \[Next Procedural | Home\]

Game Board → Level Failed → \[Restart | Watch Ad | Home\]

## **3.3 AdMob Placement Rules**

* Banner: Home screen bottom only. Never on game board.

* Interstitial: Level Complete screen — fires every 3rd level completion (tracked via preferences)

* Rewarded ad: Level Failed screen — "Watch ad for \+1 heart" option

* Infinite Mode: interstitial every 5 procedural levels

* Remove Ads IAP ($4.99): removes ALL ads including banner, interstitials, and rewarded prompts

* Daily Puzzle: no ads at all

# **4\. Technical Stack**

## **4.1 Stack Overview**

| Layer | Technology | Notes |
| :---- | :---- | :---- |
| App shell | Capacitor Latest version | iOS \+ Android. Reuse Hydra project config. |
| UI \+ game | React 18 \+ TypeScript \+ Vite | Grid rendered as CSS grid or SVG. No canvas needed. |
| State | Zustand | gameStore, progressStore, settingsStore. |
| Routing | React Router v6 | 9 screens. Screen-level routes only. |
| Animation | Framer Motion | Arrow slide-out animation, shake on invalid, scale on complete. |
| Local storage | @capacitor/preferences | Level progress, stars, hints count, streak, run counter for ads. |
| Ads | @capacitor-community/admob | Banner \+ interstitial \+ rewarded. Disable all if removeAds=true. |
| IAP | @capacitor/in-app-purchase (or RevenueCat) | Remove Ads $4.99 one-time. Hints 20-pack $0.99. |
| Haptics | @capacitor/haptics | Light on valid tap, error pattern on invalid move. |
| Sound | Howler.js | Slide sound, error buzz, level complete chime. |
| Share | @capacitor/share | Daily puzzle result card share. |
| CI / Build | Xcode Cloud \+ Google Play CI | Reuse Hydra pipeline. |

## **4.2 Grid Rendering**

Two valid approaches — use CSS Grid (simpler) for v1:

Option A — CSS Grid (recommended for v1):

* Render the board as a CSS grid: display:grid; grid-template-columns: repeat(N, 1fr)

* Each cell is a \<div\> with a fixed size. Arrow cells render an arrow SVG icon inside.

* Arrow slide animation: use Framer Motion's layout animation or CSS transform translateX/Y

* Exiting arrow: animate to translateX/Y \= screen edge, then set display:none

Option B — SVG (cleaner animations):

* Full board as one \<svg\> element. Each arrow is a \<g\> group with a polygon arrowhead.

* Slide animation: SVG transform attribute animated via Framer Motion or GSAP.

* Better for diagonal arrows (hard mode) which are awkward in CSS grid.

Recommendation: CSS Grid for v1 (faster to build). Switch to SVG in v1.1 when adding diagonal arrows.

## **4.3 Level Data Format**

Each level stored as a JSON object:

{

  "id": 42,

  "size": 5,           // grid is 5x5

  "difficulty": 2,     // 1=easy, 2=medium, 3=hard

  "arrows": \[

    { "id": "a1", "row": 0, "col": 2, "dir": "right" },

    { "id": "a2", "row": 2, "col": 0, "dir": "down" },

    { "id": "a3", "row": 4, "col": 4, "dir": "up" }

  \],

  "solution": \["a2", "a1", "a3"\]  // correct extraction order

}

Handcrafted levels: stored in src/data/levels.json (ship 100 levels in v1.0)

Procedural levels: generated at runtime by levelGenerator.ts, not stored in file

Daily puzzle: seeded from date string — same seed \= same puzzle globally for all players on that date

## **4.4 Zustand Store Shape**

gameStore: {

  levelId: string,

  grid: Arrow\[\]\[\],           // current board state

  initialGrid: Arrow\[\]\[\],    // for undo/restart

  hearts: number,            // 0-3

  hintsRemaining: number,

  moveHistory: string\[\],     // arrow ids in tap order (for undo)

  isComplete: boolean,

  isFailed: boolean,

  levelCompleteCount: number, // for ad frequency

  tapArrow(id: string): void,

  useHint(): void,

  undoMove(): void,

  restartLevel(): void,

}

progressStore: {

  unlockedLevels: number,

  levelStars: Record\<string, number\>,  // levelId \-\> 0|1|2|3

  hintsOwned: number,

  removeAds: boolean,

  dailyStreak: number,

  lastDailyDate: string,

  totalCompleted: number,

}

## **4.5 Folder Structure**

arrow-escape/

  ├── android/

  ├── ios/

  ├── src/

  │   ├── game/

  │   │   ├── gameEngine.ts       ← isValidMove, getCellsInPath, checkComplete

  │   │   ├── levelGenerator.ts   ← procedural level generation \+ BFS solver

  │   │   ├── dailyPuzzle.ts      ← date-seeded deterministic level

  │   │   └── hintEngine.ts       ← find next valid move

  │   ├── screens/

  │   │   ├── HomeScreen.tsx

  │   │   ├── LevelSelect.tsx

  │   │   ├── GameBoard.tsx       ← main game screen

  │   │   ├── LevelComplete.tsx

  │   │   ├── LevelFailed.tsx

  │   │   ├── DailyPuzzle.tsx

  │   │   ├── InfiniteMode.tsx

  │   │   ├── Settings.tsx

  │   │   └── Stats.tsx

  │   ├── components/

  │   │   ├── ArrowCell.tsx       ← single arrow tile with direction icon

  │   │   ├── GridBoard.tsx       ← CSS grid board layout

  │   │   ├── HeartBar.tsx        ← 3-heart HUD display

  │   │   ├── HintButton.tsx

  │   │   └── ShareCard.tsx       ← daily puzzle result shareable image

  │   ├── store/

  │   │   ├── gameStore.ts

  │   │   ├── progressStore.ts

  │   │   └── settingsStore.ts

  │   ├── services/

  │   │   ├── admob.ts

  │   │   ├── iap.ts

  │   │   └── storage.ts

  │   ├── data/

  │   │   └── levels.json         ← 100 handcrafted levels

  │   └── assets/

  ├── capacitor.config.ts

  └── package.json

# **5\. Development Roadmap**

## **Phase 1 — Core Game Engine (Week 1–2)**

* Init Capacitor Latest version \+ React 18 \+ TypeScript \+ Vite project

* Build gameEngine.ts: isValidMove, getCellsInPath, directionOffset, checkComplete

* Render CSS grid board: GridBoard.tsx, ArrowCell.tsx with arrow SVG icons

* Tap-to-slide: valid move animates arrow off screen (Framer Motion translateX/Y)

* Invalid move: shake animation \+ lose 1 heart

* Heart system: HeartBar.tsx, 3 hearts per level

* Level complete detection: all cells empty

* Load first 10 handcrafted levels from levels.json

## **Phase 2 — Progression & Feel (Week 3–4)**

* Level Select screen: grid of levels, star ratings, lock/unlock

* Progress persistence: @capacitor/preferences — stars per level, unlocked count

* Undo button: revert last arrow tap (restore arrow at original position)

* Hint system: highlight next correct arrow for 2 seconds

* Sound: slide whoosh, error buzz, level complete chime (Howler.js)

* Haptics: light on valid, error pattern on invalid

* Level Complete screen: star rating reveal animation, next/home/replay

* Level Failed screen: restart / watch ad options

## **Phase 3 — Features & Monetization (Week 5–6)**

* Procedural level generator \+ BFS solver (levelGenerator.ts)

* Infinite Mode screen: pick difficulty, endless procedural levels

* Daily Puzzle: date-seeded level, streak counter, share card

* AdMob: banner (Home), interstitial (every 3rd level complete), rewarded (Level Failed)

* Remove Ads IAP ($4.99) via RevenueCat or @capacitor/in-app-purchase

* Hints IAP ($0.99 for 20 hints)

* Settings: themes (light/dark/sepia/forest), sound, haptics, restore purchases

## **Phase 4 — Polish & Launch (Week 7–8)**

* App icon: bold arrow graphic, minimal black/white palette

* Splash screen

* Ship 100 handcrafted levels across 5 difficulty chapters

* App Store screenshots: HTML/Playwright pipeline (reuse SWIPE workflow)

* Store listing: title "Arrow Escape — Puzzle Game", keywords: logic puzzle, arrow, sliding, brain teaser

* Privacy policy (required for AdMob)

* TestFlight \+ Google Play Internal Testing

* Submit iOS \+ Android

# **6\. AI Build Prompt (Copy → Paste → Build)**

Paste everything between START and END into Claude Code, Cursor, or any AI coding assistant. It contains everything needed to scaffold the full project in one shot.

**PROMPT START**

**You are building "Arrow Escape" — a minimalist logic puzzle mobile game for iOS and Android, inspired by Arrows – Puzzle Escape (116K ratings, 4.8 stars on App Store). Built with Capacitor Latest version \+ React 18 \+ TypeScript.**

TECH STACK:

* Capacitor Latest version (iOS \+ Android native shell)

* React 18 \+ TypeScript \+ Vite (strict mode)

* Zustand (state management)

* React Router v6 (9 screen routes)

* Framer Motion (arrow slide animation, shake on invalid, completion effects)

* @capacitor/preferences (local persistence)

* @capacitor-community/admob (banner \+ interstitial \+ rewarded ads)

* @capacitor/haptics (haptic feedback)

* Howler.js (sound effects)

* @capacitor/share (daily puzzle share card)

* RevenueCat Capacitor SDK (IAP: Remove Ads $4.99, Hints pack $0.99)

GAME CONCEPT:

A grid (N×N, N=4 to 8\) is filled with arrows. Each arrow has a direction (up/down/left/right). Tap an arrow to slide it in its direction — it moves until it exits the grid edge. If another arrow is in its path, the move is INVALID (costs a heart). Find the correct extraction order to clear the board. No timer. 3 hearts per level.

CORE GAME ENGINE (implement in src/game/gameEngine.ts):

15. directionOffset(dir): returns \[rowDelta, colDelta\] for each direction

16. getCellsInPath(grid, row, col, dir): returns all cells between arrow and grid edge in its direction

17. isValidMove(grid, arrow): returns true if path is clear (all cells null)

18. applyMove(grid, arrowId): removes arrow from board (it has exited), returns new grid state

19. checkComplete(grid): returns true if board has zero arrows remaining

20. Direction offsets: up=\[-1,0\], down=\[+1,0\], left=\[0,-1\], right=\[0,+1\]

LEVEL DATA FORMAT (src/data/levels.json):

* Each level: { id, size, difficulty (1/2/3), arrows: \[{id, row, col, dir}\], solution: \[arrowId, ...\] }

* Ship 100 handcrafted levels. First 20 are 4x4 easy, next 30 are 5x5 medium, next 30 are 6x6 hard, last 20 are 7x7 expert

* Generate 5 sample levels in the JSON to demonstrate the format, rest can be placeholder

PROCEDURAL LEVEL GENERATOR (src/game/levelGenerator.ts):

21. generateLevel(size, arrowCount): places arrows randomly, validates solution exists via BFS over extraction orders

22. BFS solver: state \= set of remaining arrow ids, try all valid moves at each step, find path to empty board

23. If no solution after 1000 attempts: return null (caller falls back to handcrafted)

24. Daily puzzle: seed from date string (YYYY-MM-DD) using simple seeded random — same date \= same puzzle globally

HINT ENGINE (src/game/hintEngine.ts):

25. findNextHint(grid, solution): returns the id of the next arrow that can be validly moved

26. Uses the pre-computed solution array if available, else runs BFS to find any valid move

SCREENS TO BUILD (9 total):

* HomeScreen: app title "Arrow Escape", tagline "Clear the grid. No collisions.", PLAY button, Daily Puzzle button (shows streak), Infinite Mode button, Stats icon, Settings icon. AdMob banner bottom.

* LevelSelect: paginated grid of level cards (20 per page/chapter). Each card shows: level number, star rating (0-3 filled stars), difficulty badge (E/M/H/X). Locked levels show padlock. Scroll or swipe between chapters.

* GameBoard: full-screen N×N CSS grid centred on screen. HUD top bar: HeartBar (3 hearts, top-left), level number (top-centre), hint button \+ count (top-right). Undo button (bottom-left). No timer. Arrow cells show direction with bold SVG arrow icon.

* LevelComplete: star rating reveal (1-3 stars animate in), score display, NEXT LEVEL \+ REPLAY \+ HOME buttons. AdMob interstitial fires here every 3rd completion (check progressStore.totalCompleted % 3 \=== 0).

* LevelFailed: "Out of hearts\!" message, RESTART button (free), WATCH AD button (+1 heart, rewarded ad), HOME button.

* DailyPuzzle: same as GameBoard but shows date, daily streak counter. No hints. No ads. On complete: show ShareCard and allow native share.

* InfiniteMode: difficulty picker (Easy/Medium/Hard), then GameBoard with procedural levels. Ad every 5 completions.

* Settings: theme selector (Light/Dark/Sepia/Forest — 4 CSS themes), sound toggle, haptics toggle, Remove Ads IAP button, Restore Purchases, privacy policy link, version number.

* Stats: total levels completed, 3-star levels count, daily streak, longest streak, total hints used, total invalid moves.

ZUSTAND STORES:

* gameStore: { levelId, grid (Arrow\[\]\[\]), initialGrid, hearts, hintsRemaining, moveHistory, isComplete, isFailed, levelCompleteCount, tapArrow(id), useHint(), undoMove(), restartLevel(), loadLevel(levelData) }

* progressStore: { unlockedLevels, levelStars: Record\<string,number\>, hintsOwned, removeAds, dailyStreak, lastDailyDate, totalCompleted, totalInvalidMoves } — ALL persisted to @capacitor/preferences on change

* settingsStore: { theme, soundEnabled, hapticsEnabled } — persisted to @capacitor/preferences

ARROW CELL COMPONENT (ArrowCell.tsx):

* Renders a square div with centred SVG arrow icon pointing in the arrow's direction

* On tap: calls gameStore.tapArrow(id)

* If valid: Framer Motion animate to translateX/Y \= off-screen in direction, then remove from DOM

* If invalid: Framer Motion shake animation (x: \[0, \-8, 8, \-8, 8, 0\], 300ms) \+ red flash

* Hint state: pulsing blue glow (CSS keyframe animation on box-shadow)

CSS THEMES (apply as data-theme attribute on \<body\>):

* Light (default): bg \#FFFFFF, grid bg \#F8F8F8, cell border \#E0E0E0, arrow color \#1A1A2E

* Dark: bg \#1A1A2E, grid bg \#16213E, cell border \#0F3460, arrow color \#FFFFFF

* Sepia: bg \#FDF6E3, grid bg \#F5EFDC, cell border \#C8B89A, arrow color \#5C4033

* Forest: bg \#E8F5E9, grid bg \#C8E6C9, cell border \#81C784, arrow color \#1B5E20

ADMOB RULES:

* Banner: Home screen only (bottom). Import and show on HomeScreen mount.

* Interstitial: LevelComplete — fire when progressStore.totalCompleted % 3 \=== 0

* Rewarded: LevelFailed — "Watch ad for \+1 heart". On reward: gameStore.hearts \+= 1, resume game.

* Remove all ad calls when progressStore.removeAds \=== true

* Add TODO comments for all Ad Unit IDs (separate iOS/Android)

IAP (via RevenueCat):

* Product 1: arrow\_escape\_remove\_ads — one-time purchase $4.99. Sets progressStore.removeAds \= true.

* Product 2: arrow\_escape\_hints\_20 — consumable $0.99. Adds 20 to progressStore.hintsOwned.

* Restore purchases button in Settings.

ANIMATIONS (all via Framer Motion):

* Arrow slide out: animate({ x: exitX, y: exitY, opacity: 0 }, { duration: 0.25, ease: "easeIn" })

* Arrow invalid: animate({ x: \[0,-8,8,-8,8,0\] }, { duration: 0.3 }) \+ red border flash

* Level complete: staggered star reveal — each star scales from 0 to 1 with 200ms delay between

* Heart lost: heart icon animates scale 1.0 → 0.0 (breaks/disappears)

TASK: Scaffold the complete project. Generate all files: capacitor.config.ts, package.json with all dependencies, all 3 Zustand stores, all 9 screen components with React Router v6 routing, ArrowCell.tsx, GridBoard.tsx, HeartBar.tsx, HintButton.tsx, gameEngine.ts (with full isValidMove \+ getCellsInPath logic), levelGenerator.ts (with BFS solver), dailyPuzzle.ts, hintEngine.ts, admob.ts service wrapper, iap.ts service wrapper, storage.ts service wrapper, 5 sample levels in levels.json, and README.md with setup steps. TypeScript strict mode throughout. TODO comments for all API keys, Ad Unit IDs, and RevenueCat keys.

**PROMPT END**

# **7\. KPIs & Next Steps**

## **7.1 Success Metrics**

| KPI | Month 1 Target | Month 3 Target |
| :---- | :---- | :---- |
| D1 Retention | \> 38% | \> 42% |
| D7 Retention | \> 18% | \> 22% |
| Avg session | \> 4 min | \> 5 min |
| Remove Ads CVR | \> 2% | \> 3% |
| Daily puzzle DAU | \> 20% of MAU | \> 30% of MAU |
| App Store rating | \> 4.4 | \> 4.6 |

## **7.2 Immediate Next Steps**

27. npm create vite@latest arrow-escape \-- \--template react-ts

28. npm install @capacitor/core @capacitor/cli && npx cap init "Arrow Escape" com.ronakbhatt.arrowescape

29. npx cap add ios && npx cap add android

30. npm install zustand react-router-dom framer-motion howler @capacitor/preferences @capacitor-community/admob @capacitor/haptics @capacitor/share

31. Create AdMob account — generate banner, interstitial, and rewarded Ad Unit IDs for iOS and Android (6 IDs total)

32. Create RevenueCat project — add arrow\_escape\_remove\_ads \+ arrow\_escape\_hints\_20 products

33. Paste the AI Build Prompt from Section 6 into Claude Code to generate full scaffold

34. Build Phase 1: core game engine \+ first 10 levels playable in browser

35. Test the puzzle logic with 5 people: can they figure out the mechanic in under 30 seconds without instructions?


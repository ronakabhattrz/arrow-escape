// Generates 400 harder Arrow Escape levels with BFS-verified solutions
// Run: node scripts/generateLevels.mjs

const DIRS = {
  up:    [-1,  0],
  down:  [ 1,  0],
  left:  [ 0, -1],
  right: [ 0,  1],
};

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s / 0x100000000;
  };
}

function buildGrid(size, arrows) {
  const g = Array.from({ length: size }, () => Array(size).fill(null));
  for (const a of arrows) g[a.row][a.col] = a;
  return g;
}

function isValid(grid, arrow) {
  const [dr, dc] = DIRS[arrow.dir];
  const size = grid.length;
  let r = arrow.row + dr, c = arrow.col + dc;
  while (r >= 0 && r < size && c >= 0 && c < size) {
    if (grid[r][c]) return false;
    r += dr; c += dc;
  }
  return true;
}

function applyMove(grid, id) {
  const size = grid.length;
  const next = grid.map(row => [...row]);
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (next[r][c]?.id === id) { next[r][c] = null; return next; }
  return next;
}

function getAll(grid) {
  const arr = [];
  for (const row of grid) for (const cell of row) if (cell) arr.push(cell);
  return arr;
}

function findSolution(initialGrid) {
  const queue = [{ grid: initialGrid, order: [] }];
  const seen = new Set();
  while (queue.length > 0) {
    const { grid, order } = queue.shift();
    const arrows = getAll(grid);
    if (arrows.length === 0) return order;
    const key = arrows.map(a => `${a.id}`).sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    for (const arrow of arrows) {
      if (isValid(grid, arrow)) {
        queue.push({ grid: applyMove(grid, arrow.id), order: [...order, arrow.id] });
      }
    }
    if (seen.size > 80000) return null;
  }
  return null;
}

function countBlocked(grid) {
  return getAll(grid).filter(a => !isValid(grid, a)).length;
}

function placeRandom(size, count, rand) {
  const positions = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      positions.push([r, c]);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const dirs = Object.keys(DIRS);
  return positions.slice(0, count).map((pos, i) => ({
    id: `a${i}`,
    row: pos[0],
    col: pos[1],
    dir: dirs[Math.floor(rand() * dirs.length)],
  }));
}

function generateLevel(id, size, arrowCount, minBlockedRatio, seed) {
  const rand = seededRandom(seed);
  const minBlocked = Math.ceil(arrowCount * minBlockedRatio);

  for (let attempt = 0; attempt < 3000; attempt++) {
    for (let i = 0; i < attempt % 7; i++) rand();
    const arrows = placeRandom(size, arrowCount, rand);
    const positions = new Set(arrows.map(a => `${a.row},${a.col}`));
    if (positions.size !== arrows.length) continue;
    const grid = buildGrid(size, arrows);

    // Require minimum blockedness — forces strategic ordering
    const blocked = countBlocked(grid);
    if (blocked < minBlocked) continue;

    const solution = findSolution(grid);
    if (solution && solution.length === arrowCount) {
      const diff = size <= 4 ? 1 : size === 5 ? 2 : size === 6 ? 3 : 4;
      return { id, size, difficulty: diff, arrows, solution };
    }
  }
  return null;
}

// Harder configs: more arrows, higher blocked ratio requirement
// [count, size, arrowCount, minBlockedRatio]
const BATCHES = [
  [60,  4, 5,  0.3],   // Easy:    4×4 / 5 arrows  — 35% must be blocked
  [40,  4, 6,  0.35],  // Easy+:   4×4 / 6 arrows
  [50,  5, 7,  0.35],  // Medium:  5×5 / 7 arrows
  [60,  5, 8,  0.4],   // Medium:  5×5 / 8 arrows
  [40,  5, 9,  0.4],   // Medium+: 5×5 / 9 arrows
  [50,  6, 11, 0.4],   // Hard:    6×6 / 11 arrows
  [50,  6, 13, 0.45],  // Hard+:   6×6 / 13 arrows
  [30,  7, 14, 0.45],  // Expert:  7×7 / 14 arrows
  [20,  7, 16, 0.5],   // Expert+: 7×7 / 16 arrows
];

const levels = [];
let id = 1;
let seed = 0xDEADBEEF;

for (const [count, size, arrows, ratio] of BATCHES) {
  let generated = 0;
  let attempts = 0;
  process.stdout.write(`Generating ${count} levels (${size}×${size}, ${arrows} arrows, ${Math.round(ratio*100)}% blocked)...`);
  while (generated < count && attempts < count * 30) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const level = generateLevel(id, size, arrows, ratio, seed);
    if (level) {
      levels.push(level);
      id++;
      generated++;
    }
    attempts++;
  }
  console.log(` done (${generated}/${count})`);
}

import { writeFileSync } from 'fs';
writeFileSync(
  new URL('../src/data/levels.json', import.meta.url),
  JSON.stringify(levels)
);
console.log(`\n✅ Generated ${levels.length} levels → src/data/levels.json`);
const diffs = {};
levels.forEach(l => diffs[l.difficulty] = (diffs[l.difficulty] ?? 0) + 1);
console.log('Difficulty distribution:', diffs);

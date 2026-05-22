// Generates 400 valid Arrow Escape levels with BFS-verified solutions
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

function getCells(grid, row, col, dir) {
  const [dr, dc] = DIRS[dir];
  const size = grid.length;
  const cells = [];
  let r = row + dr, c = col + dc;
  while (r >= 0 && r < size && c >= 0 && c < size) {
    cells.push([r, c]);
    r += dr; c += dc;
  }
  return cells;
}

function isValid(grid, arrow) {
  return getCells(grid, arrow.row, arrow.col, arrow.dir)
    .every(([r, c]) => grid[r][c] === null);
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
    // State key = positions of remaining arrows
    const key = arrows.map(a => `${a.id}:${a.row},${a.col}`).sort().join('|');
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

function placeRandom(size, count, rand) {
  const positions = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      positions.push([r, c]);
  // Fisher-Yates
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

function generateLevel(id, size, arrowCount, seed) {
  const rand = seededRandom(seed);
  for (let attempt = 0; attempt < 2000; attempt++) {
    // Shuffle seed per attempt
    for (let i = 0; i < attempt % 7; i++) rand();
    const arrows = placeRandom(size, arrowCount, rand);
    // Ensure no duplicate positions
    const positions = new Set(arrows.map(a => `${a.row},${a.col}`));
    if (positions.size !== arrows.length) continue;
    const grid = buildGrid(size, arrows);
    const solution = findSolution(grid);
    if (solution && solution.length === arrowCount) {
      const diff = size <= 4 ? 1 : size === 5 ? 2 : size === 6 ? 3 : 4;
      return { id, size, difficulty: diff, arrows, solution };
    }
  }
  return null;
}

const BATCHES = [
  // [count, size, arrowCount]
  [80,  4, 4],  // Easy:   4×4 with 4 arrows   (levels 1-80)
  [20,  4, 5],  // Easy+:  4×4 with 5 arrows   (levels 81-100)
  [60,  5, 5],  // Medium: 5×5 with 5 arrows   (levels 101-160)
  [60,  5, 6],  // Medium: 5×5 with 6 arrows   (levels 161-220)
  [30,  5, 7],  // Medium+:5×5 with 7 arrows   (levels 221-250)
  [50,  6, 7],  // Hard:   6×6 with 7 arrows   (levels 251-300)
  [50,  6, 9],  // Hard:   6×6 with 9 arrows   (levels 301-350)
  [30,  7, 10], // Expert: 7×7 with 10 arrows  (levels 351-380)
  [20,  7, 12], // Expert: 7×7 with 12 arrows  (levels 381-400)
];

const levels = [];
let id = 1;
let seed = 0x1337BEEF;

for (const [count, size, arrows] of BATCHES) {
  let generated = 0;
  let attempts = 0;
  process.stdout.write(`Generating ${count} levels (${size}×${size}, ${arrows} arrows)...`);
  while (generated < count && attempts < count * 20) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const level = generateLevel(id, size, arrows, seed);
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

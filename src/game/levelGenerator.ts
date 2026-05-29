import type { Arrow, Direction, GridState, LevelData } from '../types';
import { buildGrid, isValidMove, applyMove, checkComplete, getAllArrows } from './gameEngine';

const STANDARD_DIRS: Direction[] = ['up', 'down', 'left', 'right'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findSolution(initialGrid: GridState): string[] | null {
  type State = { grid: GridState; order: string[] };
  const queue: State[] = [{ grid: initialGrid, order: [] }];

  while (queue.length > 0) {
    const { grid, order } = queue.shift()!;
    if (checkComplete(grid)) return order;

    const arrows = getAllArrows(grid);
    for (const arrow of arrows) {
      if (isValidMove(grid, arrow)) {
        const nextGrid = applyMove(grid, arrow.id);
        queue.push({ grid: nextGrid, order: [...order, arrow.id] });
      }
    }

    // BFS can explode; cap at reasonable size
    if (queue.length > 50000) return null;
  }
  return null;
}

function countInitiallyBlocked(grid: GridState): number {
  const arrows = getAllArrows(grid);
  return arrows.filter(a => !isValidMove(grid, a)).length;
}

function scoreDifficulty(arrowCount: number, size: number, solutionLength: number): number {
  const base = arrowCount + size - 4;
  const complexity = solutionLength > arrowCount ? 1 : 0;
  return Math.min(4, Math.max(1, Math.round((base + complexity) / 3))) as 1 | 2 | 3 | 4;
}

export function placeArrowsRandom(
  size: number,
  arrowCount: number,
  rand: () => number
): Arrow[] {
  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push({ row: r, col: c });
    }
  }
  const chosen = shuffle(positions, rand).slice(0, arrowCount);
  return chosen.map((pos, i) => ({
    id: `a${i}`,
    row: pos.row,
    col: pos.col,
    dir: STANDARD_DIRS[Math.floor(rand() * STANDARD_DIRS.length)],
  }));
}

export function generateLevel(
  size: number,
  arrowCount: number,
  seed?: number
): LevelData | null {
  const rand = seededRandom(seed ?? Math.floor(Math.random() * 1e9));
  const maxAttempts = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const arrows = placeArrowsRandom(size, arrowCount, rand);
    const grid = buildGrid(size, arrows);
    const solution = findSolution(grid);
    if (solution && solution.length === arrowCount) {
      const blocked = countInitiallyBlocked(buildGrid(size, arrows));
      // Require at least 35% of arrows to be initially blocked — forces strategic play
      const minBlocked = Math.ceil(arrowCount * 0.35);
      if (blocked < minBlocked) continue;
      return {
        id: seed ?? attempt,
        size,
        difficulty: scoreDifficulty(arrowCount, size, solution.length) as 1 | 2 | 3 | 4,
        arrows,
        solution,
      };
    }
  }
  return null;
}

export function generateLevelForDifficulty(difficulty: 1 | 2 | 3 | 4, seed?: number): LevelData | null {
  const configs: Record<number, { size: number; arrows: number }> = {
    1: { size: 4, arrows: 5 },   // was 4 — more crowded
    2: { size: 5, arrows: 8 },   // was 6 — much more crowded
    3: { size: 6, arrows: 12 },  // was 9 — very crowded
    4: { size: 7, arrows: 16 },  // was 12 — expert density
  };
  const { size, arrows } = configs[difficulty];
  return generateLevel(size, arrows, seed);
}

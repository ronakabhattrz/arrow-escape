import type { Arrow, Direction, GridState } from '../types';

const DIRECTION_OFFSETS: Record<Direction, [number, number]> = {
  'up':         [-1,  0],
  'down':       [ 1,  0],
  'left':       [ 0, -1],
  'right':      [ 0,  1],
  'up-left':    [-1, -1],
  'up-right':   [-1,  1],
  'down-left':  [ 1, -1],
  'down-right': [ 1,  1],
};

export function directionOffset(dir: Direction): [number, number] {
  return DIRECTION_OFFSETS[dir];
}

export function buildGrid(size: number, arrows: Arrow[]): GridState {
  const grid: GridState = Array.from({ length: size }, () => Array(size).fill(null));
  for (const arrow of arrows) {
    grid[arrow.row][arrow.col] = arrow;
  }
  return grid;
}

export function getCellsInPath(
  grid: GridState,
  row: number,
  col: number,
  dir: Direction
): { row: number; col: number }[] {
  const size = grid.length;
  const [dr, dc] = directionOffset(dir);
  const cells: { row: number; col: number }[] = [];
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && r < size && c >= 0 && c < size) {
    cells.push({ row: r, col: c });
    r += dr;
    c += dc;
  }
  return cells;
}

export function isValidMove(grid: GridState, arrow: Arrow): boolean {
  const path = getCellsInPath(grid, arrow.row, arrow.col, arrow.dir);
  return path.every(cell => grid[cell.row][cell.col] === null);
}

export function applyMove(grid: GridState, arrowId: string): GridState {
  const size = grid.length;
  const next: GridState = grid.map(row => [...row]);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (next[r][c]?.id === arrowId) {
        next[r][c] = null;
        return next;
      }
    }
  }
  return next;
}

export function checkComplete(grid: GridState): boolean {
  return grid.every(row => row.every(cell => cell === null));
}

export function getArrowById(grid: GridState, arrowId: string): Arrow | null {
  for (const row of grid) {
    for (const cell of row) {
      if (cell?.id === arrowId) return cell;
    }
  }
  return null;
}

export function getAllArrows(grid: GridState): Arrow[] {
  const arrows: Arrow[] = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell) arrows.push(cell);
    }
  }
  return arrows;
}

export function getValidMoves(grid: GridState): Arrow[] {
  return getAllArrows(grid).filter(arrow => isValidMove(grid, arrow));
}

export function getExitOffset(
  grid: GridState,
  arrow: Arrow
): { x: number; y: number } {
  const size = grid.length;
  const [dr, dc] = directionOffset(arrow.dir);
  // How many cells until the edge
  let steps = 0;
  let r = arrow.row + dr;
  let c = arrow.col + dc;
  while (r >= 0 && r < size && c >= 0 && c < size) {
    steps++;
    r += dr;
    c += dc;
  }
  // One extra step to fully exit
  return { x: dc * (steps + 1), y: dr * (steps + 1) };
}

import type { GridState } from '../types';
import { getAllArrows, isValidMove } from './gameEngine';

export function findNextHint(grid: GridState, solution?: string[]): string | null {
  if (solution && solution.length > 0) {
    // Find first solution arrow still on the board
    for (const arrowId of solution) {
      const arrow = getAllArrows(grid).find(a => a.id === arrowId);
      if (arrow && isValidMove(grid, arrow)) return arrowId;
    }
  }
  // Fallback: any valid move
  const valid = getAllArrows(grid).find(arrow => isValidMove(grid, arrow));
  return valid?.id ?? null;
}

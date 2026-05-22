import type { LevelData } from '../types';
import { generateLevel } from './levelGenerator';

function dateToSeed(dateStr: string): number {
  // Simple hash from date string e.g. "2026-05-22"
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyPuzzle(dateStr?: string): LevelData | null {
  const date = dateStr ?? getTodayString();
  const seed = dateToSeed(date);
  // Medium difficulty (5x5, 6 arrows) for daily
  return generateLevel(5, 6, seed);
}

export function isDailyCompleted(lastDailyDate: string): boolean {
  return lastDailyDate === getTodayString();
}

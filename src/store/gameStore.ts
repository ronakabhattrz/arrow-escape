import { create } from 'zustand';
import type { GridState, LevelData } from '../types';
import {
  buildGrid,
  isValidMove,
  applyMove,
  checkComplete,
  getArrowById,
} from '../game/gameEngine';
import { findNextHint } from '../game/hintEngine';
import { useProgressStore } from './progressStore';

interface GameState {
  levelId: string;
  levelData: LevelData | null;
  grid: GridState;
  initialGrid: GridState;
  hearts: number;
  hintsRemaining: number;
  moveHistory: string[];
  isComplete: boolean;
  isFailed: boolean;
  hintArrowId: string | null;
  levelCompleteCount: number;
  starsEarned: number;

  loadLevel: (level: LevelData, hintsFromStore?: number) => void;
  tapArrow: (id: string) => 'valid' | 'invalid' | 'complete';
  useHint: () => string | null;
  undoMove: () => void;
  restartLevel: () => void;
  clearHint: () => void;
  addHeart: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  levelId: '',
  levelData: null,
  grid: [],
  initialGrid: [],
  hearts: 3,
  hintsRemaining: 5,
  moveHistory: [],
  isComplete: false,
  isFailed: false,
  hintArrowId: null,
  levelCompleteCount: 0,
  starsEarned: 0,

  loadLevel: (level, hintsFromStore = 5) => {
    const grid = buildGrid(level.size, level.arrows);
    set({
      levelId: String(level.id),
      levelData: level,
      grid,
      initialGrid: grid.map(row => [...row]),
      hearts: 3,
      hintsRemaining: hintsFromStore,
      moveHistory: [],
      isComplete: false,
      isFailed: false,
      hintArrowId: null,
      starsEarned: 0,
    });
  },

  tapArrow: (id) => {
    const { grid, hearts, levelData, levelCompleteCount, moveHistory } = get();
    const arrow = getArrowById(grid, id);
    if (!arrow) return 'invalid';

    if (!isValidMove(grid, arrow)) {
      const newHearts = hearts - 1;
      set({ hearts: newHearts, isFailed: newHearts <= 0, hintArrowId: null });
      return 'invalid';
    }

    const newGrid = applyMove(grid, id);
    const complete = checkComplete(newGrid);
    const newHearts = get().hearts;
    const starsEarned = newHearts === 3 ? 3 : newHearts === 2 ? 2 : 1;

    set({
      grid: newGrid,
      moveHistory: [...moveHistory, id],
      isComplete: complete,
      hintArrowId: null,
      starsEarned: complete ? starsEarned : 0,
      levelCompleteCount: complete ? levelCompleteCount + 1 : levelCompleteCount,
    });

    if (complete && levelData) {
      const progress = useProgressStore.getState();
      const levelIdStr = String(levelData.id);
      const prevStars = progress.levelStars[levelIdStr] ?? 0;
      progress.setLevelStars(levelIdStr, Math.max(prevStars, starsEarned));
      progress.incrementCompleted();
      if (progress.unlockedLevels <= levelData.id) {
        progress.unlockLevel(levelData.id + 1);
      }
    }

    return complete ? 'complete' : 'valid';
  },

  useHint: () => {
    const { hintsRemaining, grid, levelData, hintArrowId } = get();
    if (hintsRemaining <= 0) return null;
    // Clear existing hint first
    if (hintArrowId) {
      set({ hintArrowId: null });
    }
    const nextId = findNextHint(grid, levelData?.solution);
    set({ hintsRemaining: hintsRemaining - 1, hintArrowId: nextId });
    useProgressStore.getState().useHint();
    return nextId;
  },

  undoMove: () => {
    const { moveHistory, levelData } = get();
    if (moveHistory.length === 0 || !levelData) return;
    // Replay from initial with all moves except last
    const newHistory = moveHistory.slice(0, -1);
    let grid = buildGrid(levelData.size, levelData.arrows);
    for (const id of newHistory) {
      grid = applyMove(grid, id);
    }
    set({ grid, moveHistory: newHistory, isComplete: false, isFailed: false, hintArrowId: null });
  },

  restartLevel: () => {
    const { levelData, initialGrid } = get();
    if (!levelData) return;
    set({
      grid: initialGrid.map(row => [...row]),
      hearts: 3,
      moveHistory: [],
      isComplete: false,
      isFailed: false,
      hintArrowId: null,
    });
  },

  clearHint: () => set({ hintArrowId: null }),

  addHeart: () => {
    const { hearts, isFailed } = get();
    if (hearts < 3) {
      set({ hearts: hearts + 1, isFailed: isFailed && hearts + 1 > 0 ? false : isFailed });
    }
  },
}));

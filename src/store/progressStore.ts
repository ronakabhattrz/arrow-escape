import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageService } from '../services/storage';

interface ProgressState {
  unlockedLevels: number;
  levelStars: Record<string, number>;
  hintsOwned: number;
  removeAds: boolean;
  dailyStreak: number;
  lastDailyDate: string;
  totalCompleted: number;
  totalInvalidMoves: number;
  longestStreak: number;
  totalHintsUsed: number;
  hasSeenTutorial: boolean;

  unlockLevel: (levelIndex: number) => void;
  setLevelStars: (levelId: string, stars: number) => void;
  addHints: (count: number) => void;
  setRemoveAds: (value: boolean) => void;
  incrementCompleted: () => void;
  recordInvalidMove: () => void;
  useHint: () => void;
  completeDailyPuzzle: (date: string) => void;
  markTutorialSeen: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      unlockedLevels: 1,
      levelStars: {},
      hintsOwned: 5,
      removeAds: false,
      dailyStreak: 0,
      lastDailyDate: '',
      totalCompleted: 0,
      totalInvalidMoves: 0,
      longestStreak: 0,
      totalHintsUsed: 0,
      hasSeenTutorial: false,

      unlockLevel: (levelIndex) =>
        set(s => ({ unlockedLevels: Math.max(s.unlockedLevels, levelIndex) })),

      setLevelStars: (levelId, stars) =>
        set(s => ({ levelStars: { ...s.levelStars, [levelId]: stars } })),

      addHints: (count) =>
        set(s => ({ hintsOwned: s.hintsOwned + count })),

      setRemoveAds: (value) => set({ removeAds: value }),

      incrementCompleted: () =>
        set(s => ({ totalCompleted: s.totalCompleted + 1 })),

      recordInvalidMove: () =>
        set(s => ({ totalInvalidMoves: s.totalInvalidMoves + 1 })),

      useHint: () =>
        set(s => ({
          hintsOwned: Math.max(0, s.hintsOwned - 1),
          totalHintsUsed: s.totalHintsUsed + 1,
        })),

      markTutorialSeen: () => set({ hasSeenTutorial: true }),

      completeDailyPuzzle: (date) => {
        const { lastDailyDate, dailyStreak } = get();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const newStreak = lastDailyDate === yesterdayStr ? dailyStreak + 1 : 1;
        set(s => ({
          lastDailyDate: date,
          dailyStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
        }));
      },
    }),
    {
      name: 'arrow-escape-progress',
      storage: {
        getItem: async (name) => {
          const val = await StorageService.get(name);
          return val ? JSON.parse(val) : null;
        },
        setItem: async (name, value) => {
          await StorageService.set(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await StorageService.remove(name);
        },
      },
    }
  )
);

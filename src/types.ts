export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export interface Arrow {
  id: string;
  row: number;
  col: number;
  dir: Direction;
}

export interface LevelData {
  id: number;
  size: number;
  difficulty: 1 | 2 | 3 | 4;
  arrows: Arrow[];
  solution: string[];
}

export type GridState = (Arrow | null)[][];

export type Theme = 'light' | 'dark' | 'sepia' | 'forest';

export interface GameMode {
  type: 'campaign' | 'daily' | 'infinite';
  difficulty?: 1 | 2 | 3;
}

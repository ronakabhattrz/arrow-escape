import React from 'react';
import { motion } from 'framer-motion';
import type { Arrow } from '../types';
import { directionOffset } from '../game/gameEngine';

const ANGLE: Record<Arrow['dir'], number> = {
  right: 0, 'up-right': -45, up: -90, 'up-left': -135,
  left: 180, 'down-left': 135, down: 90, 'down-right': 45,
};

function ArrowSVG({ dir }: { dir: Arrow['dir'] }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${ANGLE[dir]}deg)`, width: '65%', height: '65%' }}>
      <line x1="4" y1="12" x2="17" y2="12"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="15,7 22,12 15,17" fill="currentColor" />
    </svg>
  );
}

interface Props {
  arrow: Arrow;
  cellSize: number;
  isHint: boolean;
  onTap: (id: string) => void;
  gridSize: number;
}

export const ArrowCell = React.memo(function ArrowCell({ arrow, cellSize, isHint, onTap, gridSize }: Props) {
  const [dr, dc] = directionOffset(arrow.dir);
  const maxStepsR = dr > 0 ? gridSize - 1 - arrow.row : dr < 0 ? arrow.row : 0;
  const maxStepsC = dc > 0 ? gridSize - 1 - arrow.col : dc < 0 ? arrow.col : 0;
  const steps = dr !== 0 && dc !== 0 ? Math.min(maxStepsR, maxStepsC) : dr !== 0 ? maxStepsR : maxStepsC;
  const exitX = dc * (steps + 2) * cellSize;
  const exitY = dr * (steps + 2) * cellSize;

  return (
    <motion.div
      className={`arrow-cell${isHint ? ' hint' : ''}`}
      onClick={() => onTap(arrow.id)}
      whileTap={{ scale: 0.88 }}
      style={{ color: 'var(--arrow-color)' }}
      exit={{
        x: exitX,
        y: exitY,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
      }}
    >
      <ArrowSVG dir={arrow.dir} />
    </motion.div>
  );
}, (prev, next) =>
  prev.arrow.id === next.arrow.id &&
  prev.arrow.dir === next.arrow.dir &&
  prev.isHint === next.isHint &&
  prev.cellSize === next.cellSize
);

export function ShakeWrapper({ trigger, children }: { trigger: number; children: React.ReactNode }) {
  return (
    <motion.div
      key={trigger}
      animate={trigger > 0 ? {
        x: [0, -10, 10, -8, 8, -4, 4, 0],
      } : {}}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, borderRadius: 10 }}
    >
      {children}
    </motion.div>
  );
}

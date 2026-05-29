import React, { useState } from 'react';
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
      {/* Shaft with rounded ends for premium feel */}
      <line x1="3" y1="12" x2="16.5" y2="12"
        stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      {/* Bold filled arrowhead — larger triangle */}
      <polygon points="14.5,6.5 22.5,12 14.5,17.5" fill="currentColor" />
      {/* Subtle inner highlight line on shaft */}
      <line x1="3.5" y1="11.2" x2="14" y2="11.2"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
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
  const [flashing, setFlashing] = useState(false);
  const [tapPulse, setTapPulse] = useState(false);

  const handleTap = () => {
    // Brightness flash + ripple scale pulse on tap
    setFlashing(true);
    setTapPulse(true);
    setTimeout(() => setFlashing(false), 200);
    setTimeout(() => setTapPulse(false), 300);
    onTap(arrow.id);
  };

  return (
    <motion.div
      className={`arrow-cell cell-glass${isHint ? ' hint' : ''}${flashing ? ' arrow-cell-flash' : ''}`}
      onClick={handleTap}
      whileTap={{ scale: [0.88, 0.95, 0.88] }}
      animate={tapPulse ? { scale: [1, 0.9, 1.04, 1] } : { scale: 1 }}
      transition={tapPulse ? { duration: 0.28, ease: [0.16, 1, 0.3, 1] } : undefined}
      style={{ color: 'var(--arrow-color)' }}
      exit={{
        x: exitX,
        y: exitY,
        opacity: 0,
        scale: 0.8,
        filter: 'brightness(2)',
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

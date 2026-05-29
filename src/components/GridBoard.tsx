import { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { GridState } from '../types';
import { ArrowCell, ShakeWrapper } from './ArrowCell';

interface Props {
  grid: GridState;
  hintArrowId: string | null;
  onTapArrow: (id: string) => 'valid' | 'invalid' | 'complete';
}

export function GridBoard({ grid, hintArrowId, onTapArrow }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(60);
  const [shaking, setShaking] = useState<Record<string, number>>({});
  const [flashError, setFlashError] = useState(false);
  const size = grid.length;

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const BOARD_PAD = 28;
      const CELL_GAP = 6;
      const boardMax = Math.min(width, height);
      const cs = Math.floor((boardMax - BOARD_PAD - CELL_GAP * (size - 1)) / size);
      setCellSize(Math.max(cs, 20));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [size]);

  const handleTap = useCallback((id: string) => {
    const result = onTapArrow(id);
    if (result === 'invalid') {
      setShaking(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
      setFlashError(true);
      setTimeout(() => setFlashError(false), 350);
    }
  }, [onTapArrow]);

  const CELL_GAP = 6;
  const BOARD_PAD = 28;
  const boardWidth = cellSize * size + CELL_GAP * (size - 1) + BOARD_PAD;

  return (
    <div ref={containerRef} style={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div
        className="grid-board"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          width: boardWidth,
          boxShadow: flashError
            ? '0 0 0 3px var(--danger), 0 0 40px var(--danger-glow)'
            : undefined,
          transition: 'box-shadow 0.1s ease',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="grid-cell" style={{ width: cellSize, height: cellSize }}>
              <AnimatePresence>
                {cell && (
                  <ShakeWrapper trigger={shaking[cell.id] ?? 0}>
                    <ArrowCell
                      key={cell.id}
                      arrow={cell}
                      cellSize={cellSize}
                      isHint={cell.id === hintArrowId}
                      onTap={handleTap}
                      gridSize={size}
                    />
                  </ShakeWrapper>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

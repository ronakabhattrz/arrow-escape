import { useRef, useEffect, useState } from 'react';
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
  const size = grid.length;

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const available = Math.min(width, height) - 24;
      setCellSize(Math.floor((available - (size + 1) * 4) / size));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [size]);

  const handleTap = (id: string) => {
    const result = onTapArrow(id);
    if (result === 'invalid') {
      setShaking(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }
  };

  const boardWidth = cellSize * size + 4 * (size + 1);

  return (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div
        className="grid-board"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          width: boardWidth,
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

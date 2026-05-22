import { motion, AnimatePresence } from 'framer-motion';

function HeartSVG({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? 'var(--danger)' : 'none'}
        stroke={filled ? 'var(--danger)' : 'var(--text3)'}
        strokeWidth={1.8}
      />
    </svg>
  );
}

export function HeartBar({ hearts, maxHearts = 3 }: { hearts: number; maxHearts?: number }) {
  return (
    <div className="heart-bar">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < hearts ? (
            <motion.div
              key="full"
              className="heart-full"
              initial={{ scale: 1.6, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <HeartSVG filled />
            </motion.div>
          ) : (
            <motion.div
              key="lost"
              className="heart-lost"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <HeartSVG filled={false} />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

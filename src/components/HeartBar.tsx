import { motion, AnimatePresence } from 'framer-motion';

export function HeartBar({ hearts, maxHearts = 3 }: { hearts: number; maxHearts?: number }) {
  return (
    <div className="heart-bar">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < hearts ? (
            <motion.span
              key="full"
              className="heart-icon"
              initial={{ scale: 1.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >❤️</motion.span>
          ) : (
            <motion.span
              key="lost"
              className="heart-icon lost"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >🖤</motion.span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

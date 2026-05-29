import { motion, AnimatePresence } from 'framer-motion';

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
              <div className="heart-square heart-square-full" />
            </motion.div>
          ) : (
            <motion.div
              key="lost"
              className="heart-lost"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <div className="heart-square heart-square-empty" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

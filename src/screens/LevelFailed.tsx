import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { showRewarded } from '../services/admob';

export function LevelFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = (location.state as { mode?: string })?.mode ?? 'campaign';
  const { restartLevel, addHeart } = useGameStore();
  const { removeAds } = useProgressStore();

  const handleRestart = () => { restartLevel(); navigate('/game', { state: { mode } }); };

  const handleWatchAd = async () => {
    const rewarded = await showRewarded();
    if (rewarded) { addHeart(); navigate('/game', { state: { mode } }); }
  };

  return (
    <div className="app">
      <div className="failed-screen screen">
        <motion.div
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          style={{ fontSize: 72, lineHeight: 1 }}
        >
          💔
        </motion.div>

        <motion.h2
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="title-lg"
        >
          Out of Hearts!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'var(--text2)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}
        >
          Think about the order — some arrows need to exit before others can move.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300, marginTop: 8 }}
        >
          <button className="btn btn-primary btn-full btn-lg" onClick={handleRestart}>
            🔄 Try Again
          </button>
          {!removeAds && (
            <button className="btn btn-secondary btn-full" onClick={handleWatchAd}>
              📺 Watch Ad for +1 Heart
            </button>
          )}
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { showRewarded } from '../services/admob';
import { DeepSpaceBg } from '../components/DeepSpaceBg';

export function LevelFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = (location.state as { mode?: string })?.mode ?? 'campaign';
  const { restartLevel, addHeart, levelData } = useGameStore();
  const { removeAds, setLevelStars, incrementCompleted, unlockLevel, unlockedLevels } = useProgressStore();
  const [loading, setLoading] = useState(false);

  const handleRestart = () => { restartLevel(); navigate('/game', { state: { mode } }); };

  const handleWatchAd = async () => {
    setLoading(true);
    const rewarded = await showRewarded();
    setLoading(false);
    if (rewarded) { addHeart(); navigate('/game', { state: { mode } }); }
  };

  const handleSkip = async () => {
    setLoading(true);
    const rewarded = await showRewarded();
    setLoading(false);
    if (rewarded && levelData) {
      const id = String(levelData.id);
      setLevelStars(id, Math.max(1, useProgressStore.getState().levelStars[id] ?? 0));
      incrementCompleted();
      if (unlockedLevels <= levelData.id) unlockLevel(levelData.id + 1);
      navigate('/');
    }
  };

  return (
    <div className="app">
      <div className="failed-screen screen failed-screen-shake">
        {/* Deep Space Chrome background */}
        <DeepSpaceBg />

        {/* Dark red ambient flash */}
        <div className="failed-bg-flash" aria-hidden />

        {/* Geometric broken heart — two offset rectangles in danger color */}
        <motion.div
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="broken-heart-geo failed-heart-throb"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="broken-bar-left" />
          <div className="broken-bar-right" />
        </motion.div>

        <motion.h2
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="title-lg failed-title-gradient"
          style={{ position: 'relative', zIndex: 1 }}
        >
          OUT OF HEARTS
        </motion.h2>

        <p className="failed-try-again" style={{ position: 'relative', zIndex: 1 }}>TRY AGAIN?</p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            color: '#B8C4D8',
            textAlign: 'center',
            maxWidth: 280,
            lineHeight: 1.6,
            fontSize: 13,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Think about the order — some arrows need to exit before others can move.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
            maxWidth: 300,
            marginTop: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button className="btn btn-danger btn-full btn-lg retry-glow-btn" onClick={handleRestart}>
            TRY AGAIN
          </button>
          {!removeAds && (
            <button className="btn btn-secondary btn-full" onClick={handleWatchAd} disabled={loading}>
              WATCH AD FOR +1 HEART
            </button>
          )}
          {!removeAds && mode === 'campaign' && (
            <button className="btn btn-ghost btn-full" onClick={handleSkip} disabled={loading}>
              SKIP LEVEL (WATCH AD)
            </button>
          )}
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>
            HOME
          </button>
        </motion.div>
      </div>
    </div>
  );
}

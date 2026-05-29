import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { showInterstitial, showRewarded } from '../services/admob';
import levelsData from '../data/levels.json';
import type { LevelData } from '../types';

const LEVELS = levelsData as LevelData[];

const MESSAGES = [
  ['🎯', 'Perfect!', 'Flawless execution — no mistakes!'],
  ['🔥', 'Well Done!', 'Great solve, keep it up!'],
  ['✅', 'Cleared!', 'The grid is empty!'],
];

export function LevelComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = (location.state as { mode?: string })?.mode ?? 'campaign';

  const { levelData, starsEarned, loadLevel } = useGameStore();
  const { totalCompleted, hintsOwned, removeAds, addHints } = useProgressStore();
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);

  const handleWatchAd = async () => {
    setRewardLoading(true);
    const rewarded = await showRewarded();
    setRewardLoading(false);
    if (rewarded) { addHints(2); setRewardClaimed(true); }
  };

  useEffect(() => {
    if (!removeAds && totalCompleted > 0 && totalCompleted % 3 === 0) showInterstitial();
  }, [totalCompleted, removeAds]);

  if (!levelData) { navigate('/'); return null; }

  const nextLevel = LEVELS.find(l => l.id === levelData.id + 1);
  const [emoji, title, subtitle] = MESSAGES[Math.max(0, 3 - starsEarned)] ?? MESSAGES[2];

  const handleNext = () => {
    if (mode === 'infinite') { navigate('/infinite'); return; }
    if (nextLevel) { loadLevel(nextLevel, hintsOwned); navigate('/game', { state: { mode } }); }
    else navigate('/levels');
  };

  return (
    <div className="app">
      <div className="complete-screen screen">
        {/* Slowly rotating conic gradient background */}
        <div className="conic-bg" aria-hidden />

        {/* Pure-CSS confetti burst — 12 dots that explode on mount */}
        <div className="confetti-burst" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="confetti-dot" />
          ))}
        </div>

        {/* LEVEL CLEARED banner slides in from top with golden shimmer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.01 }}
          className="level-cleared-banner"
          style={{ position: 'relative', zIndex: 2 }}
        >
          LEVEL CLEARED
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.18 }}
          className="complete-emoji"
        >
          {emoji}
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.35 }}
          className="complete-title"
        >
          {title}
        </motion.h2>

        <div className="star-row">
          {[1, 2, 3].map(s => (
            <motion.span
              key={s}
              className={`star-item${s > starsEarned ? ' empty' : ''}`}
              initial={{ scale: 0, y: 30, rotate: -25 }}
              animate={s <= starsEarned
                ? { scale: [0, 1.35, 0.88, 1.12, 1], y: 0, rotate: ['-25deg', '10deg', '-6deg', '3deg', '0deg'] }
                : { scale: 1, y: 0, rotate: 0 }
              }
              transition={{
                duration: 0.55,
                delay: 0.38 + s * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="complete-subtitle"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="complete-actions"
        >
          <button className="btn btn-primary btn-full btn-lg next-level-btn" onClick={handleNext}>
            {mode === 'infinite' ? '▶ Next Puzzle' : nextLevel ? '▶ Next Level' : '▶ All Levels'}
          </button>
          {!removeAds && !rewardClaimed && (
            <button
              className="btn btn-ghost btn-full"
              onClick={handleWatchAd}
              disabled={rewardLoading}
            >
              {rewardLoading ? 'Loading...' : '🎁 Watch ad for +2 hints'}
            </button>
          )}
          {rewardClaimed && (
            <p style={{ textAlign: 'center', color: 'var(--success)', fontSize: 14, margin: 0 }}>
              ✅ +2 hints added!
            </p>
          )}
          <div className="complete-row">
            <button className="btn btn-secondary btn-full" onClick={() => {
              const s = useGameStore.getState();
              if (s.levelData) s.loadLevel(s.levelData, hintsOwned);
              navigate('/game', { state: { mode } });
            }}>
              🔄 Replay
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

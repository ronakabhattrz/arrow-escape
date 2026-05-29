import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { showInterstitial, showRewarded } from '../services/admob';
import levelsData from '../data/levels.json';
import type { LevelData } from '../types';
import { DeepSpaceBg } from '../components/DeepSpaceBg';

const LEVELS = levelsData as LevelData[];

const MESSAGES = [
  ['PERFECT', 'Flawless execution — no mistakes!'],
  ['WELL DONE', 'Great solve, keep it up!'],
  ['CLEARED', 'The grid is empty!'],
];

// Diamond star shape
function DiamondStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.span
      className={`star-item${filled ? '' : ' empty'}`}
      initial={{ scale: 0, y: 20, rotate: -25 }}
      animate={filled
        ? { scale: [0, 1.35, 0.88, 1.12, 1], y: 0, rotate: ['-25deg', '10deg', '-6deg', '3deg', '0deg'] }
        : { scale: 1, y: 0, rotate: 0 }
      }
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      ◆
    </motion.span>
  );
}

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
  const [title, subtitle] = MESSAGES[Math.max(0, 3 - starsEarned)] ?? MESSAGES[2];

  const handleNext = () => {
    if (mode === 'infinite') { navigate('/infinite'); return; }
    if (nextLevel) { loadLevel(nextLevel, hintsOwned); navigate('/game', { state: { mode } }); }
    else navigate('/levels');
  };

  return (
    <div className="app">
      <div className="complete-screen screen">
        {/* Deep Space Chrome background */}
        <DeepSpaceBg />

        {/* Iridescent border flash — subtle ambient effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: 1.4, delay: 0.1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(110,231,247,0.06) 0%, transparent 40%, rgba(240,171,252,0.06) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* LEVEL CLEARED banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.01 }}
          className="level-cleared-banner"
          style={{ position: 'relative', zIndex: 2 }}
        >
          LEVEL CLEARED
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="complete-title"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {title}
        </motion.h2>

        {/* Stars — sharp diamond shapes */}
        <div className="star-row" style={{ position: 'relative', zIndex: 2 }}>
          {[1, 2, 3].map(s => (
            <DiamondStar
              key={s}
              filled={s <= starsEarned}
              delay={0.32 + s * 0.16}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.88 }}
          className="complete-subtitle"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.72 }}
          className="complete-actions"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <button className="btn btn-primary btn-full btn-lg next-level-btn" onClick={handleNext}>
            {mode === 'infinite' ? 'NEXT PUZZLE' : nextLevel ? 'NEXT LEVEL' : 'ALL LEVELS'}
          </button>
          {!removeAds && !rewardClaimed && (
            <button
              className="btn btn-ghost btn-full"
              onClick={handleWatchAd}
              disabled={rewardLoading}
            >
              {rewardLoading ? 'LOADING...' : 'WATCH AD FOR +2 HINTS'}
            </button>
          )}
          {rewardClaimed && (
            <p style={{
              textAlign: 'center',
              color: '#6EE7F7',
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              +2 HINTS ADDED
            </p>
          )}
          <div className="complete-row">
            <button className="btn btn-secondary btn-full" onClick={() => {
              const s = useGameStore.getState();
              if (s.levelData) s.loadLevel(s.levelData, hintsOwned);
              navigate('/game', { state: { mode } });
            }}>
              REPLAY
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>
              HOME
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

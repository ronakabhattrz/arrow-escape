import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { getDailyPuzzle, getTodayString, isDailyCompleted } from '../game/dailyPuzzle';
import { GridBoard } from '../components/GridBoard';
import { HeartBar } from '../components/HeartBar';
import { ShareCard } from '../components/ShareCard';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { useSettingsStore } from '../store/settingsStore';
import { IconHome, IconRestart } from '../components/Icons';

export function DailyPuzzle() {
  const navigate = useNavigate();
  const today = getTodayString();
  const [showShare, setShowShare] = useState(false);

  const { loadLevel, grid, hearts, hintArrowId, isComplete, isFailed,
    tapArrow, restartLevel, clearHint, starsEarned } = useGameStore();
  const { dailyStreak, lastDailyDate, completeDailyPuzzle, recordInvalidMove } = useProgressStore();
  const { soundEnabled, hapticsEnabled } = useSettingsStore();

  const alreadyDone = isDailyCompleted(lastDailyDate);

  useEffect(() => {
    const level = getDailyPuzzle();
    if (level) loadLevel(level, 0);
    else navigate('/');
  }, [loadLevel, navigate]);

  useEffect(() => {
    if (isComplete && !alreadyDone) {
      completeDailyPuzzle(today);
      setShowShare(true);
      if (soundEnabled) SoundService.playComplete();
      if (hapticsEnabled) HapticsService.success();
    }
  }, [isComplete, alreadyDone, completeDailyPuzzle, today, soundEnabled, hapticsEnabled]);

  useEffect(() => {
    if (isFailed) restartLevel();
  }, [isFailed, restartLevel]);

  const handleTap = (id: string) => {
    clearHint();
    const result = tapArrow(id);
    if (result === 'valid' || result === 'complete') {
      if (soundEnabled) SoundService.playSlide();
      if (hapticsEnabled) HapticsService.lightTap();
    } else {
      if (soundEnabled) SoundService.playError();
      if (hapticsEnabled) HapticsService.errorPattern();
      recordInvalidMove();
    }
    return result;
  };

  if (grid.length === 0) return null;

  return (
    <div className="app">
      <div className="game-hud">
        <HeartBar hearts={hearts} />
        <div className="hud-center">
          <div className="hud-level-tag">📅 Daily Puzzle</div>
          <div className="hud-level-num" style={{ fontSize: 13, letterSpacing: 0 }}>{today}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{dailyStreak}</span>
        </div>
      </div>

      {alreadyDone && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="daily-done-banner"
        >
          ✓ Already completed — come back tomorrow!
        </motion.div>
      )}

      <div className="game-board-container">
        <GridBoard grid={grid} hintArrowId={hintArrowId} onTapArrow={handleTap} />
      </div>

      <div className="game-bottom-bar">
        <button className="bottom-bar-btn" onClick={() => navigate('/')}>
          <IconHome size={20} />
          <span className="lbl">Home</span>
        </button>
        <button className="bottom-bar-btn" onClick={restartLevel}>
          <IconRestart size={20} />
          <span className="lbl">Restart</span>
        </button>
        <button className="bottom-bar-btn" style={{ opacity: 0.28, pointerEvents: 'none' }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span className="lbl">No Hints</span>
        </button>
      </div>

      {showShare && (
        <ShareCard
          date={today}
          stars={starsEarned}
          streak={dailyStreak}
          onClose={() => { setShowShare(false); navigate('/'); }}
        />
      )}
    </div>
  );
}

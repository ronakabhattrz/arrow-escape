import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';
import { generateLevelForDifficulty } from '../game/levelGenerator';
import { GridBoard } from '../components/GridBoard';
import { HeartBar } from '../components/HeartBar';
import { HintButton } from '../components/HintButton';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { showInterstitial } from '../services/admob';
import { IconHome, IconUndo, IconRestart, IconBack } from '../components/Icons';

type Diff = 1 | 2 | 3;

const DIFF_INFO: Record<Diff, { label: string; emoji: string; desc: string; color: string }> = {
  1: { label: 'Easy',   emoji: '😊', desc: '4×4 · 4 arrows',  color: '#22C55E' },
  2: { label: 'Medium', emoji: '🤔', desc: '5×5 · 6 arrows',  color: '#F59E0B' },
  3: { label: 'Hard',   emoji: '🧠', desc: '6×6 · 9 arrows',  color: '#EF4444' },
};

export function InfiniteMode() {
  const navigate = useNavigate();
  const [diff, setDiff] = useState<Diff | null>(null);
  const [count, setCount] = useState(0);

  const { loadLevel, grid, hearts, hintArrowId, isFailed,
    tapArrow, useHint, undoMove, restartLevel, clearHint } = useGameStore();
  const { hintsOwned, removeAds, recordInvalidMove } = useProgressStore();
  const { soundEnabled, hapticsEnabled } = useSettingsStore();

  const startNext = useCallback((d: Diff) => {
    const level = generateLevelForDifficulty(d);
    if (level) loadLevel(level, hintsOwned);
  }, [loadLevel, hintsOwned]);

  const selectDiff = (d: Diff) => { setDiff(d); startNext(d); };

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
    if (result === 'complete') {
      if (soundEnabled) SoundService.playComplete();
      if (hapticsEnabled) HapticsService.success();
      const next = count + 1;
      setCount(next);
      if (!removeAds && next % 5 === 0) showInterstitial();
      if (diff) startNext(diff);
    }
    return result;
  };

  if (!diff) {
    return (
      <div className="app">
        <div className="hud">
          <button className="back-btn" onClick={() => navigate('/')}>
            <IconBack size={18} />
            Back
          </button>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Infinite Mode</span>
          <div style={{ width: 72 }} />
        </div>
        <div className="screen" style={{ justifyContent: 'center', gap: 28, padding: 32 }}>
          <motion.h2
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="title-md" style={{ textAlign: 'center' }}
          >
            Choose Difficulty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text2)', textAlign: 'center', fontSize: 14, lineHeight: 1.5 }}
          >
            Endless procedurally generated puzzles
          </motion.p>
          <div className="diff-picker">
            {([1, 2, 3] as Diff[]).map((d, i) => {
              const info = DIFF_INFO[d];
              return (
                <motion.div
                  key={d}
                  className="diff-card"
                  onClick={() => selectDiff(d)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <div className="diff-card-emoji">{info.emoji}</div>
                  <div className="diff-card-name" style={{ color: info.color }}>{info.label}</div>
                  <div className="diff-card-desc">{info.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="app">
        <div className="failed-screen screen">
          <div style={{ fontSize: 64 }}>💔</div>
          <h2 className="title-lg">Out of Hearts!</h2>
          <p style={{ color: 'var(--text2)', textAlign: 'center', lineHeight: 1.5 }}>
            You solved {count} puzzle{count !== 1 ? 's' : ''} this session.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300, marginTop: 8 }}>
            <button className="btn btn-primary btn-full" onClick={() => restartLevel()}>Try Again</button>
            <button className="btn btn-ghost btn-full" onClick={() => { setDiff(null); setCount(0); }}>Change Difficulty</button>
            <button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (grid.length === 0) return null;

  return (
    <div className="app">
      <div className="game-hud">
        <HeartBar hearts={hearts} />
        <div className="hud-center">
          <div className="hud-level-tag">{DIFF_INFO[diff].label}</div>
          <div className="hud-level-num">#{count + 1}</div>
        </div>
        <HintButton count={hintsOwned} onUse={() => useHint()} />
      </div>

      <div className="game-board-container">
        <GridBoard grid={grid} hintArrowId={hintArrowId} onTapArrow={handleTap} />
      </div>

      <div className="game-bottom-bar">
        <button className="bottom-bar-btn" onClick={() => navigate('/')}>
          <IconHome size={20} />
          <span className="lbl">Home</span>
        </button>
        <button className="bottom-bar-btn" onClick={undoMove}>
          <IconUndo size={20} />
          <span className="lbl">Undo</span>
        </button>
        <button className="bottom-bar-btn" onClick={restartLevel}>
          <IconRestart size={20} />
          <span className="lbl">Restart</span>
        </button>
      </div>
    </div>
  );
}

import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';
import { GridBoard } from '../components/GridBoard';
import { HeartBar } from '../components/HeartBar';
import { HintButton } from '../components/HintButton';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { IconHome, IconUndo, IconRestart } from '../components/Icons';

export function GameBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = (location.state as { mode?: string })?.mode ?? 'campaign';

  const { levelData, grid, hearts, hintArrowId, isComplete, isFailed,
    tapArrow, useHint, undoMove, restartLevel, clearHint, syncHints } = useGameStore();
  const { hintsOwned, recordInvalidMove } = useProgressStore();
  const { soundEnabled, hapticsEnabled } = useSettingsStore();

  useEffect(() => { if (!levelData) navigate('/'); }, [levelData, navigate]);

  // Sync hint count once progressStore finishes hydrating from storage
  useEffect(() => {
    const unsub = useProgressStore.persist.onFinishHydration(() => {
      syncHints(useProgressStore.getState().hintsOwned);
    });
    if (useProgressStore.persist.hasHydrated()) {
      syncHints(useProgressStore.getState().hintsOwned);
    }
    return unsub;
  }, [syncHints]);

  useEffect(() => { if (isComplete) navigate('/level-complete', { state: { mode } }); }, [isComplete, navigate, mode]);
  useEffect(() => { if (isFailed) navigate('/level-failed', { state: { mode } }); }, [isFailed, navigate, mode]);

  const handleTap = useCallback((id: string) => {
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
    }
    return result;
  }, [tapArrow, clearHint, soundEnabled, hapticsEnabled, recordInvalidMove]);

  if (!levelData || grid.length === 0) return null;

  const modeLabel = mode === 'daily' ? 'Daily' : mode === 'infinite' ? 'Infinite' : 'Level';
  const modeValue = mode === 'campaign' ? String(levelData.id) : '';

  return (
    <div className="app">
      <div className="game-hud">
        <HeartBar hearts={hearts} />
        <div className="hud-center">
          <div className={modeValue ? 'hud-level-pill' : undefined}>
            <div className="hud-level-tag">{modeLabel}</div>
            {modeValue && <div className="hud-level-num">{modeValue}</div>}
          </div>
        </div>
        <HintButton
          count={hintsOwned}
          onUse={() => useHint()}
          disabled={mode === 'daily'}
        />
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

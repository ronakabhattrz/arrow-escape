import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { useGameStore } from '../store/gameStore';
import levelsData from '../data/levels.json';
import type { LevelData } from '../types';
import { IconBack } from '../components/Icons';

const LEVELS = levelsData as LevelData[];
const CHAPTER_SIZE = 20;
const CHAPTERS = Math.ceil(LEVELS.length / CHAPTER_SIZE);

const DIFF_COLOR = ['', '#22C55E', '#F59E0B', '#EF4444', '#A78BFA'];
const DIFF_LABEL = ['', 'Easy', 'Med', 'Hard', 'XP'];

export function LevelSelect() {
  const navigate = useNavigate();
  const { unlockedLevels, levelStars, hintsOwned } = useProgressStore();
  const loadLevel = useGameStore(s => s.loadLevel);
  const [chapter, setChapter] = useState(0);

  const chapterLevels = LEVELS.slice(chapter * CHAPTER_SIZE, (chapter + 1) * CHAPTER_SIZE);
  const chapterCompleted = chapterLevels.filter(l => levelStars[String(l.id)] > 0).length;
  const progressPct = (chapterCompleted / chapterLevels.length) * 100;

  const handleSelect = (level: LevelData) => {
    if (level.id > unlockedLevels) return;
    loadLevel(level, hintsOwned);
    navigate('/game', { state: { mode: 'campaign' } });
  };

  return (
    <div className="app">
      <div className="hud">
        <button className="back-btn" onClick={() => navigate('/')}><IconBack size={18} />Back</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Chapter</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{chapter + 1} / {CHAPTERS}</div>
        </div>
        <div className="chapter-nav">
          <button className="chapter-nav-btn" disabled={chapter === 0} onClick={() => setChapter(c => c - 1)}>‹</button>
          <button className="chapter-nav-btn" disabled={chapter === CHAPTERS - 1} onClick={() => setChapter(c => c + 1)}>›</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="chapter-progress">
        <motion.div
          className="chapter-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="scroll-container">
        <div className="level-grid">
          {chapterLevels.map((level, idx) => {
            const stars = levelStars[String(level.id)] ?? 0;
            const locked = level.id > unlockedLevels;
            const starStr = stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆';

            return (
              <motion.div
                key={level.id}
                className={`level-card${locked ? ' locked' : ''}${stars === 3 ? ' perfect' : stars > 0 ? ' completed' : ''}`}
                onClick={() => handleSelect(level)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.015, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                  className="level-diff-dot"
                  style={{ background: DIFF_COLOR[level.difficulty] }}
                  title={DIFF_LABEL[level.difficulty]}
                />
                <span className="level-num">{level.id}</span>
                <span className="level-stars" style={{ color: stars > 0 ? 'var(--star)' : 'var(--border2)' }}>
                  {starStr}
                </span>
                {locked && <span style={{ fontSize: 14, position: 'absolute', bottom: 5 }}>🔒</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Difficulty legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: '8px 16px 24px', flexWrap: 'wrap' }}>
          {[1,2,3,4].map(d => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: DIFF_COLOR[d] }} />
              {DIFF_LABEL[d]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

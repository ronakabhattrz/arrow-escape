import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';

export function Stats() {
  const navigate = useNavigate();
  const { totalCompleted, dailyStreak, longestStreak, totalHintsUsed, totalInvalidMoves, levelStars } = useProgressStore();
  const perfect = Object.values(levelStars).filter(s => s === 3).length;

  return (
    <div className="app">
      <div className="hud">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Stats</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="scroll-container">
        {/* Hero stats */}
        <div className="stats-hero" style={{ margin: '16px 16px 0' }}>
          <div className="stat-hero-item">
            <div className="stat-hero-value">{totalCompleted}</div>
            <div className="stat-hero-label">Cleared</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
          <div className="stat-hero-item">
            <div className="stat-hero-value">{dailyStreak}</div>
            <div className="stat-hero-label">Streak 🔥</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
          <div className="stat-hero-item">
            <div className="stat-hero-value">{perfect}</div>
            <div className="stat-hero-label">Perfect ⭐</div>
          </div>
        </div>

        <div className="stats-card">
          {[
            ['🏆', 'Levels Completed', totalCompleted],
            ['⭐', 'Perfect Clears (3★)', perfect],
            ['🔥', 'Current Streak', dailyStreak],
            ['📈', 'Longest Streak', longestStreak],
            ['💡', 'Hints Used', totalHintsUsed],
            ['❌', 'Invalid Moves', totalInvalidMoves],
          ].map(([icon, label, value]) => (
            <div key={String(label)} className="stat-row">
              <span className="stat-label">{icon} {label}</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

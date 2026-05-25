import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { showBanner, hideBanner } from '../services/admob';
import { isDailyCompleted } from '../game/dailyPuzzle';
import { IconPlay, IconStats, IconSettings, IconCalendar, IconInfinity, IconBook } from '../components/Icons';

const LogoSVG = () => (
  <svg viewBox="0 0 52 52" fill="none">
    <path d="M8 26h36M26 8l18 18-18 18" stroke="white" strokeWidth="4.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function HomeScreen() {
  const navigate = useNavigate();
  const { totalCompleted, dailyStreak, lastDailyDate, removeAds, hasSeenTutorial } = useProgressStore();
  const dailyDone = isDailyCompleted(lastDailyDate);

  useEffect(() => {
    if (!removeAds && hasSeenTutorial) showBanner();
    return () => { hideBanner(); };
  }, [removeAds, hasSeenTutorial]);

  useEffect(() => {
    const unsub = useProgressStore.persist.onFinishHydration(() => {
      if (!useProgressStore.getState().hasSeenTutorial) {
        navigate('/tutorial', { replace: true });
      }
    });
    if (useProgressStore.persist.hasHydrated() && !hasSeenTutorial) {
      navigate('/tutorial', { replace: true });
    }
    return unsub;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <div className="home-screen screen">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.05 }}
          className="home-logo"
        >
          <LogoSVG />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="home-title-wrap"
        >
          <h1 className="title-xl">ARROW<br />ESCAPE</h1>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="home-tagline"
        >
          Clear every arrow from the grid.{'\n'}No timer. No chaos. Pure logic.
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="home-buttons"
        >
          <button className="home-play-btn" onClick={() => navigate('/levels')}>
            <IconPlay size={22} />
            Play
          </button>

          <div className="home-row">
            <button className="home-secondary-btn" onClick={() => navigate('/daily')}>
              <div style={{ position: 'relative' }}>
                <IconCalendar size={24} style={{ color: dailyDone ? 'var(--success)' : 'var(--accent)' }} />
                {dailyStreak > 0 && !dailyDone && (
                  <span style={{
                    position: 'absolute', top: -5, right: -8,
                    background: 'var(--danger)', color: '#fff', borderRadius: 7,
                    width: 14, height: 14, fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>!</span>
                )}
              </div>
              <span className="btn-label">Daily</span>
              {dailyStreak > 0 && (
                <span style={{ fontSize: 10, color: 'var(--star)', fontWeight: 700 }}>🔥 {dailyStreak}</span>
              )}
            </button>

            <button className="home-secondary-btn" onClick={() => navigate('/infinite')}>
              <IconInfinity size={24} style={{ color: 'var(--accent2)' }} />
              <span className="btn-label">Infinite</span>
            </button>

            <button className="home-secondary-btn" onClick={() => navigate('/tutorial')}>
              <IconBook size={24} style={{ color: 'var(--text2)' }} />
              <span className="btn-label">How to Play</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="home-util-row"
          style={{ maxWidth: 340, marginTop: 10 }}
        >
          <button className="home-util-btn" onClick={() => navigate('/stats')}>
            <IconStats size={16} />
            Stats
          </button>
          <button className="home-util-btn" onClick={() => navigate('/settings')}>
            <IconSettings size={16} />
            Settings
          </button>
        </motion.div>

        {totalCompleted > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="home-stats-badge"
          >
            <span>✦ {totalCompleted} cleared</span>
            {dailyDone && <span>✦ Daily done</span>}
          </motion.div>
        )}
      </div>

      {!removeAds && <div style={{ height: 50, flexShrink: 0 }} />}
    </div>
  );
}

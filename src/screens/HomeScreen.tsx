import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { showBanner, hideBanner } from '../services/admob';
import { isDailyCompleted } from '../game/dailyPuzzle';
import { IconPlay, IconStats, IconSettings, IconCalendar, IconInfinity, IconBook } from '../components/Icons';
import { DeepSpaceBg } from '../components/DeepSpaceBg';

// Logo: sharp bracket motif flanking arrow SVG
const LogoBracketSVG = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 900,
      fontSize: 36,
      color: '#6EE7F7',
      letterSpacing: 0,
      lineHeight: 1,
    }}>[</span>
    <svg viewBox="0 0 52 52" fill="none" width={40} height={40}>
      <path d="M8 26h36M26 8l18 18-18 18"
        stroke="url(#arrowGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="arrowGrad" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#E8ECF4" />
          <stop offset="40%" stopColor="#9BADC8" />
          <stop offset="70%" stopColor="#E8ECF4" />
          <stop offset="100%" stopColor="#C5D0E4" />
        </linearGradient>
      </defs>
    </svg>
    <span style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 900,
      fontSize: 36,
      color: '#6EE7F7',
      letterSpacing: 0,
      lineHeight: 1,
    }}>]</span>
  </div>
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
        {/* Deep Space Chrome background */}
        <DeepSpaceBg />

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="home-logo"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <LogoBracketSVG />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="home-title-wrap"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <h1 className="title-xl home-title-glow">ARROW<br />ESCAPE</h1>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="home-tagline"
          style={{ position: 'relative', zIndex: 2 }}
        >
          Clear every arrow from the grid.{'\n'}No timer. No chaos. Pure logic.
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.26, duration: 0.4 }}
          className="home-buttons"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <button className="home-play-btn play-btn-shimmer" onClick={() => navigate('/levels')}>
            <IconPlay size={18} />
            PLAY
          </button>

          <div className="home-row">
            <button className="home-secondary-btn" onClick={() => navigate('/daily')}>
              <div style={{ position: 'relative' }}>
                <IconCalendar size={20} style={{ color: dailyDone ? '#6EE7F7' : '#818CF8' }} />
                {dailyStreak > 0 && !dailyDone && (
                  <span style={{
                    position: 'absolute', top: -5, right: -8,
                    background: '#F43F5E', color: '#fff', borderRadius: 3,
                    width: 14, height: 14, fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}>!</span>
                )}
              </div>
              <span className="btn-label">DAILY</span>
              {dailyStreak > 0 && (
                <span style={{
                  fontSize: 9,
                  color: '#F59E0B',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '1px',
                }}>
                  {dailyStreak}x
                </span>
              )}
            </button>

            <button className="home-secondary-btn" onClick={() => navigate('/infinite')}>
              <IconInfinity size={20} style={{ color: '#818CF8' }} />
              <span className="btn-label">INFINITE</span>
            </button>

            <button className="home-secondary-btn" onClick={() => navigate('/tutorial')}>
              <IconBook size={20} style={{ color: '#7A8BA8' }} />
              <span className="btn-label">HOW TO</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="home-util-row"
          style={{ maxWidth: 340, marginTop: 10, position: 'relative', zIndex: 2 }}
        >
          <button className="home-util-btn" onClick={() => navigate('/stats')}>
            <IconStats size={14} />
            STATS
          </button>
          <button className="home-util-btn" onClick={() => navigate('/settings')}>
            <IconSettings size={14} />
            SETTINGS
          </button>
        </motion.div>

        {totalCompleted > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52 }}
            className="home-stats-badge"
          >
            <span>— {totalCompleted} CLEARED</span>
            {dailyDone && <span>— DAILY DONE</span>}
          </motion.div>
        )}
      </div>

      {!removeAds && <div style={{ height: 50, flexShrink: 0 }} />}
    </div>
  );
}

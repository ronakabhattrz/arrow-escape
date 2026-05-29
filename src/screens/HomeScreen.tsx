import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { showBanner, hideBanner } from '../services/admob';
import { isDailyCompleted } from '../game/dailyPuzzle';
import { IconPlay, IconStats, IconSettings, IconCalendar, IconInfinity, IconBook } from '../components/Icons';
import { AuroraBackground } from '../components/AuroraBackground';

const LogoSVG = () => (
  <svg viewBox="0 0 52 52" fill="none">
    <path d="M8 26h36M26 8l18 18-18 18" stroke="white" strokeWidth="4.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Single arrow SVG used in the kinetic background — size is passed per-arrow
const BgArrowSVG = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <line x1="4" y1="12" x2="17" y2="12"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <polygon points="15,7.5 21,12 15,16.5" fill="currentColor" />
  </svg>
);

// Varied sizes for 8 subtle kinetic arrows
const KB_SIZES = [28, 36, 22, 42, 26, 32, 20, 38];

function KineticBackground() {
  return (
    <div className="home-kinetic-bg" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="kb-arrow" style={{ color: 'rgba(255,255,255,0.08)' }}>
          <BgArrowSVG size={KB_SIZES[i]} />
        </span>
      ))}
      {/* Bottom fade so arrows dissolve toward buttons */}
      <div className="home-kinetic-fade" />
    </div>
  );
}

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
        {/* Aurora mesh gradient background */}
        <AuroraBackground variant="default" />

        {/* Kinetic drifting arrow background */}
        <KineticBackground />

        {/* Subtle noise/grain texture overlay */}
        <div className="grain-overlay" aria-hidden />

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.05 }}
          className="home-logo"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <LogoSVG />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="home-title-wrap"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <h1 className="title-xl home-title-glow">ARROW<br />ESCAPE</h1>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="home-tagline"
          style={{ position: 'relative', zIndex: 2 }}
        >
          Clear every arrow from the grid.{'\n'}No timer. No chaos. Pure logic.
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="home-buttons"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <button className="home-play-btn play-btn-shimmer" onClick={() => navigate('/levels')}>
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
          style={{ maxWidth: 340, marginTop: 10, position: 'relative', zIndex: 2 }}
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

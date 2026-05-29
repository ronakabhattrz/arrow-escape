import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';

const DIR_DEG = { right: 0, down: 90, left: 180, up: 270 } as const;
type Dir = keyof typeof DIR_DEG;

function ArrowSVG({ deg }: { deg: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{ transform: `rotate(${deg}deg)`, width: 22, height: 22 }}>
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function TutArrow({ dir, variant = 'normal' }: { dir: Dir; variant?: 'normal' | 'valid' | 'blocked' }) {
  return (
    <div className={`tutorial-arrow${variant === 'valid' ? ' valid' : variant === 'blocked' ? ' blocked' : ''}`}>
      <ArrowSVG deg={DIR_DEG[dir]} />
    </div>
  );
}

function Cell({ children }: { children?: React.ReactNode }) {
  return <div className="tutorial-cell">{children}</div>;
}

function GoalVisual() {
  return (
    <div className="tutorial-mini-grid" style={{ gridTemplateColumns: 'repeat(4, 44px)' }}>
      <Cell><TutArrow dir="right" /></Cell><Cell /><Cell /><Cell><TutArrow dir="down" /></Cell>
      <Cell /><Cell><TutArrow dir="up" /></Cell><Cell /><Cell />
      <Cell /><Cell /><Cell><TutArrow dir="right" /></Cell><Cell />
      <Cell><TutArrow dir="down" /></Cell><Cell /><Cell /><Cell><TutArrow dir="left" /></Cell>
    </div>
  );
}

function SlideVisual() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const toggle = () => {
      setVisible(false);
      setTimeout(() => setVisible(true), 700);
    };
    const id = setInterval(toggle, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="tutorial-mini-grid"
      style={{ gridTemplateColumns: 'repeat(3, 44px)', overflow: 'hidden' }}
    >
      <div className="tutorial-cell" style={{ overflow: 'visible' }}>
        <AnimatePresence>
          {visible && (
            <motion.div
              key="arrow"
              className="tutorial-arrow valid"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: 160, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeIn' }}
            >
              <ArrowSVG deg={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Cell />
      <Cell />
    </div>
  );
}

function BlockVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="tutorial-mini-grid" style={{ gridTemplateColumns: 'repeat(3, 44px)' }}>
          <Cell><TutArrow dir="right" variant="blocked" /></Cell>
          <Cell><TutArrow dir="right" /></Cell>
          <Cell />
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '2px',
          color: '#F43F5E',
          lineHeight: 1.4,
          textTransform: 'uppercase',
        }}>
          BLOCKED<br />
          <span style={{ fontWeight: 400, color: '#B8C4D8', fontFamily: "'Barlow', sans-serif", fontSize: 11, textTransform: 'none', letterSpacing: '0px' }}>path not clear</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="tutorial-mini-grid" style={{ gridTemplateColumns: 'repeat(3, 44px)' }}>
          <Cell />
          <Cell><TutArrow dir="right" variant="valid" /></Cell>
          <Cell />
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '2px',
          color: '#6EE7F7',
          lineHeight: 1.4,
          textTransform: 'uppercase',
        }}>
          CLEAR<br />
          <span style={{ fontWeight: 400, color: '#B8C4D8', fontFamily: "'Barlow', sans-serif", fontSize: 11, textTransform: 'none', letterSpacing: '0px' }}>tap to exit</span>
        </div>
      </div>
    </div>
  );
}

// Geometric square hearts for tutorial
function HeartSquareRow() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="heart-square heart-square-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 12 }}
        />
      ))}
      {[3, 4].map(i => (
        <div key={i} className="heart-square heart-square-empty" />
      ))}
    </div>
  );
}

function HeartsVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <HeartSquareRow />
      <div style={{
        background: 'rgba(110,231,247,0.05)',
        border: '1px solid rgba(110,231,247,0.2)',
        borderRadius: 6,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 16, color: '#6EE7F7' }}>⬡</span>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            color: '#6EE7F7',
            fontSize: 15,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>5 HINTS</div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            color: '#7A8BA8',
          }}>shows next valid move</div>
        </div>
      </div>
    </div>
  );
}

function ReadyVisual() {
  return (
    <motion.div
      initial={{ scale: 0.5, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
    >
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900,
        fontSize: 52,
        letterSpacing: '4px',
        background: 'linear-gradient(135deg, #E8ECF4 0%, #9BADC8 40%, #E8ECF4 70%, #C5D0E4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>GO</span>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {[1, 2, 3].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 300 }}
            style={{
              fontSize: 26,
              color: '#F59E0B',
              filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))',
            }}
          >
            ◆
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    num: 'STEP 1 OF 5',
    title: 'Clear the Grid',
    desc: 'Your goal is to remove every arrow from the board. When the grid is empty — you win!',
    Visual: GoalVisual,
  },
  {
    num: 'STEP 2 OF 5',
    title: 'Tap to Slide',
    desc: "Tap any arrow and it slides in the direction it's pointing until it exits off the edge.",
    Visual: SlideVisual,
  },
  {
    num: 'STEP 3 OF 5',
    title: 'Order Matters',
    desc: "An arrow can't move if another arrow is blocking its path. Clear blockers first!",
    Visual: BlockVisual,
  },
  {
    num: 'STEP 4 OF 5',
    title: 'Hearts & Hints',
    desc: 'You have 3 hearts. Tapping a blocked arrow costs one heart. Use hints when stuck!',
    Visual: HeartsVisual,
  },
  {
    num: 'STEP 5 OF 5',
    title: "You're Ready!",
    desc: 'Start with Easy levels to learn the ropes, then push yourself with Hard and Expert puzzles. Good luck!',
    Visual: ReadyVisual,
  },
] as const;

export function TutorialScreen() {
  const navigate = useNavigate();
  const markTutorialSeen = useProgressStore(s => s.markTutorialSeen);
  const [step, setStep] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

  const total = STEPS.length;
  const current = STEPS[step];
  const { Visual } = current;

  const finish = () => {
    markTutorialSeen();
    navigate('/');
  };

  const next = () => {
    if (step === total - 1) { finish(); return; }
    setSlideDir(1);
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setSlideDir(-1);
    setStep(s => s - 1);
  };

  return (
    <div className="app">
      <div className="hud">
        {step > 0 ? (
          <button className="back-btn" onClick={back}>← BACK</button>
        ) : (
          <div style={{ width: 60 }} />
        )}
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#E8ECF4',
        }}>HOW TO PLAY</span>
        <button
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#7A8BA8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          onClick={finish}
        >
          SKIP
        </button>
      </div>

      <div className="tutorial-screen">
        {/* Progress bars — sharp horizontal bars */}
        <div className="tutorial-progress">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`tutorial-progress-dot${i <= step ? ' active' : ''}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="tutorial-content"
            initial={{ x: slideDir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -slideDir * 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="tutorial-visual">
              <Visual />
            </div>
            <div className="tutorial-step-num">{current.num}</div>
            <div className="tutorial-step-title">{current.title}</div>
            <p className="tutorial-step-desc">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="tutorial-footer">
          <button className="btn btn-primary btn-full btn-lg" onClick={next}>
            {step === total - 1 ? 'START PLAYING' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
}

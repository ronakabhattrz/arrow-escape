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
        <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 700, lineHeight: 1.3 }}>
          ✗ BLOCKED<br />
          <span style={{ fontWeight: 400, color: 'var(--text2)' }}>path not clear</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="tutorial-mini-grid" style={{ gridTemplateColumns: 'repeat(3, 44px)' }}>
          <Cell />
          <Cell><TutArrow dir="right" variant="valid" /></Cell>
          <Cell />
        </div>
        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, lineHeight: 1.3 }}>
          ✓ CLEAR!<br />
          <span style={{ fontWeight: 400, color: 'var(--text2)' }}>tap to exit</span>
        </div>
      </div>
    </div>
  );
}

function HeartsVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[1, 2, 3].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 12 }}
            style={{ fontSize: 34 }}
          >
            ❤️
          </motion.span>
        ))}
        {[4, 5].map(i => (
          <span key={i} style={{ fontSize: 34, opacity: 0.2 }}>🤍</span>
        ))}
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 16,
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>💡</span>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: 16 }}>5 Hints</div>
          <div style={{ fontSize: 11, color: 'var(--text2)' }}>shows next valid move</div>
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
    >
      <span style={{ fontSize: 72, lineHeight: 1 }}>🏆</span>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {[1, 2, 3].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 300 }}
            style={{ fontSize: 28 }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    num: 'Step 1 of 5',
    title: 'Clear the Grid',
    desc: 'Your goal is to remove every arrow from the board. When the grid is empty — you win!',
    Visual: GoalVisual,
  },
  {
    num: 'Step 2 of 5',
    title: 'Tap to Slide',
    desc: "Tap any arrow and it slides in the direction it's pointing until it exits off the edge.",
    Visual: SlideVisual,
  },
  {
    num: 'Step 3 of 5',
    title: 'Order Matters',
    desc: "An arrow can't move if another arrow is blocking its path. Clear blockers first!",
    Visual: BlockVisual,
  },
  {
    num: 'Step 4 of 5',
    title: 'Hearts & Hints',
    desc: 'You have 3 hearts. Tapping a blocked arrow costs one heart. Use hints when stuck!',
    Visual: HeartsVisual,
  },
  {
    num: 'Step 5 of 5',
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
          <button className="back-btn" onClick={back}>← Back</button>
        ) : (
          <div style={{ width: 60 }} />
        )}
        <span style={{ fontWeight: 800 }}>How to Play</span>
        <button
          style={{
            color: 'var(--text2)',
            fontSize: 14,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          onClick={finish}
        >
          Skip
        </button>
      </div>

      <div className="tutorial-screen">
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
            {step === total - 1 ? '🎮 Start Playing!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import { purchaseRemoveAds, purchaseHints20, restorePurchases } from '../services/iap';
import type { Theme } from '../types';

const THEMES: { key: Theme; bg: string; border: string }[] = [
  { key: 'dark',   bg: '#0A0E1A', border: '#3B82F6' },
  { key: 'light',  bg: '#F0F4FF', border: '#2563EB' },
  { key: 'sepia',  bg: '#1A1208', border: '#D97706' },
  { key: 'forest', bg: '#071410', border: '#10B981' },
];

export function Settings() {
  const navigate = useNavigate();
  const { theme, soundEnabled, hapticsEnabled, setTheme, toggleSound, toggleHaptics } = useSettingsStore();
  const { removeAds, hintsOwned, setRemoveAds, addHints } = useProgressStore();

  const handleRemoveAds = async () => {
    const ok = await purchaseRemoveAds();
    if (ok) { setRemoveAds(true); return; }
    window.alert('Coming soon!\n\nIn-app purchases will be available in the next update.');
  };
  const handleHints = async () => {
    const ok = await purchaseHints20();
    if (ok) { addHints(20); return; }
    window.alert('Coming soon!\n\nIn-app purchases will be available in the next update.');
  };
  const handleRestore = async () => {
    const r = await restorePurchases();
    if (r.removeAds) { setRemoveAds(true); return; }
    window.alert('No purchases found to restore.');
  };

  return (
    <div className="app">
      <div className="hud">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Settings</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="scroll-container">
        <div className="settings-section-label">Appearance</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">Theme</span>
              <span className="settings-row-sub">Choose your visual style</span>
            </div>
            <div className="theme-picker">
              {THEMES.map(t => (
                <button
                  key={t.key}
                  className={`theme-swatch${theme === t.key ? ' active' : ''}`}
                  style={{ background: t.bg, borderColor: theme === t.key ? t.border : 'transparent' }}
                  onClick={() => setTheme(t.key)}
                  title={t.key}
                />
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">Sound Effects</span>
            </div>
            <button className={`toggle${soundEnabled ? ' on' : ''}`} onClick={toggleSound} />
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">Haptic Feedback</span>
            </div>
            <button className={`toggle${hapticsEnabled ? ' on' : ''}`} onClick={toggleHaptics} />
          </div>
        </div>

        <div className="settings-section-label">Purchases</div>
        <div className="settings-card">
          {!removeAds ? (
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-title">Remove Ads</span>
                <span className="settings-row-sub">One-time · Remove all ads forever</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleRemoveAds}>$4.99</button>
            </div>
          ) : (
            <div className="settings-row">
              <span className="settings-row-title">✅ Ads Removed</span>
            </div>
          )}
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">Hint Pack</span>
              <span className="settings-row-sub">20 hints · You have {hintsOwned}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleHints}>$0.99</button>
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">Restore Purchases</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleRestore}>Restore</button>
          </div>
        </div>

        <div className="settings-section-label">About</div>
        <div className="settings-card" style={{ marginBottom: 32 }}>
          <div className="settings-row">
            <span className="settings-row-title">How to Play</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tutorial')}>Open</button>
          </div>
          <div className="settings-row" style={{ cursor: 'pointer' }} onClick={() => window.open('https://sites.google.com/view/arrow-escape-privacy', '_blank', 'noopener,noreferrer')}>
            <span className="settings-row-title">Privacy Policy</span>
            <span style={{ color: 'var(--accent)', fontSize: 16 }}>→</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-title">Version</span>
            <span style={{ color: 'var(--text3)', fontSize: 14 }}>1.0.0</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-title">Made by</span>
            <span style={{ color: 'var(--text3)', fontSize: 14 }}>Ronak Bhatt</span>
          </div>
        </div>
      </div>
    </div>
  );
}

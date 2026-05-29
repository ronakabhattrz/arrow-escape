import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import { purchaseRemoveAds, purchaseHints20, restorePurchases, fetchPrices } from '../services/iap';
import type { Theme } from '../types';

const THEMES: { key: Theme; bg: string }[] = [
  { key: 'dark',   bg: '#04060D' },
  { key: 'light',  bg: '#0B1120' },
  { key: 'sepia',  bg: '#0D0905' },
  { key: 'forest', bg: '#030F07' },
];

export function Settings() {
  const navigate = useNavigate();
  const { theme, soundEnabled, hapticsEnabled, setTheme, toggleSound, toggleHaptics } = useSettingsStore();
  const { removeAds, hintsOwned, setRemoveAds, addHints } = useProgressStore();
  const [prices, setPrices] = useState({ removeAds: '$4.99', hints20: '$0.99' });

  useEffect(() => {
    fetchPrices().then(setPrices);
  }, []);

  const handleRemoveAds = async () => {
    const ok = await purchaseRemoveAds();
    if (ok) { setRemoveAds(true); return; }
  };
  const handleHints = async () => {
    const ok = await purchaseHints20();
    if (ok) { addHints(20); return; }
  };
  const handleRestore = async () => {
    const r = await restorePurchases();
    if (r.removeAds) { setRemoveAds(true); return; }
    window.alert('No purchases found to restore.');
  };

  return (
    <div className="app">
      <div className="hud">
        <button className="back-btn" onClick={() => navigate('/')}>← BACK</button>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#E8ECF4',
        }}>SETTINGS</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="scroll-container">
        <div className="settings-section-label">APPEARANCE</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">THEME</span>
              <span className="settings-row-sub">Visual style</span>
            </div>
            <div className="theme-picker">
              {THEMES.map(t => (
                <button
                  key={t.key}
                  className={`theme-swatch${theme === t.key ? ' active' : ''}`}
                  style={{
                    background: t.bg,
                    borderColor: theme === t.key ? '#6EE7F7' : 'transparent',
                  }}
                  onClick={() => setTheme(t.key)}
                  title={t.key}
                />
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">SOUND EFFECTS</span>
            </div>
            <button className={`toggle${soundEnabled ? ' on' : ''}`} onClick={toggleSound} />
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">HAPTIC FEEDBACK</span>
            </div>
            <button className={`toggle${hapticsEnabled ? ' on' : ''}`} onClick={toggleHaptics} />
          </div>
        </div>

        <div className="settings-section-label">PURCHASES</div>
        <div className="settings-card">
          {!removeAds ? (
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-title">REMOVE ADS</span>
                <span className="settings-row-sub">One-time · Remove all ads forever</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleRemoveAds}>{prices.removeAds}</button>
            </div>
          ) : (
            <div className="settings-row">
              <span className="settings-row-title" style={{ color: '#6EE7F7' }}>ADS REMOVED</span>
            </div>
          )}
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">HINT PACK</span>
              <span className="settings-row-sub">20 hints · You have {hintsOwned}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleHints}>{prices.hints20}</button>
          </div>
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-title">RESTORE PURCHASES</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleRestore}>RESTORE</button>
          </div>
        </div>

        <div className="settings-section-label">ABOUT</div>
        <div className="settings-card" style={{ marginBottom: 32 }}>
          <div className="settings-row">
            <span className="settings-row-title">HOW TO PLAY</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tutorial')}>OPEN</button>
          </div>
          <div className="settings-row" style={{ cursor: 'pointer' }} onClick={() => window.open('https://gist.github.com/ronakabhattrz/09a4059d616135add8cfcdc730992652', '_blank', 'noopener,noreferrer')}>
            <span className="settings-row-title">PRIVACY POLICY</span>
            <span style={{ color: '#6EE7F7', fontSize: 16 }}>→</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-title">VERSION</span>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: '#3A4560',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '1px',
            }}>1.0.1</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-title">MADE BY</span>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: '#3A4560',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '1px',
            }}>RONAK BHATT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

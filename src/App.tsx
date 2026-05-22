import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import { initAdMob } from './services/admob';
import { initIAP } from './services/iap';

import { HomeScreen } from './screens/HomeScreen';
import { LevelSelect } from './screens/LevelSelect';
import { GameBoard } from './screens/GameBoard';
import { LevelComplete } from './screens/LevelComplete';
import { LevelFailed } from './screens/LevelFailed';
import { DailyPuzzle } from './screens/DailyPuzzle';
import { InfiniteMode } from './screens/InfiniteMode';
import { Settings } from './screens/Settings';
import { Stats } from './screens/Stats';
import { TutorialScreen } from './screens/TutorialScreen';

export default function App() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    initAdMob();
    initIAP();
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/game" element={<GameBoard />} />
        <Route path="/level-complete" element={<LevelComplete />} />
        <Route path="/level-failed" element={<LevelFailed />} />
        <Route path="/daily" element={<DailyPuzzle />} />
        <Route path="/infinite" element={<InfiniteMode />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/tutorial" element={<TutorialScreen />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

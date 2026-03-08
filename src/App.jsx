import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';

// Layout
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Views
import CurrentWeather from './views/CurrentWeather';
import Forecast from './views/Forecast';
import Historical from './views/Historical';
import Marine from './views/Marine';

const DummySettings = () => (
  <div className="page-content fade-in">
    <div className="page-header">
      <h1 className="page-title">Platform Settings</h1>
      <p className="page-subtitle">Manage preferences and API configurations</p>
    </div>
    <div className="glass-panel" style={{ padding: '32px' }}>
      <p style={{ color: 'var(--text-muted)' }}>Settings configuration is currently under development.</p>
    </div>
  </div>
);

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <div className="main-wrapper">
            <TopBar />
            <Routes>
              <Route path="/" element={<CurrentWeather />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/historical" element={<Historical />} />
              <Route path="/marine" element={<Marine />} />
              <Route path="/settings" element={<DummySettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './layouts/DashboardLayout';

const Overview = lazy(() => import('./pages/Overview'));
const Matrix = lazy(() => import('./pages/Matrix'));
const HeadToHead = lazy(() => import('./pages/HeadToHead'));
const Simulation = lazy(() => import('./pages/Simulation'));

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /><div className="loading-text">Loading dashboard...</div></div>}>
                  <Overview />
                </Suspense>
              }
            />
            <Route
              path="matrix"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /><div className="loading-text">Loading matrix...</div></div>}>
                  <Matrix />
                </Suspense>
              }
            />
            <Route
              path="head-to-head"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /><div className="loading-text">Loading head-to-head view...</div></div>}>
                  <HeadToHead />
                </Suspense>
              }
            />
            <Route
              path="simulation"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /><div className="loading-text">Loading simulation...</div></div>}>
                  <Simulation />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;

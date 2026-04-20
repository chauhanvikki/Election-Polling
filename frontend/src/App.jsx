import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Matrix from './pages/Matrix';
import HeadToHead from './pages/HeadToHead';
import Simulation from './pages/Simulation';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="matrix" element={<Matrix />} />
            <Route path="head-to-head" element={<HeadToHead />} />
            <Route path="simulation" element={<Simulation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;

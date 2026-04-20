import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { LayoutDashboard, Table, Swords, TestTube2, Activity } from 'lucide-react';

const DashboardLayout = () => {
  const { loading, error } = useData();

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <div className="loading-text">Synthesizing Electoral Intelligence...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-banner">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="header-logo">P</div>
          <div className="brand-text">
            <h2>PoliticAI</h2>
            <p>Electoral Analytics</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/matrix" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Table size={20} />
            <span>Matrix</span>
          </NavLink>
          <NavLink to="/head-to-head" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Swords size={20} />
            <span>Head-to-Head</span>
          </NavLink>
          <NavLink to="/simulation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <TestTube2 size={20} />
            <span>Simulation</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="status-badge">
            <span className="dot" />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
               <Activity size={14} /> ML Model Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header can go here if needed, but for now we'll rely on the sidebar */}
        <header className="page-header">
           <h1>Predictive Intelligence Matrix</h1>
           <p className="page-subtitle">Real-time demographic and sentiment forecasting</p>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

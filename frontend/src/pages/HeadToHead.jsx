import React from 'react';
import { useData } from '../context/DataContext';
import HeadToHeadComponent from '../components/HeadToHead';
import RadarChartComponent from '../components/RadarChart';

const HeadToHead = () => {
  const { data, factors } = useData();

  return (
    <div className="page-animate dashboard-grid">
      <div className="dashboard-main">
        <div className="glass-panel">
          <div className="section-header">
            <h2 className="section-title">
              <span className="icon icon-purple">⚔️</span>
              Head-to-Head Comparison
            </h2>
            <span className="section-badge">Factor Breakdown</span>
          </div>
          <HeadToHeadComponent data={data} factors={factors} />
        </div>
      </div>
      <div className="dashboard-sidebar">
        <div className="glass-panel">
          <div className="section-header">
            <h2 className="section-title">
              <span className="icon icon-cyan">📊</span>
              Radar Overlay
            </h2>
          </div>
          <RadarChartComponent data={data} factors={factors} />
        </div>
      </div>
    </div>
  );
};

export default HeadToHead;

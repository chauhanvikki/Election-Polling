import React from 'react';
import { useData } from '../context/DataContext';
import SimulationEngine from '../components/SimulationEngine';
import PowForecast from '../components/PowForecast';
import SentimentChart from '../components/SentimentChart';

const Simulation = () => {
  const { data } = useData();

  return (
    <div className="page-animate dashboard-grid">
      <div className="dashboard-main">
        {data.map(candidate => (
          <SimulationEngine key={`sim-${candidate.id}`} candidate={candidate} />
        ))}
      </div>
      <div className="dashboard-sidebar">
        <div className="glass-panel mb-4">
          <div className="section-header">
            <h2 className="section-title">
              <span className="icon icon-green">🏆</span>
              Live PoW Forecast
            </h2>
          </div>
          <PowForecast data={data} />
        </div>
        <div className="glass-panel">
          <div className="section-header">
            <h2 className="section-title">
              <span className="icon icon-pink">💬</span>
              Sentiment Pulse
            </h2>
          </div>
          <SentimentChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Simulation;

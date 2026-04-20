import React from 'react';
import { useData } from '../context/DataContext';
import RadarChartComponent from '../components/RadarChart';
import SentimentChart from '../components/SentimentChart';
import PowForecast from '../components/PowForecast';
import ConstituencyOverview from '../components/ConstituencyOverview';
import CandidateProfiles from '../components/CandidateProfiles';

const Overview = () => {
  const { data, factors, stats, selectedCandidate, setSelectedCandidate } = useData();

  return (
    <div className="page-animate">
      {/* Stat Cards */}
      <div className="stats-row">
        <div className="stat-card animate-in animate-in-delay-1">
          <div className="stat-label">Candidates Tracked</div>
          <div className="stat-value blue">{stats.totalCandidates}</div>
          <div className="stat-sub">Active in constituency</div>
        </div>
        <div className="stat-card animate-in animate-in-delay-2">
          <div className="stat-label">Matrix Factors</div>
          <div className="stat-value purple">{stats.totalFactors}</div>
          <div className="stat-sub">Weighted dimensions</div>
        </div>
        <div className="stat-card animate-in animate-in-delay-3">
          <div className="stat-label">Avg. Sentiment</div>
          <div className="stat-value cyan">{stats.avgSentiment}/10</div>
          <div className="stat-sub">Across all candidates</div>
        </div>
        <div className="stat-card animate-in animate-in-delay-4">
          <div className="stat-label">Frontrunner</div>
          <div className="stat-value green">{stats.topCandidate?.name?.replace('Candidate ', '').split(' ')[0] || '—'}</div>
          <div className="stat-sub">Highest composite score</div>
        </div>
      </div>

      <CandidateProfiles
        data={data}
        selectedCandidate={selectedCandidate}
        onSelectCandidate={setSelectedCandidate}
      />

      <div className="dashboard-grid mt-4">
        <div className="dashboard-main">
          <div className="glass-panel">
            <div className="section-header">
              <h2 className="section-title">
                <span className="icon icon-blue">📈</span>
                Strategic Gap Analysis
              </h2>
              <span className="section-badge">Radar View</span>
            </div>
            <RadarChartComponent data={data} factors={factors} />
          </div>

          <div className="glass-panel mt-4">
            <div className="section-header">
              <h2 className="section-title">
                <span className="icon icon-pink">💬</span>
                Sentiment Trend (7-Day)
              </h2>
              <span className="section-badge">OSINT Feed</span>
            </div>
            <SentimentChart data={data} />
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="glass-panel">
            <div className="section-header">
              <h2 className="section-title">
                <span className="icon icon-purple">📍</span>
                Constituency Profile
              </h2>
            </div>
            <ConstituencyOverview />
          </div>

          <div className="glass-panel mt-4">
            <div className="section-header">
              <h2 className="section-title">
                <span className="icon icon-green">🏆</span>
                PoW Forecast
              </h2>
            </div>
            <PowForecast data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

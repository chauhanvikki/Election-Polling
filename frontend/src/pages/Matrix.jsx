import React from 'react';
import { useData } from '../context/DataContext';
import CandidateMatrix from '../components/CandidateMatrix';

const Matrix = () => {
  const { data, factors, stats } = useData();

  return (
    <div className="page-animate">
      <div className="glass-panel">
        <div className="section-header">
          <h2 className="section-title">
            <span className="icon icon-blue">📋</span>
            Candidate Comparison Matrix
          </h2>
          <span className="section-badge">{stats.totalCandidates} Candidates · {stats.totalFactors} Factors</span>
        </div>
        <CandidateMatrix data={data} factors={factors} />
      </div>
    </div>
  );
};

export default Matrix;

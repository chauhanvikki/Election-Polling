import React from 'react';

const CandidateProfiles = ({ data, selectedCandidate, onSelectCandidate }) => {
  const getPartyLabel = (name) => {
    if (name.includes('Incumbent')) return 'Incumbent · National Party';
    if (name.includes('Challenger')) return 'Challenger · Regional Party';
    return 'Independent · Local';
  };

  const getInitial = (name) => {
    return name.replace(/Candidate\s/, '').charAt(0);
  };

  // Calculate total weighted score as a simple PoW proxy
  const weights = { incumbency: 1.5, party_strength: 1.2, past_work: 1.4, personal_base: 1.3, demographic_base: 1.6, digital_sentiment: 1.0 };
  
  const totals = data.map(cand => {
    let score = 0;
    Object.entries(cand.scores).forEach(([key, val]) => {
      score += val.value * (weights[key] || 1);
    });
    return { ...cand, totalScore: score };
  });

  const totalAll = totals.reduce((acc, c) => acc + Math.pow(c.totalScore, 1.5), 0);

  return (
    <div className="candidate-profiles">
      {totals.map((cand, index) => {
        const pow = totalAll > 0 ? Math.round((Math.pow(cand.totalScore, 1.5) / totalAll) * 100) : 0;
        const powColor = pow > 40 ? 'var(--success)' : pow > 25 ? 'var(--warning)' : 'var(--danger)';
        
        return (
          <div
            key={cand.id}
            className={`profile-card animate-in animate-in-delay-${index + 1} ${selectedCandidate === cand.id ? 'selected' : ''}`}
            onClick={() => onSelectCandidate(cand.id)}
          >
            <div className="profile-avatar">{getInitial(cand.name)}</div>
            <div className="profile-name">{cand.name}</div>
            <div className="profile-party">{getPartyLabel(cand.name)}</div>
            <div className="profile-pow" style={{ color: powColor }}>{pow}%</div>
            <div className="profile-pow-label">Probability of Win</div>
          </div>
        );
      })}
    </div>
  );
};

export default CandidateProfiles;

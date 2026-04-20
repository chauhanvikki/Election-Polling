import React, { useEffect, useState } from 'react';

const PowForecast = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate PoW
  const weights = { incumbency: 1.5, party_strength: 1.2, past_work: 1.4, personal_base: 1.3, demographic_base: 1.6, digital_sentiment: 1.0 };
  
  const results = data.map(cand => {
    let score = 0;
    Object.entries(cand.scores).forEach(([key, val]) => {
      score += val.value * (weights[key] || 1);
    });
    return { ...cand, adjustedScore: Math.pow(score, 1.5) };
  });

  const totalScore = results.reduce((acc, c) => acc + c.adjustedScore, 0);
  const withPow = results.map(c => ({
    ...c,
    pow: totalScore > 0 ? Math.round((c.adjustedScore / totalScore) * 100) : 0
  })).sort((a, b) => b.pow - a.pow);

  const gradients = [
    'linear-gradient(90deg, #22c55e, #4ade80)',
    'linear-gradient(90deg, #4f8eff, #a855f7)',
    'linear-gradient(90deg, #eab308, #fbbf24)'
  ];

  const getLeadReason = () => {
    const leader = withPow[0];
    if (!leader) return '';
    const scores = leader.scores;
    const entries = Object.entries(scores).sort((a, b) => b[1].value - a[1].value);
    const top2 = entries.slice(0, 2).map(e => e[1].label);
    return `${leader.name.split('(')[0].trim()} leads with advantages in ${top2[0]} and ${top2[1]}.`;
  };

  return (
    <div>
      {withPow.map((cand, index) => (
        <div key={cand.id} className="pow-item">
          <div className="pow-header">
            <div className="pow-name">
              {index === 0 && <span>👑</span>}
              {cand.name.replace('Candidate ', '').split(' ')[0]}
            </div>
            <div className="pow-value" style={{ 
              color: index === 0 ? 'var(--success)' : index === 1 ? 'var(--accent-blue)' : 'var(--warning)' 
            }}>
              {cand.pow}%
            </div>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ 
                width: mounted ? `${cand.pow}%` : '0%',
                background: gradients[index % gradients.length]
              }}
            />
          </div>
        </div>
      ))}
      
      <div className="insight-card">
        <h4>💡 Key Insight</h4>
        <p>{getLeadReason()}</p>
      </div>
    </div>
  );
};

export default PowForecast;

import React from 'react';

const CandidateMatrix = ({ data, factors }) => {
  const getScoreClass = (value) => {
    if (value >= 7) return 'high';
    if (value >= 4) return 'med';
    return 'low';
  };

  return (
    <div className="matrix-container">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Factor</th>
            {data.map(cand => (
              <th key={cand.id}>{cand.name.replace('Candidate ', '').split(' ')[0]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {factors.map(factor => (
            <tr key={factor.id}>
              <td>
                <div className="factor-name">{factor.name}</div>
                <div className="factor-weight">Weight: {factor.weight}×</div>
              </td>
              {data.map(cand => {
                const scoreData = cand.scores[factor.id];
                const cls = getScoreClass(scoreData.value);
                return (
                  <td key={`${cand.id}-${factor.id}`}>
                    <div className="score-cell">
                      <div className="score-bar-track">
                        <div
                          className={`score-bar-fill ${cls}`}
                          style={{ width: `${scoreData.value * 10}%` }}
                        />
                      </div>
                      <span className={`score-num ${cls}`}>{scoreData.value}</span>
                    </div>
                    <div className="score-label">{scoreData.label}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateMatrix;

import React, { useState } from 'react';

const HeadToHead = ({ data, factors }) => {
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(1);

  const left = data[leftIdx];
  const right = data[rightIdx];

  if (!left || !right) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <select
          value={leftIdx}
          onChange={(e) => setLeftIdx(parseInt(e.target.value))}
          style={{
            background: 'rgba(79, 142, 255, 0.1)',
            border: '1px solid rgba(79, 142, 255, 0.2)',
            color: 'var(--accent-blue)',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer'
          }}
        >
          {data.map((c, i) => (
            <option key={c.id} value={i} style={{ background: '#0e1525', color: '#e8edf5' }}>
              {c.name}
            </option>
          ))}
        </select>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          VS
        </div>

        <select
          value={rightIdx}
          onChange={(e) => setRightIdx(parseInt(e.target.value))}
          style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            color: 'var(--accent-purple)',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer'
          }}
        >
          {data.map((c, i) => (
            <option key={c.id} value={i} style={{ background: '#0e1525', color: '#e8edf5' }}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {factors.map(factor => {
        const leftScore = left.scores[factor.id]?.value || 0;
        const rightScore = right.scores[factor.id]?.value || 0;
        const leftPct = (leftScore / 10) * 100;
        const rightPct = (rightScore / 10) * 100;

        return (
          <div key={factor.id} style={{ marginBottom: '0.85rem' }}>
            <div className="h2h-factor-label">{factor.name}</div>
            <div className="h2h-bar-row">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: leftScore >= rightScore ? 'var(--accent-blue)' : 'var(--text-muted)', minWidth: '20px', textAlign: 'right' }}>
                {leftScore}
              </span>
              <div className="h2h-bar-left">
                <div className="h2h-fill" style={{ width: `${leftPct}%`, background: 'linear-gradient(270deg, #4f8eff, #22d3ee)' }} />
              </div>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)',
                flexShrink: 0
              }}>
                VS
              </div>
              <div className="h2h-bar-right">
                <div className="h2h-fill" style={{ width: `${rightPct}%`, background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: rightScore >= leftScore ? 'var(--accent-purple)' : 'var(--text-muted)', minWidth: '20px' }}>
                {rightScore}
              </span>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      {(() => {
        let leftWins = 0, rightWins = 0;
        factors.forEach(f => {
          const l = left.scores[f.id]?.value || 0;
          const r = right.scores[f.id]?.value || 0;
          if (l > r) leftWins++;
          else if (r > l) rightWins++;
        });
        const winner = leftWins > rightWins ? left.name : right.name;
        const winCount = Math.max(leftWins, rightWins);
        return (
          <div className="insight-card" style={{ marginTop: '0.75rem' }}>
            <h4>⚔️ Verdict</h4>
            <p><strong style={{ color: 'var(--text-primary)' }}>{winner}</strong> leads in {winCount} out of {factors.length} factors.</p>
          </div>
        );
      })()}
    </div>
  );
};

export default HeadToHead;

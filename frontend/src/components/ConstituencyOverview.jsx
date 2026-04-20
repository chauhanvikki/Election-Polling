import React, { useEffect, useState } from 'react';

const ConstituencyOverview = () => {
  const [data, setData] = useState(null);
  const [historical, setHistorical] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, hRes] = await Promise.all([
          fetch('http://localhost:5000/api/constituency'),
          fetch('http://localhost:5000/api/historical')
        ]);
        const cData = await cRes.json();
        const hData = await hRes.json();
        if (cData.status === 'success') setData(cData.data);
        if (hData.status === 'success') setHistorical(hData.data);
      } catch (e) {
        console.error('Failed to load constituency data:', e);
      }
    };
    fetchData();
  }, []);

  if (!data) return null;

  const demo = data.demographics || {};
  const religion = demo.religion || {};
  const caste = demo.caste || {};

  return (
    <div>
      {/* Top info row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(79,142,255,0.08)', border: '1px solid rgba(79,142,255,0.15)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
            {(data.total_voters / 100000).toFixed(1)}L
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Total Voters</div>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {demo.youth_percentage || 0}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Youth Voters</div>
        </div>
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
            {demo.literacy_rate || 0}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Literacy Rate</div>
        </div>
      </div>

      {/* Demographics bars */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
          Religious Composition
        </div>
        {Object.entries(religion).map(([key, val]) => (
          <div key={key} style={{ marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))', borderRadius: '9999px', transition: 'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
          Caste Composition
        </div>
        {Object.entries(caste).map(([key, val]) => (
          <div key={key} style={{ marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{key}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-pink))', borderRadius: '9999px', transition: 'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Historical Turnout */}
      {historical.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
            Election History
          </div>
          {historical.map((h) => (
            <div key={h.year} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.5rem 0.65rem', marginBottom: '0.35rem',
              background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
              fontSize: '0.8rem'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.year}</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>{h.winner_party}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                Margin: {(h.winner_margin / 1000).toFixed(0)}K
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {h.turnout_percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConstituencyOverview;

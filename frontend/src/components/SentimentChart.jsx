import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SentimentChart = ({ data }) => {
  // Simulate 7-day sentiment history per candidate
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sentimentSeeds = {
    'cand_a': [0.1, -0.1, -0.2, 0.0, -0.3, -0.1, -0.15],
    'cand_b': [0.5, 0.6, 0.4, 0.7, 0.8, 0.65, 0.75],
    'cand_c': [-0.3, -0.2, -0.4, -0.1, -0.5, -0.3, -0.2]
  };

  const chartData = days.map((day, i) => {
    const point = { day };
    data.forEach(cand => {
      const seeds = sentimentSeeds[cand.id] || Array(7).fill(0);
      point[cand.name] = seeds[i];
    });
    return point;
  });

  const colors = ['#4f8eff', '#a855f7', '#22c55e'];

  // Build stacked bars for each candidate per day
  // Actually let's do a grouped bar
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0e1525',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          fontSize: '0.78rem'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.35rem', color: '#e8edf5' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, marginBottom: '0.1rem' }}>
              {entry.name.replace('Candidate ', '').split(' ')[0]}:{' '}
              <strong>{entry.value > 0 ? '+' : ''}{entry.value.toFixed(2)}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="timeline-container" style={{ height: '220px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#7b8ca8', fontSize: 11 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} 
            tickLine={false}
          />
          <YAxis 
            domain={[-1, 1]} 
            tick={{ fill: '#4a5568', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {data.map((cand, index) => (
            <Bar 
              key={cand.id} 
              dataKey={cand.name} 
              fill={colors[index % colors.length]}
              radius={[3, 3, 0, 0]}
              opacity={0.85}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;

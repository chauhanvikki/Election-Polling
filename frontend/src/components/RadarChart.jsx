import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RadarChartComponent = ({ data, factors }) => {
  const chartData = factors.map(factor => {
    const dataPoint = { subject: factor.name.replace('(OSINT)', '').replace('Religious/', 'R/').trim() };
    data.forEach(cand => {
      dataPoint[cand.name] = cand.scores[factor.id].value;
    });
    return dataPoint;
  });

  const colors = ['#4f8eff', '#a855f7', '#22c55e'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0e1525',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          fontSize: '0.8rem'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#e8edf5' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, marginBottom: '0.15rem' }}>
              {entry.name.replace('Candidate ', '').split(' ')[0]}: <strong>{entry.value}/10</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="radar-container">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#7b8ca8', fontSize: 10, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 10]} 
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} 
            axisLine={false} 
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => value.replace('Candidate ', '').split(' ')[0]}
          />
          
          {data.map((cand, index) => (
            <Radar
              key={cand.id}
              name={cand.name}
              dataKey={cand.name}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

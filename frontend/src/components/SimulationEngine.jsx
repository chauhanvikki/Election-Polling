import React, { useState, useEffect } from 'react';

const SimulationEngine = ({ candidate }) => {
  const [sentimentSlider, setSentimentSlider] = useState(0.2);
  const [swingVoterSlider, setSwingVoterSlider] = useState(10);
  const [turnoutSlider, setTurnoutSlider] = useState(65);
  const [livePow, setLivePow] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const incumbency = candidate.scores.incumbency.value >= 5 ? 1 : 0;
        const partyStrength = candidate.scores.party_strength.value;
        const demographics = candidate.scores.demographic_base.value + (swingVoterSlider / 100);
        // Turnout factor adjusts sentiment weight
        const adjustedSentiment = sentimentSlider * (turnoutSlider / 65);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            incumbency,
            party_strength: partyStrength,
            sentiment: adjustedSentiment,
            demographics
          })
        });
        const data = await response.json();
        if (data.status === 'success') {
          setLivePow(data.probability_of_win);
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error("Prediction error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPrediction, 300);
    return () => clearTimeout(timer);
  }, [sentimentSlider, swingVoterSlider, turnoutSlider, candidate]);

  const getDotColor = () => {
    if (candidate.name.includes('A')) return 'var(--accent-blue)';
    if (candidate.name.includes('B')) return 'var(--accent-purple)';
    return 'var(--success)';
  };

  const getRecClass = (rec) => {
    if (rec.type === 'critical' || rec.type === 'warning') return 'rec-item critical';
    if (rec.type === 'success') return 'rec-item success';
    return 'rec-item';
  };

  return (
    <div className="sim-card">
      <div className="sim-candidate-name">
        <span className="sim-candidate-dot" style={{ background: getDotColor() }} />
        {candidate.name}
      </div>

      <div className="slider-group">
        <div className="slider-label">
          <span>Sentiment Shift</span>
          <span>{sentimentSlider > 0 ? '+' : ''}{sentimentSlider.toFixed(1)}</span>
        </div>
        <input
          type="range" min="-1.0" max="1.0" step="0.1"
          value={sentimentSlider}
          onChange={(e) => setSentimentSlider(parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-label">
          <span>Swing Voters</span>
          <span>{swingVoterSlider}%</span>
        </div>
        <input
          type="range" min="0" max="30" step="1"
          value={swingVoterSlider}
          onChange={(e) => setSwingVoterSlider(parseInt(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-label">
          <span>Voter Turnout</span>
          <span>{turnoutSlider}%</span>
        </div>
        <input
          type="range" min="40" max="90" step="1"
          value={turnoutSlider}
          onChange={(e) => setTurnoutSlider(parseInt(e.target.value))}
        />
      </div>

      <div className="sim-pow-result">
        <div className={`sim-pow-number ${livePow > 50 ? 'win' : 'lose'}`}>
          {loading ? '—' : `${livePow}%`}
        </div>
        <div className="sim-pow-subtitle">ML Predicted PoW</div>
      </div>

      {recommendations.length > 0 && (
        <div>
          {recommendations.map((rec, idx) => (
            <div key={idx} className={getRecClass(rec)}>
              {rec.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationEngine;

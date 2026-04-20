import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [powRes, factorsRes] = await Promise.all([
          fetch(`${API_URL}/api/pow`),
          fetch(`${API_URL}/api/factors`)
        ]);

        if (!powRes.ok || !factorsRes.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const powData = await powRes.json();
        const factorsData = await factorsRes.json();

        setData(powData.data);
        setFactors(factorsData.data);
        setSelectedCandidate(powData.data[0]?.id || null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalFactors = factors.length;
  const totalCandidates = data.length;
  const avgSentiment = data.length > 0
    ? (data.reduce((acc, c) => acc + (c.scores.digital_sentiment?.value || 0), 0) / data.length).toFixed(1)
    : 0;

  const weights = { incumbency: 1.5, party_strength: 1.2, past_work: 1.4, personal_base: 1.3, demographic_base: 1.6, digital_sentiment: 1.0 };
  const topCandidate = [...data].sort((a, b) => {
    const scoreA = Object.entries(a.scores).reduce((s, [k, v]) => s + v.value * (weights[k] || 1), 0);
    const scoreB = Object.entries(b.scores).reduce((s, [k, v]) => s + v.value * (weights[k] || 1), 0);
    return scoreB - scoreA;
  })[0];

  const value = {
    data,
    factors,
    loading,
    error,
    selectedCandidate,
    setSelectedCandidate,
    stats: {
      totalFactors,
      totalCandidates,
      avgSentiment,
      topCandidate
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

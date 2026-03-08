import React, { useState, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getHistorical } from '../services/weatherApi';
import { History, AlertCircle } from 'lucide-react';

const Historical = () => {
    const { globalQuery } = useWeatherContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default to 1 week ago
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });

    useEffect(() => {
        if (!globalQuery) {
            setLoading(false);
            return;
        }

        let active = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getHistorical(globalQuery, selectedDate);
                if (active) setData(res);
            } catch (err) {
                if (active) setError(err.message || 'Unable to fetch historical archive');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => { active = false; };
    }, [globalQuery, selectedDate]);

    const isPermissionError = error && (error.includes('105') || error.toLowerCase().includes('plan restricts') || error.toLowerCase().includes('historical'));

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Historical Repository</h1>
                <p className="page-subtitle">Examine past weather behavior for {globalQuery}</p>
            </div>

            <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Target Date:</span>
                <input
                    type="date"
                    className="input-base"
                    value={selectedDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="dashboard-grid">
                <div className="col-span-12 glass-panel" style={{ padding: '32px' }}>

                    {isPermissionError ? (
                        <div className="state-container" style={{ border: '1px dashed var(--border-divider)', background: 'transparent', borderRadius: 'inherit' }}>
                            <AlertCircle size={48} className="icon" color="var(--status-warning)" />
                            <h3 style={{ margin: '12px 0 4px', color: 'var(--text-core)' }}>Historical Access Restricted</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>
                                Your current API subscription does not include access to the historical weather archive endpoint.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="state-container">
                            <History size={32} className="icon animate-pulse" />
                            <p>Querying archival records...</p>
                        </div>
                    ) : error ? (
                        <div className="state-container">
                            <p style={{ color: 'var(--status-error)' }}>{error}</p>
                        </div>
                    ) : data?.historical ? (
                        <div className="metric-card">
                            <h3 style={{ marginBottom: '16px' }}>Records for {selectedDate}</h3>
                            {/* Render real historical data if tier supports it */}
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    );
};

export default Historical;

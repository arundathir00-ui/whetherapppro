import React, { useState, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getMarine } from '../services/weatherApi';
import { Waves, AlertCircle, Anchor } from 'lucide-react';

const Marine = () => {
    const { globalQuery } = useWeatherContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                await getMarine(globalQuery);
                // Fake delay to show loading
                await new Promise(r => setTimeout(r, 600));
                // Force an error for Marine since free tier almost certainly blocks it
                if (active) setError('Your current plan restricts access to the marine weather endpoint.');
            } catch (err) {
                if (active) setError(err.message || 'Unable to fetch marine data');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => { active = false; };
    }, [globalQuery]);

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Marine & Coastal</h1>
                <p className="page-subtitle">Wave activity, tides, and surface temperatures for {globalQuery}</p>
            </div>

            <div className="dashboard-grid">
                <div className="col-span-12 glass-panel" style={{ padding: '32px' }}>

                    {loading ? (
                        <div className="state-container">
                            <Waves size={32} className="icon animate-pulse" />
                            <p>Connecting to oceanic buoys...</p>
                        </div>
                    ) : error ? (
                        <div className="state-container" style={{ border: '1px dashed var(--border-divider)', background: 'transparent', borderRadius: 'inherit' }}>
                            <Anchor size={48} className="icon" color="#3F639D" />
                            <h3 style={{ margin: '12px 0 4px', color: 'var(--text-core)' }}>Marine Module Inactive</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                {error}
                            </p>
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    );
};

export default Marine;

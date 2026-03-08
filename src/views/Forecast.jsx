import React, { useState, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getForecast } from '../services/weatherApi';
import { CalendarDays, AlertCircle } from 'lucide-react';

const Forecast = () => {
    const { globalQuery } = useWeatherContext();
    const [data, setData] = useState(null);
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
                const res = await getForecast(globalQuery, 7);
                if (active) setData(res);
            } catch (err) {
                if (active) setError(err.message || 'Unable to load forecast data');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => { active = false; };
    }, [globalQuery]);

    if (loading) {
        return (
            <div className="state-container fade-in">
                <CalendarDays size={32} className="icon animate-pulse" />
                <p>Compiling 7-day algorithmic forecast...</p>
            </div>
        );
    }

    // Weatherstack Free Tier does not support Forecast endpoint. We must gracefully degrade.
    const isPermissionError = error && (error.includes('105') || error.toLowerCase().includes('plan restricts') || error.toLowerCase().includes('forecast'));

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Extended Forecast</h1>
                <p className="page-subtitle">Predictive meteorological modeling for {globalQuery}</p>
            </div>

            <div className="dashboard-grid">
                <div className="col-span-12 glass-panel" style={{ padding: '32px' }}>

                    {(error || !data?.forecast) && !isPermissionError ? (
                        <div className="state-container">
                            <AlertCircle size={32} className="icon" color="var(--status-error)" />
                            <p style={{ color: 'var(--status-error)' }}>{error || 'Forecast data unavailable for this specific region.'}</p>
                        </div>
                    ) : isPermissionError ? (
                        <div className="state-container" style={{ border: '1px dashed var(--border-divider)', background: 'transparent', borderRadius: 'inherit' }}>
                            <AlertCircle size={48} className="icon" color="var(--status-warning)" />
                            <h3 style={{ margin: '12px 0 4px', color: 'var(--text-core)' }}>Upgrade Required</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>
                                The <strong style={{ color: 'var(--text-core)' }}>Weatherstack Standard Plan</strong> is required to access predictive forecasting algorithms.
                            </p>
                            <button className="btn-base btn-primary" style={{ marginTop: '24px' }}>
                                View Upgrade Options
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* If user HAS premium API key, map out table here */}
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Condition</th>
                                        <th>Avg Temp</th>
                                        <th>Min/Max</th>
                                        <th>UV Index</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(data.forecast).map((day) => (
                                        <tr key={day.date}>
                                            <td><strong>{day.date}</strong></td>
                                            <td>{day.astro.sunrise} / {day.astro.sunset}</td>
                                            <td>{day.avgtemp}°C</td>
                                            <td>{day.mintemp}°C / {day.maxtemp}°C</td>
                                            <td>{day.uv_index}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Forecast;

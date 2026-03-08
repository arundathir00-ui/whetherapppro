import React, { useState, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getCurrentWeather } from '../services/weatherApi';
import { Wind, Droplets, CloudFog, Compass, Thermometer, CloudLightning, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';

const CurrentWeather = () => {
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
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getCurrentWeather(globalQuery);
                if (active) setData(res);
            } catch (err) {
                if (active) setError(err.message || 'Unable to load weather data');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchWeather();
        return () => { active = false; };
    }, [globalQuery]);

    const getWeatherIcon = (descriptions, isDay) => {
        if (!descriptions || descriptions.length === 0) return <Sun size={48} color="var(--accent-primary)" />;
        const desc = descriptions[0].toLowerCase();

        if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain size={48} color="#60A5FA" />;
        if (desc.includes('snow') || desc.includes('ice')) return <CloudSnow size={48} color="#BAE6FD" />;
        if (desc.includes('thunder')) return <CloudLightning size={48} color="#FBBF24" />;
        if (desc.includes('cloud')) return <Cloud size={48} color="#94A3B8" />;

        return isDay === 'yes' ? <Sun size={48} color="#FCD34D" /> : <Sun size={48} color="#818CF8" />;
    };

    if (loading) {
        return (
            <div className="state-container fade-in">
                <CloudRain size={32} className="icon animate-pulse" />
                <p>Syncing atmospheric data via satellite...</p>
            </div>
        );
    }

    if (error || !data?.current) {
        return (
            <div className="state-container fade-in">
                <CloudLightning size={32} className="icon" color="var(--status-error)" />
                <p style={{ color: 'var(--status-error)' }}>{error || 'No active weather stream found.'}</p>
                <p className="page-subtitle">Verify your query or check API connection status.</p>
            </div>
        );
    }

    const { current, location } = data;

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Current Conditions</h1>
                <p className="page-subtitle">Real-time metrics for {location.name}, {location.country}</p>
            </div>

            <div className="dashboard-grid">
                {/* Main Display */}
                <div className="col-span-12 glass-panel">
                    <div className="main-weather-display">
                        <div className="weather-identity">
                            <div className="weather-icon-container">
                                {getWeatherIcon(current.weather_descriptions, current.is_day)}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem' }}>{location.name}</h2>
                                <div className="flex-align-center" style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                                    <CloudFog size={14} />
                                    <span>Local Time: {location.localtime}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div className="temperature-huge">
                                {current.temperature}°
                            </div>
                            <div className="condition-text">
                                {current.weather_descriptions ? current.weather_descriptions.join(', ') : 'Clear'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Metrics */}
                <div className="col-span-4 glass-panel metric-card">
                    <div className="metric-header">
                        <Thermometer size={14} /> Feels Like
                    </div>
                    <div className="metric-value">
                        {current.feelslike} <span className="metric-unit">°C</span>
                    </div>
                </div>

                <div className="col-span-4 glass-panel metric-card">
                    <div className="metric-header">
                        <Wind size={14} /> Wind Velocity
                    </div>
                    <div className="metric-value">
                        {current.wind_speed} <span className="metric-unit">km/h {current.wind_dir}</span>
                    </div>
                </div>

                <div className="col-span-4 glass-panel metric-card">
                    <div className="metric-header">
                        <Droplets size={14} /> Humidity
                    </div>
                    <div className="metric-value">
                        {current.humidity} <span className="metric-unit">%</span>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="col-span-6 glass-panel metric-card">
                    <div className="metric-header">
                        <Compass size={14} /> Pressure
                    </div>
                    <div className="metric-value">
                        {current.pressure} <span className="metric-unit">MB</span>
                    </div>
                </div>

                <div className="col-span-6 glass-panel metric-card">
                    <div className="metric-header">
                        Visibility Index
                    </div>
                    <div className="metric-value">
                        {current.visibility} <span className="metric-unit">km</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;

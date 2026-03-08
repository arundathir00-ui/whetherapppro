import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, CloudLightning, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { getWeather } from '../services/weatherApi';

const WeatherDashboard = () => {
    const [query, setQuery] = useState('London');
    const [searchInput, setSearchInput] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeather(city);
            setWeatherData(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(query);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setQuery(searchInput.trim());
            setSearchInput('');
        }
    };

    const getWeatherIcon = (description, isDay) => {
        const desc = description.toLowerCase();
        if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
            return <CloudRain size={64} className="text-blue-400" />;
        } else if (desc.includes('snow') || desc.includes('ice') || desc.includes('blizzard')) {
            return <CloudSnow size={64} className="text-blue-200" />;
        } else if (desc.includes('thunder') || desc.includes('lightning')) {
            return <CloudLightning size={64} className="text-yellow-400" />;
        } else if (desc.includes('cloud') || desc.includes('overcast')) {
            return <Cloud size={64} className="text-gray-300" />;
        } else {
            return isDay === 'yes' ? <Sun size={64} className="text-yellow-500" /> : <Sun size={64} className="text-indigo-300" />;
        }
    };

    const current = weatherData?.current;
    const location = weatherData?.location;

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1 className="text-gradient">Nova Weather</h1>
            </header>

            <main className="main-content">
                <div className="search-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search for a city..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="error-message glass-panel animate-fade-in">
                        <p>{error}</p>
                    </div>
                )}

                {loading && !weatherData && (
                    <div className="loading-state animate-fade-in">
                        <div className="loader"></div>
                        <p>Gathering atmospheric data...</p>
                    </div>
                )}

                {!loading && weatherData && current && location && (
                    <div className="weather-card glass-panel animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="weather-main">
                            <div className="location-info">
                                <h2 className="city-name">{location.name}</h2>
                                <p className="region-name">
                                    <MapPin size={16} /> {location.region}, {location.country}
                                </p>
                                <p className="local-time">{location.localtime}</p>
                            </div>

                            <div className="temperature-container">
                                <div className="weather-icon-large">
                                    {current.weather_descriptions && current.weather_descriptions.length > 0
                                        ? getWeatherIcon(current.weather_descriptions[0], current.is_day)
                                        : <Sun size={64} />}
                                </div>
                                <div className="temperature-value">
                                    {current.temperature}<span>°C</span>
                                </div>
                                <p className="weather-description">
                                    {current.weather_descriptions ? current.weather_descriptions.join(', ') : 'Clear'}
                                </p>
                            </div>
                        </div>

                        <div className="weather-details">
                            <div className="detail-item">
                                <div className="detail-icon"><Thermometer size={24} /></div>
                                <div className="detail-info">
                                    <span className="detail-label">Feels Like</span>
                                    <span className="detail-value">{current.feelslike}°C</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon"><Wind size={24} /></div>
                                <div className="detail-info">
                                    <span className="detail-label">Wind</span>
                                    <span className="detail-value">{current.wind_speed} km/h {current.wind_dir}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon"><Droplets size={24} /></div>
                                <div className="detail-info">
                                    <span className="detail-label">Humidity</span>
                                    <span className="detail-value">{current.humidity}%</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon"><Cloud size={24} /></div>
                                <div className="detail-info">
                                    <span className="detail-label">Cloud Cover</span>
                                    <span className="detail-value">{current.cloudcover}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WeatherDashboard;

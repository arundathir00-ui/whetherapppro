import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

const TopBar = () => {
    const { setGlobalQuery } = useWeatherContext();
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setGlobalQuery(searchInput.trim());
            setSearchInput('');
        }
    };

    return (
        <header className="topbar">
            <form onSubmit={handleSearch} className="global-search">
                <Search className="search-icon" size={16} />
                <input
                    type="text"
                    placeholder="Search location, zip code, or IP..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </form>

            <div className="flex-align-center" style={{ gap: '16px' }}>
                <button className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
                    <Bell size={18} />
                </button>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>
                    <User size={16} color="var(--text-muted)" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudRain, CalendarDays, History, Waves, Settings } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand">
                    <CloudRain className="brand-icon" size={24} />
                    <span>Atmos<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Cast</span></span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <CloudRain size={18} />
                    Current Conditions
                </NavLink>

                <NavLink
                    to="/forecast"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <CalendarDays size={18} />
                    14-Day Forecast
                </NavLink>

                <NavLink
                    to="/historical"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <History size={18} />
                    Historical Data
                </NavLink>

                <NavLink
                    to="/marine"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Waves size={18} />
                    Marine & Coastal
                </NavLink>

                <div style={{ flex: 1 }}></div>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Settings size={18} />
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;

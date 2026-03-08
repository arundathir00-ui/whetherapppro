import React, { createContext, useState, useContext } from 'react';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [globalQuery, setGlobalQuery] = useState('');

    return (
        <WeatherContext.Provider value={{ globalQuery, setGlobalQuery }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
};

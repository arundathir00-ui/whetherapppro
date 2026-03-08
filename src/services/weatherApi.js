import axios from 'axios';

const API_KEY = '78a1396d8659d97a0a41f8d7fa974ee6';
const BASE_URL = 'http://api.weatherstack.com';

const handleResponse = (response) => {
  if (response.data.error) {
    // Check specifically for rate limit errors
    if (response.data.error.code === 104 || response.data.error.code === 106) {
      throw new Error('API Rate Limit Exceeded. Please wait a moment and try again.');
    }
    // General Weatherstack permissions errors
    throw new Error(response.data.error.info || 'API Error Occurred');
  }
  return response.data;
};

export const getCurrentWeather = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      params: { access_key: API_KEY, query },
    });
    return handleResponse(response);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('API Rate Limit Exceeded (429). Please wait a moment.');
    }
    if (error.response) throw new Error('Network response was not ok');
    throw error;
  }
};

export const getForecast = async (query, forecast_days = 7) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { access_key: API_KEY, query, forecast_days },
    });
    return handleResponse(response);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('plan restricts or rate limit 429'); // "plan restricts" triggers the graceful UI degrade
    }
    throw error;
  }
};

export const getHistorical = async (query, historical_date) => {
  try {
    // Weatherstack strict requirement format: YYYY-MM-DD
    const response = await axios.get(`${BASE_URL}/historical`, {
      params: { access_key: API_KEY, query, historical_date },
    });
    return handleResponse(response);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('plan restricts or rate limit 429'); // Triggers graceful degrade
    }
    throw error;
  }
};

export const getMarine = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, { // Note: 'marine' might require specific tier, fallback to current or actual marine endpoint
      params: { access_key: API_KEY, query },
    });
    return handleResponse(response);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('Your current plan restricts access to the marine weather endpoint.');
    }
    throw error;
  }
};

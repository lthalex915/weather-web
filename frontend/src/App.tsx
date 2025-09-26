import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import StationSelector from './components/StationSelector';
import { WeatherData } from './types';

type TabType = 'today' | 'hourly' | '10-day' | 'settings';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [selectedStationIndex, setSelectedStationIndex] = useState<number>(0);
  const [showStationSelector, setShowStationSelector] = useState<boolean>(false);
  const [justLoaded, setJustLoaded] = useState<boolean>(true);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WeatherData[] = await response.json();
      setWeatherData(data.slice(0, 21)); // Limit to 21 stations
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStationSelect = (index: number) => {
    setSelectedStationIndex(index);
    setShowStationSelector(false);
  };

  const handleBackClick = () => {
    setShowStationSelector(false);
  };

  // Hide the station selector after initial data load to show WeatherCard by default
  useEffect(() => {
    if (!loading && weatherData.length > 0 && justLoaded) {
      setShowStationSelector(false);
      setJustLoaded(false);
    }
  }, [loading, weatherData, justLoaded]);

  const currentWeatherData = weatherData[selectedStationIndex];

  if (loading && weatherData.length === 0) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (showStationSelector) {
    return (
      <StationSelector
        weatherData={weatherData}
        selectedIndex={selectedStationIndex}
        onStationSelect={handleStationSelect}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div className="app">
      <div className="weather-container">
        <div className="header">
          <button 
            className="back-button"
            onClick={() => setShowStationSelector(true)}
            aria-label="Open station selector"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchWeatherData} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {currentWeatherData && (
          <WeatherCard 
            weatherData={currentWeatherData} 
            isMainView={true}
          />
        )}

        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Today</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span>Hourly</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === '10-day' ? 'active' : ''}`}
            onClick={() => setActiveTab('10-day')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>10-Day</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15A1.65 1.65 0 0 0 21 13.09A1.65 1.65 0 0 0 19.4 9M4.6 9A1.65 1.65 0 0 0 3 10.91A1.65 1.65 0 0 0 4.6 15M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

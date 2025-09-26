import React from 'react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weatherData: WeatherData;
  isMainView?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, isMainView = false }) => {
  const { station, temperature, uvIndex, recordTime, error } = weatherData;

  const getWeatherIcon = (temp: string, uvValue: string) => {
    const tempValue = parseFloat(temp);
    const uv = uvValue && uvValue !== '//' ? parseFloat(uvValue) : 0;
    
    // Simple logic to determine weather icon based on temperature and UV
    if (uv > 5 && tempValue > 25) {
      return (
        <div className="weather-icon sunny-rainy">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Sun */}
            <circle cx="45" cy="35" r="15" fill="url(#sunGradient)"/>
            <g stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round">
              <line x1="45" y1="10" x2="45" y2="15"/>
              <line x1="45" y1="55" x2="45" y2="60"/>
              <line x1="20" y1="35" x2="25" y2="35"/>
              <line x1="65" y1="35" x2="70" y2="35"/>
              <line x1="28.5" y1="17.5" x2="31.5" y2="20.5"/>
              <line x1="58.5" y1="49.5" x2="61.5" y2="52.5"/>
              <line x1="28.5" y1="52.5" x2="31.5" y2="49.5"/>
              <line x1="58.5" y1="20.5" x2="61.5" y2="17.5"/>
            </g>
            {/* Cloud */}
            <ellipse cx="60" cy="65" rx="25" ry="18" fill="url(#cloudGradient)"/>
            <circle cx="45" cy="60" r="12" fill="url(#cloudGradient)"/>
            <circle cx="75" cy="60" r="15" fill="url(#cloudGradient)"/>
            {/* Rain drops */}
            <g fill="#4A90E2" opacity="0.8">
              <ellipse cx="50" cy="85" rx="2" ry="6"/>
              <ellipse cx="60" cy="90" rx="2" ry="6"/>
              <ellipse cx="70" cy="85" rx="2" ry="6"/>
              <ellipse cx="55" cy="95" rx="1.5" ry="4"/>
              <ellipse cx="65" cy="95" rx="1.5" ry="4"/>
            </g>
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700"/>
                <stop offset="100%" stopColor="#FFA500"/>
              </linearGradient>
              <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB"/>
                <stop offset="100%" stopColor="#4A90E2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }
    
    return (
      <div className="weather-icon sunny">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="20" fill="url(#sunGradient)"/>
          <g stroke="url(#sunGradient)" strokeWidth="4" strokeLinecap="round">
            <line x1="60" y1="20" x2="60" y2="30"/>
            <line x1="60" y1="90" x2="60" y2="100"/>
            <line x1="20" y1="60" x2="30" y2="60"/>
            <line x1="90" y1="60" x2="100" y2="60"/>
            <line x1="31.7" y1="31.7" x2="38.1" y2="38.1"/>
            <line x1="81.9" y1="81.9" x2="88.3" y2="88.3"/>
            <line x1="31.7" y1="88.3" x2="38.1" y2="81.9"/>
            <line x1="81.9" y1="38.1" x2="88.3" y2="31.7"/>
          </g>
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const getWeatherCondition = (temp: string, uvValue: string) => {
    const tempValue = parseFloat(temp);
    const uv = uvValue && uvValue !== '//' ? parseFloat(uvValue) : 0;
    
    if (uv > 5 && tempValue > 25) return "Sunny";
    if (tempValue > 30) return "Hot";
    if (tempValue > 20) return "Warm";
    return "Cool";
  };

  const formatRecordTime = (recordTime: any): string => {
    try {
      const { year, month, day, hour, minute } = recordTime;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    } catch {
      return 'N/A';
    }
  };

  if (error) {
    return (
      <div className={`weather-card ${isMainView ? 'main-view' : ''}`}>
        <div className="error-state">
          <p>Failed to load weather data</p>
          <p className="station-name">{station.name_en}</p>
        </div>
      </div>
    );
  }

  if (isMainView) {
    return (
      <div className="weather-card main-view">
        <div className="main-weather-content">
          {getWeatherIcon(temperature.Value, uvIndex?.Value || '//')}
          
          <div className="main-temperature">
            {temperature.Value}°{temperature.Unit}
          </div>
          
          <div className="weather-condition">
            {getWeatherCondition(temperature.Value, uvIndex?.Value || '//')}
          </div>
          
          <div className="small-weather-icon">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <ellipse cx="30" cy="25" rx="15" ry="10" fill="url(#smallCloudGradient)"/>
              <circle cx="20" cy="22" r="8" fill="url(#smallCloudGradient)"/>
              <circle cx="40" cy="22" r="10" fill="url(#smallCloudGradient)"/>
              <circle cx="25" cy="15" r="6" fill="url(#smallSunGradient)"/>
              <defs>
                <linearGradient id="smallCloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#87CEEB"/>
                  <stop offset="100%" stopColor="#4A90E2"/>
                </linearGradient>
                <linearGradient id="smallSunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700"/>
                  <stop offset="100%" stopColor="#FFA500"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="station-location">
            <div className="station-name">{station.name_en}</div>
            <div className="station-name-chinese">{station.name_tc}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <div className="station-name">{station.name_en}</div>
      <div className="station-name-chinese">{station.name_tc}</div>
      
      <div className="temperature">
        {temperature.Value}
        <span className="temperature-unit">°{temperature.Unit}</span>
      </div>

      <div className="weather-info">
        <div className="info-row">
          <span className="info-label">UV Index</span>
          <span className="info-value">
            {!uvIndex || uvIndex.Value === '//' || uvIndex.Value === '' ? (
              <span className="uv-index">N/A</span>
            ) : (
              <span className="uv-index">
                {uvIndex.Value} {uvIndex.Intensity_En && `(${uvIndex.Intensity_En})`}
              </span>
            )}
          </span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Last Updated</span>
          <span className="info-value">{formatRecordTime(recordTime)}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Location</span>
          <span className="info-value">
            {station.coordinates[1].toFixed(4)}°N, {station.coordinates[0].toFixed(4)}°E
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

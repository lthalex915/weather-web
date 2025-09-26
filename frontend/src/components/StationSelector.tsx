import React from 'react';
import { WeatherData } from '../types';

interface StationSelectorProps {
  weatherData: WeatherData[];
  selectedIndex: number;
  onStationSelect: (index: number) => void;
  onBack: () => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  weatherData,
  selectedIndex,
  onStationSelect,
  onBack
}) => {
  return (
    <div className="station-selector">
      <div className="station-selector-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2>Select Weather Station</h2>
      </div>

      <div className="station-list">
        {weatherData.map((data, index) => (
          <button
            key={data.station.id}
            className={`station-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => onStationSelect(index)}
          >
            <div className="station-info">
              <div className="station-name">{data.station.name_en}</div>
              <div className="station-name-chinese">{data.station.name_tc}</div>
            </div>
            <div className="station-temperature">
              {data.temperature.Value}°{data.temperature.Unit}
            </div>
            {index === selectedIndex && (
              <div className="selected-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StationSelector;

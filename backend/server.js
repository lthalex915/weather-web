const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend/dist directory (production build)
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// HK Government Weather API URLs
const WEATHER_STATIONS_URL = 'https://portal.csdi.gov.hk/server/services/common/hko_rcd_1634806665997_63899/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=current_weather_report_weather_station&outputFormat=geojson&maxFeatures=21';

// Cache for weather data (simple in-memory cache)
let weatherCache = {
  stations: null,
  stationData: {},
  lastUpdated: null
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Helper function to check if cache is valid
const isCacheValid = () => {
  return weatherCache.lastUpdated && 
         (Date.now() - weatherCache.lastUpdated) < CACHE_DURATION;
};

// Get all weather stations
app.get('/api/stations', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid() && weatherCache.stations) {
      return res.json(weatherCache.stations);
    }

    const response = await axios.get(WEATHER_STATIONS_URL);
    const stations = response.data.features.map(feature => ({
      id: feature.properties.fid,
      name_en: feature.properties.weather_station_en,
      name_tc: feature.properties.weather_station_tc,
      name_sc: feature.properties.weather_station_sc,
      coordinates: feature.geometry.coordinates,
      url: feature.properties.url
    }));

    // Update cache
    weatherCache.stations = stations;
    weatherCache.lastUpdated = Date.now();

    res.json(stations);
  } catch (error) {
    console.error('Error fetching weather stations:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather stations' });
  }
});

// Get weather data for a specific station
app.get('/api/weather/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    
    // Check cache first
    if (isCacheValid() && weatherCache.stationData[stationId]) {
      return res.json(weatherCache.stationData[stationId]);
    }

    // Get station info first
    if (!weatherCache.stations || !isCacheValid()) {
      const stationsResponse = await axios.get(WEATHER_STATIONS_URL);
      weatherCache.stations = stationsResponse.data.features.map(feature => ({
        id: feature.properties.fid,
        name_en: feature.properties.weather_station_en,
        name_tc: feature.properties.weather_station_tc,
        name_sc: feature.properties.weather_station_sc,
        coordinates: feature.geometry.coordinates,
        url: feature.properties.url
      }));
    }

    const station = weatherCache.stations.find(s => s.id === parseInt(stationId));
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Fetch weather data for the specific station
    const weatherResponse = await axios.get(station.url);
    const weatherData = {
      station: station,
      temperature: weatherResponse.data.Temperature,
      uvIndex: weatherResponse.data.UV_Index,
      recordTime: {
        year: weatherResponse.data.Record_Time_Year,
        month: weatherResponse.data.Record_Time_Month,
        day: weatherResponse.data.Record_Time_Day,
        hour: weatherResponse.data.Record_Time_Hour,
        minute: weatherResponse.data.Record_Time_Minute,
        timezone: weatherResponse.data.Record_Time_Timezone
      }
    };

    // Update cache
    weatherCache.stationData[stationId] = weatherData;
    weatherCache.lastUpdated = Date.now();

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather data for all stations
app.get('/api/weather', async (req, res) => {
  try {
    // Get all stations first
    const stationsResponse = await axios.get(WEATHER_STATIONS_URL);
    const stations = stationsResponse.data.features.map(feature => ({
      id: feature.properties.fid,
      name_en: feature.properties.weather_station_en,
      name_tc: feature.properties.weather_station_tc,
      name_sc: feature.properties.weather_station_sc,
      coordinates: feature.geometry.coordinates,
      url: feature.properties.url
    }));

    // Fetch weather data for all stations (limit to first 10 to avoid overwhelming the API)
    const weatherPromises = stations.slice(0, 10).map(async (station) => {
      try {
        const response = await axios.get(station.url);
        return {
          station: station,
          temperature: response.data.Temperature,
          uvIndex: response.data.UV_Index,
          recordTime: {
            year: response.data.Record_Time_Year,
            month: response.data.Record_Time_Month,
            day: response.data.Record_Time_Day,
            hour: response.data.Record_Time_Hour,
            minute: response.data.Record_Time_Minute,
            timezone: response.data.Record_Time_Timezone
          }
        };
      } catch (error) {
        console.error(`Error fetching data for station ${station.name_en}:`, error.message);
        return {
          station: station,
          error: 'Failed to fetch data'
        };
      }
    });

    const weatherData = await Promise.all(weatherPromises);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching all weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

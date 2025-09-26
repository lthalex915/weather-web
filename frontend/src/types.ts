export interface WeatherStation {
  id: number;
  name_en: string;
  name_tc: string;
  name_sc: string;
  coordinates: [number, number];
  url: string;
}

export interface Temperature {
  Value: string;
  Unit: string;
}

export interface UVIndex {
  Value: string;
  Intensity_En: string;
  Intensity_Tc: string;
  Intensity_Sc: string;
  Record_Desc_En: string;
  Record_Desc_Tc: string;
  Record_Desc_Sc: string;
}

export interface RecordTime {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  timezone: string;
}

export interface WeatherData {
  station: WeatherStation;
  temperature: Temperature;
  uvIndex?: UVIndex;
  recordTime: RecordTime;
  error?: string;
}

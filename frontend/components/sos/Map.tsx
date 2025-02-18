import React from 'react';
import { Platform } from 'react-native';

// Интерфейс для координат
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

// Интерфейс для пропсов `Map`
export interface MapProps {
  onNext: (location: LocationData | string) => void;
  selectedLocation?: LocationData | null;
}

// Динамически подгружаем нужную версию карты
const MapComponent = Platform.OS === 'web'
  ? require('./Map/web/Map.web').default  // Веб-версия (Leaflet) 
  : require('./Map/expo/Map.expo').default; // Expo-версия (WebView с OSM)

// ✅ Указываем тип пропсов
const Map: React.FC<MapProps> = (props) => <MapComponent {...props} />;

export default Map;

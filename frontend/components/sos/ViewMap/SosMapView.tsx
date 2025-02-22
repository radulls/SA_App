import React from 'react';
import { Platform } from 'react-native';

// Интерфейс для пропсов карты
export interface SosMapViewProps {
  location: { latitude: number; longitude: number };
}

// Динамически подгружаем нужную версию карты
const SosMapComponent = Platform.OS === 'web'
  ? require('./SosMapView.web').default
  : require('./SosMapView.expo').default; 
// ✅ Оборачиваем компонент в типизацию
const SosMapView: React.FC<SosMapViewProps> = (props) => <SosMapComponent {...props} />;
export default SosMapView;

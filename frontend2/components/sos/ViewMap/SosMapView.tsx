import React from 'react';
import { Platform } from 'react-native';

export interface SosMapViewProps {
  location: { latitude: number; longitude: number };
  customIcon?: string; // 👈 добавить сюда
}

const SosMapComponent = Platform.OS === 'web'
  ? require('./SosMapView.web').default
  : require('./SosMapView.expo').default;

const SosMapView: React.FC<SosMapViewProps> = (props) => (
  <SosMapComponent {...props} /> // 👈 прокидываем customIcon
);

export default SosMapView;

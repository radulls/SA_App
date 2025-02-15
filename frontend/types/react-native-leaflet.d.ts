declare module 'react-native-leaflet' {
  import { ReactNode } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export interface MapViewProps {
    mapLayers: Array<{ url: string }>;
    mapCenterPosition: { lat: number; lng: number };
    zoom: number;
    style: StyleProp<ViewStyle>;
    onMapClick?: (e: { latlng: { lat: number; lng: number } }) => void;
    children?: ReactNode;
  }

  export interface MarkerProps {
    position: { lat: number; lng: number };
    icon: string;
  }

  export class MapView extends React.Component<MapViewProps> {}
  export class Marker extends React.Component<MarkerProps> {}
}
import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface DetailsData {
  title: string;
  description: string;
}

interface SosViewProps {
  location: LocationData | string | null;
  details: DetailsData;
}

const SosView: React.FC<SosViewProps> = ({ location, details }) => {
  const mapRegion = typeof location === 'object' && location !== null ? location : {
    latitude: 55.751244,
    longitude: 37.618423,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView 
        provider={PROVIDER_DEFAULT} 
        style={{ flex: 1 }}
        initialRegion={{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {typeof location === 'object' && location !== null && <Marker coordinate={location} />}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
      <Text>{details.title}</Text>
      <Text>{details.description}</Text>
    </View>
  );
};

export default SosView;

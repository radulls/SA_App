import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, MapPressEvent, UrlTile } from 'react-native-maps';

interface Props {
  onNext: (location: { latitude: number; longitude: number } | string) => void;
}

const Map: React.FC<Props> = ({ onNext }) => {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState('');

  const handlePress = (e: MapPressEvent) => {
    setMarker(e.nativeEvent.coordinate);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT} // Используем OSM
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 55.751244,
          longitude: 37.618423,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handlePress}
      >
        {marker && <Marker coordinate={marker} />}
        {/* Добавляем OSM слой */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Введите адрес"
      />
      <Button title="Всё верно" onPress={() => onNext(marker || address)} />
    </View>
  );
};

export default Map;

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const customIcon = L.icon({
  iconUrl: '/geotagIcon.svg',
  iconSize: [52, 70],
  iconAnchor: [26, 70],
  popupAnchor: [0, -70],
});

const MapComponent = ({ 
  selectedLocation, 
  setSelectedLocation, 
  setAddress 
}: { 
  selectedLocation: { latitude: number; longitude: number } | null; 
  setSelectedLocation: (location: { latitude: number; longitude: number }) => void;
  setAddress: (address: string) => void;
}) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapInstance && selectedLocation) {
      mapInstance.flyTo([selectedLocation.latitude, selectedLocation.longitude], 17, { duration: 1.5 });
    }
  }, [selectedLocation, mapInstance]);

  // Функция получения адреса по координатам
  const fetchAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&extratags=1`
      );
      const data = await response.json();
      if (data.address) {
        const formattedAddress = `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.city || data.address.town || data.address.village || ''}`.trim();
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
    }
  };

  // Обработчик клика по карте
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ latitude: lat, longitude: lng });
        fetchAddressFromCoordinates(lat, lng);
      },
    });
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <MapContainer
        center={[55.751244, 37.618423]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        whenReady={(map) => setMapInstance(map.target)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedLocation && (
          <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} icon={customIcon} />
        )}
        <MapClickHandler />
      </MapContainer>
    </View>
  );
};

export default MapComponent;

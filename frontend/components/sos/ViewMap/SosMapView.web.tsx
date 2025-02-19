import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

const isBrowser = typeof window !== 'undefined';
let L: any;

if (isBrowser) {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
}

const SosMapViewWeb = ({ location }: { location: { latitude: number; longitude: number } }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!isBrowser || !mapRef.current) return;

    const { map, tileLayer, marker, icon } = L;

    // ✅ Кастомный маркер
    const customIcon = icon({
      iconUrl: '/geotagIcon.svg',
      iconSize: [52, 70],
      iconAnchor: [26, 70],
      popupAnchor: [0, -70],
    });

    if (!mapInstance.current) {
      // ✅ Создаём карту
      mapInstance.current = map(mapRef.current,{
        zoomControl: false,
      }).setView([location.latitude, location.longitude], 16);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      markerRef.current = marker([location.latitude, location.longitude], { icon: customIcon }).addTo(mapInstance.current);
    } else {
      // ✅ Обновляем центр карты и маркер
      mapInstance.current.setView([location.latitude, location.longitude], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
    }
  }, [location]);

  return isBrowser ? (
    <View style={{ flex: 1 }}>
      <div ref={mapRef} id="map" style={{ width: '100%', height: '100%' }} />
    </View>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <p>Карта загружается...</p>
    </View>
  );
};

export default SosMapViewWeb;

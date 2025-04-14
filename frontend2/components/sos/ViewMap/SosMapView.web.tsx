import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

const isBrowser = typeof window !== 'undefined';
let L: any;

if (isBrowser) {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
}

const SosMapViewWeb = ({
  location,
  customIcon = 'geotagIcon', // 👈 теперь это ключ
}: {
  location: { latitude: number; longitude: number };
  customIcon?: string;
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!isBrowser || !mapRef.current) return;

    const { map, tileLayer, marker, icon } = L;

    // 👇 маппинг ключа на путь к SVG
    const iconMap: Record<string, string> = {
      geotagIcon: '/geotagIcon.svg',
      eventGeotag: '/eventGeotag.svg',
    };

    const iconUrl = iconMap[customIcon] || iconMap.geotagIcon;

    const iconToUse = icon({
      iconUrl,
      iconSize: [52, 70],
      iconAnchor: [26, 70],
      popupAnchor: [0, -70],
    });

    if (!mapInstance.current) {
      mapInstance.current = map(mapRef.current, {
        zoomControl: false,
      }).setView([location.latitude, location.longitude], 16);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      markerRef.current = marker([location.latitude, location.longitude], {
        icon: iconToUse,
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([location.latitude, location.longitude], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
    }
  }, [location, customIcon]);

  return (
    <View style={{ flex: 1 }}>
      <div ref={mapRef} id="map" style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

export default SosMapViewWeb;

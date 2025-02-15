import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

interface ExpoMapComponentProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  iconBase64: string;
  selectedLocation?: { latitude: number; longitude: number } | null;
}

const ExpoMapComponent: React.FC<ExpoMapComponentProps> = ({ onLocationSelect, iconBase64, selectedLocation }) => {
  const webViewRef = useRef<WebView>(null);
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Устанавливаем стартовую локацию только один раз
  useEffect(() => {
    if (selectedLocation && !initialLocation) {
      setInitialLocation(selectedLocation);
    }
  }, [selectedLocation, initialLocation]);

  // Функция для плавного перемещения карты
  const updateMarker = (latitude: number, longitude: number) => {
    if (webViewRef.current) {
      const message = JSON.stringify({
        type: 'UPDATE_MARKER',
        latitude,
        longitude
      });
      webViewRef.current.postMessage(message);
    }
  };

  // Если `selectedLocation` обновляется, плавно перемещаем карту
  useEffect(() => {
    if (selectedLocation && initialLocation) {
      updateMarker(selectedLocation.latitude, selectedLocation.longitude);
    }
  }, [selectedLocation]);

  // Если `selectedLocation` еще не загружено, не рендерим WebView
  if (!initialLocation) {
    return null; // Можно заменить на Loader, если нужно
  }

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OSM Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          body, html, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            var map = L.map('map').setView([${initialLocation.latitude}, ${initialLocation.longitude}], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            var customIcon = L.icon({
              iconUrl: '${iconBase64}',
              iconSize: [52, 70],
              iconAnchor: [26, 70],
              popupAnchor: [0, -70]
            });

            var marker = L.marker([${initialLocation.latitude}, ${initialLocation.longitude}], { icon: customIcon }).addTo(map);

            function moveToLocation(lat, lng) {
              map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
              setTimeout(() => {
                marker.setLatLng([lat, lng]);
              }, 500);
            }

            map.on('click', function(e) {
              moveToLocation(e.latlng.lat, e.latlng.lng);
              window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
            });

            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                if (data.type === 'UPDATE_MARKER') {
                  moveToLocation(data.latitude, data.longitude);
                }
              } catch (error) {
                console.error('Ошибка при обработке данных:', error);
              }
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: mapHtml }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        onLocationSelect(data);
      }}
    />
  );
};

export default ExpoMapComponent;

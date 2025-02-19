import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

interface SosMapViewProps {
  location: { latitude: number; longitude: number };
}

const SosMapView: React.FC<SosMapViewProps> = ({ location }) => {
  const webViewRef = useRef<WebView>(null);
  const [iconBase64, setIconBase64] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(require('@/assets/geotagIcom.png')); // 🔥 Загружаем кастомную иконку
        await asset.downloadAsync();
        const base64 = await FileSystem.readAsStringAsync(asset.localUri || '', {
          encoding: FileSystem.EncodingType.Base64,
        });
        setIconBase64(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error('❌ Ошибка загрузки иконки:', error);
      }
    })();
  }, []);

  if (!iconBase64) {
    return null; // 🔄 Ждём загрузку иконки
  }

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
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
          document.addEventListener("DOMContentLoaded", function () {
            var map = L.map('map', { zoomControl: false }).setView([${location.latitude}, ${location.longitude}], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // ✅ Используем кастомную иконку
            var customIcon = L.icon({
              iconUrl: "${iconBase64}",
              iconSize: [52, 70], 
              iconAnchor: [26, 70], 
              popupAnchor: [0, -70]
            });

            L.marker([${location.latitude}, ${location.longitude}], { icon: customIcon }).addTo(map);
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
      javaScriptEnabled
    />
  );
};

export default SosMapView;

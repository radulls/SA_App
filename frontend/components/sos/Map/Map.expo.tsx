import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapExpoProps {
  onNext: (location: { latitude: number; longitude: number } | string) => void;
}

const MapExpo: React.FC<MapExpoProps> = ({ onNext }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  // Функция автодополнения при вводе
  const fetchAddressSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`);
      const data = await response.json();
      const filtered = data.map((item: any) => ({
        label: `${item.address.city || item.address.town || item.address.village || ''}, ${item.address.road || ''}`.trim(),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
      setSuggestions(filtered);
    } catch (error) {
      console.error('Ошибка при получении подсказок:', error);
    }
  };

  // Выбор адреса из списка
  const selectAddress = (item: any) => {
    setAddress(item.label);
    setCoordinates({ latitude: item.latitude, longitude: item.longitude });
    setSuggestions([]);
    setModalVisible(false);
  };

  // HTML-карта для WebView
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([55.751244, 37.618423], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        var marker;
        map.on('click', function(e) {
          if (marker) {
            map.removeLayer(marker);
          }
          marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
        });

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.latitude && data.longitude) {
            if (marker) {
              map.removeLayer(marker);
            }
            marker = L.marker([data.latitude, data.longitude]).addTo(map);
            map.setView([data.latitude, data.longitude], 12);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          setCoordinates(data);
          setAddress(`${data.latitude}, ${data.longitude}`);
          onNext(data);
        }}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputContainer}>
        <Text style={styles.input}>{address || 'Введите город, улицу'}</Text>
      </TouchableOpacity>

      {/* Модальное окно поиска адреса */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              fetchAddressSuggestions(text);
            }}
            placeholder="Введите город, улицу"
            style={styles.searchInput}
          />
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectAddress(item)} style={styles.suggestionItem}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Закрыть" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Button title="Всё верно" onPress={() => onNext(coordinates || address)} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default MapExpo;

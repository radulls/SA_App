import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import L from 'leaflet';

let MapContainer: any, TileLayer: any, Marker: any, useMapEvents: any, mapInstance: L.Map | null = null;

if (typeof window !== 'undefined') {
  const L = require('leaflet');
  require('leaflet/dist/leaflet.css');

  const ReactLeaflet = require('react-leaflet');
  MapContainer = ReactLeaflet.MapContainer;
  TileLayer = ReactLeaflet.TileLayer;
  Marker = ReactLeaflet.Marker;
  useMapEvents = ReactLeaflet.useMapEvents;

  // Создание кастомной иконки
  var customIcon = L.icon({
    iconUrl: '/geotagIcon.svg', // Путь к SVG-файлу
    iconSize: [52, 70], // Размер иконки
    iconAnchor: [26, 70], // Якорная точка (центр внизу)
    popupAnchor: [0, -70], // Смещение pop-up (если используется)
  });
}

interface MapWebProps {
  onNext: (location: { latitude: number; longitude: number } | string) => void;
}

const MapWeb: React.FC<MapWebProps> = ({ onNext }) => {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // **Debounce для предотвращения лишних запросов**
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // **Центрирование карты на маркере**
  useEffect(() => {
    if (marker && mapRef.current) {
      mapRef.current.invalidateSize();
      mapRef.current.setView([marker.latitude, marker.longitude], 17);
    }
  }, [marker]);
   
  
  // **Получение адреса по координатам**
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

  // **Получение координат по адресу**
  const fetchCoordinatesFromAddress = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&extratags=1&polygon_geojson=1&limit=5`
      );
      const data = await response.json();
      const filtered = data.map((item: any) => ({
        label: `${item.address.road || ''} ${item.address.house_number || ''}, ${item.address.city || item.address.town || item.address.village || ''}`.trim(),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
      setSuggestions(filtered);
    } catch (error) {
      console.error('Ошибка при получении координат:', error);
    }
    
    setLoading(false);
  };

  // **Debounce для ввода адреса**
  const debouncedFetch = useCallback(debounce(fetchCoordinatesFromAddress, 300), []);

  // **Выбор адреса и центрирование карты**
  const selectAddress = (item: any) => {
    setAddress(item.label);
    setMarker({ latitude: item.latitude, longitude: item.longitude });
    setSuggestions([]);
    setIsModalOpen(false);
  
    if (mapRef.current) {
      mapRef.current.invalidateSize(); // Гарантируем, что карта обновилась
      mapRef.current.setView([item.latitude, item.longitude], 17); // Перемещение к координатам
    }
  };

  // **Клик по карте (ставит маркер + вбивает адрес)**
  function MapClickHandler() {
    if (!useMapEvents) return null;
    useMapEvents({
      click(e: any) {
        setMarker({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <View style={styles.block}>
      <View style={styles.container}>
        {/* Карта */}
        <MapContainer
          center={[55.751244, 37.618423]} 
          zoom={12} 
          style={styles.map}
          whenCreated={(map: L.Map) => {
            mapRef.current = map;
            map.invalidateSize(); // Гарантируем корректное отображение карты
          }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {marker && <Marker position={[marker.latitude, marker.longitude]} icon={customIcon} />}

          <MapClickHandler />
        </MapContainer>
        {/* Кнопка "Моя геолокация" */}
        <TouchableOpacity style={styles.geoButton} onPress={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setMarker({ latitude, longitude });
              fetchAddressFromCoordinates(latitude, longitude);
            },
            (error) => console.error(error),
            { enableHighAccuracy: true }
          );
        }}>
          <GeoIcon/>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          {/* Поле ввода (открывает модальное окно) */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
            <Text style={styles.inputText}>{address || 'Введите адрес...'}</Text>
          </TouchableOpacity>
          {/* Кнопка "Всё верно" */}
          <TouchableOpacity style={styles.button} onPress={() => onNext(marker || address)}>
            <Text style={styles.buttonText}>Всё верно</Text>
          </TouchableOpacity>
        </View>
        {/* Модальное окно поиска адреса */}
        <Modal visible={isModalOpen} animationType="slide">
          <View style={styles.modalOpen}>
            <View style={styles.modalContainer}>
              <TextInput
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  debouncedFetch(text);
                }}
                placeholder="Введите адрес"
                style={styles.input}
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
              <TouchableOpacity style={styles.button} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>         
        </Modal>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  block:{
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    paddingVertical: 30,
  },
  map:{
    width: '100%',
    height: '100%',
  },
  geoButton: {
    position: 'absolute',
    zIndex: 400,
    right: 16,
    bottom: '30%'
  },
  bottomContainer:{
    borderTopLeftRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  inputContainer: { 
    backgroundColor: '#f3f3f3', 
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  inputText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000',
  },
  input: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000',
    backgroundColor: '#f3f3f3', 
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  loadingText: {
    padding: 10,
    textAlign: 'center',
    color: 'gray',
  },
  buttonContainer:{
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#000',
    width: '100%',
  },
  modalOpen: {
    alignItems: 'center',
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    paddingVertical: 30,
    paddingHorizontal: 16,
    maxWidth: 600,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 12,
  },
  
});

export default MapWeb;

import React, { useState, useCallback, Suspense, lazy } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';

// Загружаем карту лениво, чтобы избежать SSR
const MapComponent = lazy(() => import('./MapComponent'));

interface MapWebProps {
  onNext: (location: { latitude: number; longitude: number } | string) => void;
}

const MapWeb: React.FC<MapWebProps> = ({ onNext }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // **Функция получения координат по адресу**
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
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetch = useCallback(debounce(fetchCoordinatesFromAddress, 300), []);

  // **Выбор адреса из списка**
  const selectAddress = (item: any) => {
    console.log("📍 Выбран адрес:", item.label, "Координаты:", item.latitude, item.longitude);
    setAddress(item.label);
    setSelectedLocation({ latitude: item.latitude, longitude: item.longitude });
    setSuggestions([]);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.block}>
      <View style={styles.container}>
        {/* Карта */}
        <Suspense fallback={<ActivityIndicator size="large" color="#000" />}>
          <MapComponent selectedLocation={selectedLocation} />
        </Suspense>

        {/* Кнопка "Моя геолокация" */}
        <TouchableOpacity
          style={styles.geoButton}
          onPress={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ latitude, longitude });
              },
              (error) => console.error(error),
              { enableHighAccuracy: true }
            );
          }}
        >
          <GeoIcon />
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          {/* Поле ввода (открывает модальное окно) */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
            <Text style={styles.inputText}>{address || 'Введите адрес...'}</Text>
          </TouchableOpacity>

          {/* Кнопка "Всё верно" */}
          <TouchableOpacity style={styles.button} onPress={() => onNext(selectedLocation || address)}>
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
  block: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  container: { 
    width: '100%', 
    height: '100%', 
    position: 'relative', 
    paddingVertical: 30 
  },
  geoButton: { 
    position: 'absolute', 
    zIndex: 400, 
    right: 16, 
    bottom: '30%' 
  },
  bottomContainer: { 
    borderTopLeftRadius: 16, 
    padding: 16, 
    marginBottom: 10 
  },
  inputContainer: { 
    backgroundColor: '#f3f3f3', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 30 
  },
  inputText: { 
    fontSize: 14, 
    fontWeight: '400', 
    color: '#000' 
  },
  input: { 
    fontSize: 14, 
    fontWeight: '400', 
    color: '#000', 
    backgroundColor: '#f3f3f3', 
    padding: 16,
    borderRadius: 12, 
    marginBottom: 30 
  },
  suggestionItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    backgroundColor: 'white' 
  },
  button: { 
    padding: 15, 
    borderRadius: 8, 
    backgroundColor: '#000', 
    width: '100%' 
  },
  modalOpen: { 
    alignItems: 'center', 
    flex: 1 
  },
  modalContainer: { 
    width: '100%', 
    height: '100%', 
    paddingVertical: 30, 
    paddingHorizontal: 16, 
    maxWidth: 600 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700', 
    textAlign: 'center', 
    fontSize: 12 
  },
});

export default MapWeb;

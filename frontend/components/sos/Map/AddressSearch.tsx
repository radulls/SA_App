import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Интерфейсы
interface AddressSuggestion {
  label: string;
  latitude: number;
  longitude: number;
}

interface AddressSearchProps {
  onSelectAddress: (address: AddressSuggestion) => void;
}

// Дебаунс-функция
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Глобальный кеш для хранения уже запрашиваемых адресов
const addressCache: Record<string, AddressSuggestion[]> = {};

const AddressSearch: React.FC<AddressSearchProps> = ({ onSelectAddress }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Получаем текущую геолокацию один раз при монтировании компонента
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => console.error('Ошибка получения геолокации:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Функция поиска адресов (использует кеш)
  const fetchCoordinatesFromAddress = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    // Проверяем, есть ли запрос в кеше
    if (addressCache[query]) {
      setSuggestions(addressCache[query]);
      return;
    }

    setLoading(true);

    try {
      if (!userLocation) {
        setLoading(false);
        return;
      }

      const { latitude, longitude } = userLocation;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&extratags=1&polygon_geojson=1&limit=10&bounded=1&viewbox=${longitude - 0.5},${latitude - 0.5},${longitude + 0.5},${latitude + 0.5}`
      );
      const data = await response.json();

      // Фильтрация и удаление дубликатов
      const filtered: AddressSuggestion[] = data
        .map((item: any) => ({
          label: `${item.address.road || ''} ${item.address.house_number || ''}, ${item.address.city || item.address.town || item.address.village || ''}`.trim(),
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        }))
        .filter((item: AddressSuggestion) => item.label !== ',' && item.label.length > 5)
        .reduce((acc: AddressSuggestion[], current: AddressSuggestion) => {
          if (!acc.find((item) => item.label === current.label)) {
            acc.push(current);
          }
          return acc;
        }, []);

      // Кешируем результат
      addressCache[query] = filtered;

      setSuggestions(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении координат:', error);
      setLoading(false);
    }
  };

  // Дебаунсируем функцию поиска (чтобы не дергать API слишком часто)
  const debouncedFetch = useCallback(debounce(fetchCoordinatesFromAddress, 500), [userLocation]);

  return (
    <View style={styles.container}>
      {/* Поле ввода */}
      <TextInput
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          debouncedFetch(text); // Используем дебаунс вместо обычного вызова API
        }}
        placeholder="Введите адрес"
        style={styles.input}
      />
      
      {/* Идет загрузка */}
      {loading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}

      {/* Список подсказок */}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectAddress(item)} style={styles.suggestionItem}>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  loader: {
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
});

export default AddressSearch;

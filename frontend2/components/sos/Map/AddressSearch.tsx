import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import Fuse from 'fuse.js';
import DeleteAdressIcon from '@/components/svgConvertedIcons/MapIcons/deleteAdressIcon';

// Интерфейсы
interface AddressSuggestion {
  label: string;
  latitude: number;
  longitude: number;
}

interface AddressSearchProps {
  onSelectAddress: (address: AddressSuggestion) => void;
  initialAddress?: string;
  useBoundingBox?: boolean; // <- новый проп
}

// Дебаунс-функция
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Глобальный кеш
const addressCache: Record<string, AddressSuggestion[]> = {};

const getCurrentLocation = async () => {
  return new Promise<{ latitude: number; longitude: number } | null>(async (resolve) => {
    if (Platform.OS === 'web') {
      if (!navigator.geolocation) {
        console.error('❌ Геолокация не поддерживается');
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        (error) => {
          console.error('⚠ Ошибка геолокации:', error);
          resolve(null);
        },
        { enableHighAccuracy: true }
      );
    } else {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return resolve(null);

        const location = await Location.getCurrentPositionAsync({});
        resolve({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      } catch (error) {
        console.error('⚠ Ошибка геолокации:', error);
        resolve(null);
      }
    }
  });
};

const AddressSearch: React.FC<AddressSearchProps> = ({ onSelectAddress, initialAddress, useBoundingBox }) => {
  const [address, setAddress] = useState(initialAddress || ''); 
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
// ✅ Используем текущий адрес

  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      if (location) setUserLocation(location);
    })();
  }, []);

  const fetchCoordinatesFromAddress = async (query: string, useBoundingBox = true) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
  
    if (addressCache[query]) {
      setSuggestions(addressCache[query]);
      return;
    }
  
    setLoading(true);
  
    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10`;
  
      if (useBoundingBox && userLocation) {
        const { latitude, longitude } = userLocation;
        url += `&bounded=1&viewbox=${longitude - 0.5},${latitude - 0.5},${longitude + 0.5},${latitude + 0.5}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      let results: AddressSuggestion[] = data
        .map((item: any) => {
          const { road, house_number, suburb, village, town, city_district, city, county, state } = item.address || {};
          const locality = city || town || village || suburb || city_district || county || state || '';
          const street = road ? `${road}` : '';
          const house = house_number ? `${house_number}` : '';
          const formattedAddress = [locality, street, house].filter(Boolean).join(', ');
          return {
            label: formattedAddress,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          };
        })
        .filter((item: AddressSuggestion) => item.label.length > 5)
        .reduce((acc: AddressSuggestion[], current: AddressSuggestion) => {
          if (!acc.find((item) => item.label === current.label)) acc.push(current);
          return acc;
        }, []);
  
      // Фаззи-поиск fallback
      if (results.length === 0 && Object.keys(addressCache).length > 0) {
        const allCachedResults = Object.values(addressCache).flat();
        const fuse = new Fuse(allCachedResults, { keys: ['label'], threshold: 0.4 });
        results = fuse.search(query).map((result) => result.item);
      }
  
      addressCache[query] = results;
      setSuggestions(results);
    } catch (error) {
      console.error('Ошибка при получении координат:', error);
    }
  
    setLoading(false);
  };  

  const debouncedFetch = useCallback(
    debounce((text: string) => fetchCoordinatesFromAddress(text, useBoundingBox ?? true), 500),
    [userLocation, useBoundingBox]
  );  
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            debouncedFetch(text);
          }}
          placeholderTextColor='#000'
          placeholder="Введите адрес"
          style={styles.input}
          underlineColorAndroid="transparent"
        />
       {address.length > 0 && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => {
              setAddress('');
              setSuggestions([]);
            }}
          >
            <DeleteAdressIcon />
          </TouchableOpacity>
        )}     
      </View>
      
      {loading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setAddress(item.label);      // 👈 вставляем текст в поле
              setSuggestions([]);          // 👈 скрываем список
              onSelectAddress(item);       // 👈 передаём наружу
            }}
            style={styles.suggestionItem}
          >
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
    paddingTop: Platform.select({
      ios: 40,
      android: 40,
      web: 0,
    }),    
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    marginBottom: 10,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  deleteIcon:{
    marginRight: 15,
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

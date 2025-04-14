import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import AddressSearch from '../AddressSearch';
import SearchIcon from '@/components/svgConvertedIcons/BottomMenuIcons/SearchIcon';
import { fetchAddressFromCoordinates } from '@/utils/locationUtils';
import ExpoMapComponent from './ExpoMapComponent';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { styles } from '../mapStyle';

interface Coordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

interface MapExpoProps {
  onNext: (location: Coordinates | string) => void;
  selectedLocation?: Coordinates | null; // ✅ Добавлен пропс для передачи сохранённого местоположения
}

const MapExpo: React.FC<MapExpoProps> = ({ onNext, selectedLocation }) => {
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(selectedLocation || null);
  const [loading, setLoading] = useState(true);
  const [iconBase64, setIconBase64] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (selectedLocation) {
        // ✅ Если уже есть сохранённое место — используем его
        setAddress(selectedLocation.address || '');
        setCurrentLocation(selectedLocation);
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('❌ Разрешение на геолокацию отклонено');
          setLoading(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });
        fetchAddressFromCoordinates(latitude, longitude, setAddress);
      }
      setLoading(false);
    })();
  }, [selectedLocation]); // ✅ Следим за изменением `selectedLocation`

  // Загружаем иконку в Base64
  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(require('../../../../assets/geotagIcom.png'));
        await asset.downloadAsync();
        const base64 = await FileSystem.readAsStringAsync(asset.localUri || '', {
          encoding: FileSystem.EncodingType.Base64,
        });
        setIconBase64(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error('❌ Ошибка загрузки изображения:', error);
      }
    })();
  }, []);

  const selectAddress = (item: { label: string; latitude: number; longitude: number }) => {
    setAddress(item.label);
    setCurrentLocation({ latitude: item.latitude, longitude: item.longitude });
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <View style={styles.container}>
        <ExpoMapComponent 
          onLocationSelect={(loc) => {
            setCurrentLocation(loc);
            fetchAddressFromCoordinates(loc.latitude, loc.longitude, setAddress);
          }}
          iconBase64={iconBase64}
          selectedLocation={currentLocation} // ✅ Используем сохранённое место
        />
         <View style={styles.bottomContent}>
          <View style={styles.bottomContentContainer}>
             {/* Кнопка "Моя геопозиция" */}
            <TouchableOpacity
              style={styles.geoButton}
              onPress={async () => {
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setCurrentLocation({ latitude, longitude });
                fetchAddressFromCoordinates(latitude, longitude, setAddress);
              }}
            >
              <GeoIcon />
            </TouchableOpacity>
            <View style={styles.bottomContainer}>
              <Text style={styles.title}>Локация</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
                <SearchIcon />
                <Text style={styles.inputText}>{address || 'Введите адрес...'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (!currentLocation || !address) {
                    Alert.alert("Ошибка", "Не удалось определить адрес. Попробуйте еще раз.");
                    return;
                  }
                  onNext({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    address,
                  });
                }}
              >
                <Text style={styles.buttonText}>Всё верно</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal visible={isModalOpen} animationType="slide">
          <View style={styles.modalOpen}>
            <View style={styles.modalContainer}>
              <AddressSearch onSelectAddress={selectAddress} initialAddress={address} />
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

export default MapExpo;

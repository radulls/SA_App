import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import AddressSearch from '../AddressSearch';
import SearchIcon from '@/components/svgConvertedIcons/BottomMenuIcons/SearchIcon';
import { fetchAddressFromCoordinates } from '@/utils/locationUtils';
import ExpoMapComponent from './ExpoMapComponent';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { styles } from '../mapStyle'

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapExpoProps {
  onNext: (location: Coordinates | string) => void;
}

const MapExpo: React.FC<MapExpoProps> = ({ onNext }) => {
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [iconBase64, setIconBase64] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('❌ Разрешение на геолокацию отклонено');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setSelectedLocation({ latitude, longitude });
      fetchAddressFromCoordinates(latitude, longitude, setAddress);
      setLoading(false);
    })();
  }, []);

  // Загружаем изображение иконки в base64
  useEffect(() => {
    (async () => {
      try {
        // 📌 Указываем путь без alias
        const asset = Asset.fromModule(require('../../../../assets/geotagIcom.png'));
  
        // 📌 Загружаем файл
        await asset.downloadAsync();
  
        // 📌 Читаем как base64
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
    setSelectedLocation({ latitude: item.latitude, longitude: item.longitude });
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
        {/* OSM с кастомным маркером */}
        <ExpoMapComponent 
          onLocationSelect={(loc) => {
            setSelectedLocation(loc);
            fetchAddressFromCoordinates(loc.latitude, loc.longitude, setAddress);
          }}
          iconBase64={iconBase64}
          selectedLocation={selectedLocation} // Передаем как пропс, но не вызываем обновление напрямую
        />
        {/* Кнопка "Моя геопозиция" */}
        <TouchableOpacity
          style={styles.geoButton}
          onPress={async () => {
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setSelectedLocation({ latitude, longitude });
            fetchAddressFromCoordinates(latitude, longitude, setAddress);
          }}
        >
          <GeoIcon />
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Локация</Text>
          {/* Поле ввода */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
            <SearchIcon />
            <Text key={address} style={styles.inputText}>{address || 'Введите адрес...'}</Text>
          </TouchableOpacity>

          {/* Кнопка "Всё верно" */}
          <TouchableOpacity style={styles.button} onPress={() => onNext(selectedLocation || address)}>
            <Text style={styles.buttonText}>Всё верно</Text>
          </TouchableOpacity>
        </View>
        {/* Модальное окно с `AddressSearch` */}
        <Modal visible={isModalOpen} animationType="slide">
          <View style={styles.modalOpen}>
            <View style={styles.modalContainer}>
              <AddressSearch onSelectAddress={selectAddress} initialAddress={address}/>
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

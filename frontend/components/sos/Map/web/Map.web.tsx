import React, { useState, Suspense, lazy, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import AddressSearch from '../AddressSearch';
import SearchIcon from '@/components/svgConvertedIcons/BottomMenuIcons/SearchIcon';
import { fixAddressOrder, fetchAddressFromCoordinates } from '@/utils/locationUtils';
import { styles } from '../mapStyle';

const MapComponent = lazy(() => import('./MapComponent'));

interface Coordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

interface MapWebProps {
  onNext: (location: Coordinates | string) => void;
  selectedLocation?: Coordinates | null; // ✅ Теперь можно передавать сохранённое местоположение
}

const MapWeb: React.FC<MapWebProps> = ({ onNext, selectedLocation }) => {
  const [address, setAddress] = useState(selectedLocation?.address || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(selectedLocation || null);
  
  useEffect(() => {
    if (!selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          fetchAddressFromCoordinates(latitude, longitude, setAddress);
        },
        (error) => console.error('⚠ Ошибка геолокации:', error),
        { enableHighAccuracy: true }
      );
    }
  }, [selectedLocation]);

  // ✅ Функция выбора адреса
  const selectAddress = (item: { label: string; latitude: number; longitude: number }) => {
    setAddress(item.label);
    setCurrentLocation({ latitude: item.latitude, longitude: item.longitude });
    setIsModalOpen(false);
  };
  
  return (
    <View style={styles.block}>
      <View style={styles.container}>
        {/* Карта */}
        <Suspense fallback={<ActivityIndicator size="large" color="#000" />}>
          <MapComponent 
            selectedLocation={currentLocation} 
            setSelectedLocation={setCurrentLocation} 
            setAddress={setAddress} 
          />
        </Suspense>
        {/* Кнопка "Моя геопозиция" */}
        <TouchableOpacity
          style={styles.geoButton}
          onPress={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
                fetchAddressFromCoordinates(latitude, longitude, setAddress);
              },
              (error) => console.error('⚠ Ошибка геолокации:', error),
              { enableHighAccuracy: true }
            );
          }}
        >
          <GeoIcon />
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Локация</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
            <SearchIcon/>
            <Text style={styles.inputText}>{address || 'Введите адрес...'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (currentLocation && address) {
                onNext({
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  address,
                });
              } else {
                alert("Пожалуйста, выберите местоположение или введите адрес.");
              }
            }}
          >
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

export default MapWeb;

import React, { useState, Suspense, lazy, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import AddressSearch from '../AddressSearch'; // Импортируем компонент
import SearchIcon from '@/components/svgConvertedIcons/BottomMenuIcons/SearchIcon';
import { fixAddressOrder, fetchAddressFromCoordinates } from '@/utils/locationUtils';
import { styles } from '../mapStyle'

const MapComponent = lazy(() => import('./MapComponent'));

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapWebProps {
  onNext: (location: Coordinates | string) => void;
}

const MapWeb: React.FC<MapWebProps> = ({ onNext }) => {
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  
  useEffect(() => {
    console.log('🔄 Состояние address обновилось:', address);
  }, [address]);
  
  // ✅ Функция выбора адреса
  const selectAddress = (item: { label: string; latitude: number; longitude: number }) => {
    console.log('📌 Выбранный адрес:', item.label);
  
    // Берём название города из label
    const addressParts = item.label.split(', ').map((part) => part.trim());
    const locality = addressParts.find((part) => part.match(/^[А-ЯЁа-яё-]+$/)); // Город должен быть словом
  
    // Если нашли город, фиксируем порядок
    const fixedLabel = locality ? fixAddressOrder(item.label, locality) : item.label;
  
    console.log('🔄 Исправленный порядок в selectAddress:', fixedLabel);
    setAddress(fixedLabel);
    setSelectedLocation({ latitude: item.latitude, longitude: item.longitude });
    setIsModalOpen(false);
  };
  
  return (
    <View style={styles.block}>
      <View style={styles.container}>
        {/* Карта */}
        <Suspense fallback={<ActivityIndicator size="large" color="#000" />}>
          <MapComponent 
            selectedLocation={selectedLocation} 
            setSelectedLocation={setSelectedLocation} 
            setAddress={setAddress} 
          />
        </Suspense>
        {/* Кнопка "Моя геопозиция" */}
        <TouchableOpacity
          style={styles.geoButton}
          onPress={() => {
            console.log('📍 Кнопка геопозиции нажата!');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                console.log('📡 Получена геопозиция:', latitude, longitude);
                setSelectedLocation({ latitude, longitude });

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
          {/* Поле ввода (открывает модальное окно) */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalOpen(true)}>
            <SearchIcon/>
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

export default MapWeb;

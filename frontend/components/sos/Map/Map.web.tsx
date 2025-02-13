import React, { useState, Suspense, lazy } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';
import AddressSearch from './AddressSearch'; // Импортируем компонент
import SearchIcon from '@/components/svgConvertedIcons/BottomMenuIcons/SearchIcon';

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

  // Функция получения адреса по координатам
  const fetchAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&extratags=1`
      );
      const data = await response.json();
  
      // 🔥 ЛОГИРУЕМ ВЕСЬ ОТВЕТ ОТ NOMINATIM
      console.log('🛰️ ОТВЕТ ОТ NOMINATIM:', data);
  
      if (data.address) {
        console.log('📌 РАЗОБРАННЫЕ ДАННЫЕ:', data.address);
  
        const {
          road, // Улица
          house_number, // Дом
          suburb,
          village,
          town,
          city_district,
          city,
          county,
          state,
          country,
          amenity,
        } = data.address;
  
        // 🔥 ЛОГИРУЕМ КАЖДОЕ ПОЛЕ
        console.log('🏙 Город:', city || town || village || suburb || city_district || county || state);
        console.log('🛤 Улица:', road);
        console.log('🏠 Дом:', house_number);
  
        // Определяем город (населённый пункт)
        const locality = city || town || village || suburb || city_district || county || state || '';
  
        // **ЖЁСТКАЯ замена порядка: "Город, Улица, Дом"**
        let formattedAddress = `${locality}${road ? ', ' + road : ''}${house_number ? ' ' + house_number : ''}`;
  
        // Если нет улицы и дома, оставляем только город
        if (!road && !house_number) {
          formattedAddress = locality;
        }
  
        // Если вообще ничего не найдено, используем display_name (fallback)
        if (!formattedAddress) {
          formattedAddress = data.display_name;
        }
  
        // Добавляем название заведения (если есть)
        if (amenity) {
          formattedAddress = `${amenity}, ${formattedAddress}`;
        }
  
        console.log('✅ Итоговый адрес:', formattedAddress);
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('❌ Ошибка при получении адреса:', error);
    }
  };
  
  // ✅ Функция выбора адреса
  const selectAddress = (item: { label: string; latitude: number; longitude: number }) => {
    setAddress(item.label);
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
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ latitude, longitude });

                // 🔥 Теперь мы сразу получаем адрес для текущих координат
                fetchAddressFromCoordinates(latitude, longitude);

                setIsModalOpen(false);
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
            <SearchIcon/>
            <Text style={styles.inputText}>{address || 'Введите адрес...'}</Text>
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
              <AddressSearch onSelectAddress={selectAddress} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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

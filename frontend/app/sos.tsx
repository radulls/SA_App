import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Map, { LocationData } from '@/components/sos/Map'; 
import DetailsStep from '@/components/sos/DetailStep/DetailsStep';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SosPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEditing = params.editMode === "true"; // Проверяем, редактируем ли мы сигнал

  // Функция для извлечения строки из параметра (если массив, берём первый элемент)
  const getString = (value: string | string[] | undefined): string => {
    return Array.isArray(value) ? value[0] : value || '';
  };

  // Функция для извлечения массива (если параметр в JSON, парсим)
  const parseArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    try {
      return Array.isArray(value) ? JSON.parse(value[0]) : JSON.parse(value);
    } catch {
      return [];
    }
  };

  // Если редактируем, ставим второй шаг, иначе первый
  const [step, setStep] = useState(isEditing ? 2 : 1);

  // Устанавливаем локацию из параметров (если редактируем)
  const [location, setLocation] = useState<LocationData | null>(
    isEditing
      ? {
          latitude: Number(getString(params.latitude)),
          longitude: Number(getString(params.longitude)),
          address: getString(params.address) || 'Неизвестный адрес',
        }
      : null
  );

  // Если редактируем, загружаем переданные данные
  const initialData = isEditing
    ? {
        title: getString(params.title),
        description: getString(params.description),
        tags: parseArray(params.tags),
        photos: parseArray(params.photos),
      }
    : undefined;

  // Функция для выхода
  const closeSos = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topBlock}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
            <CloseIcon fill='#000' />
          </TouchableOpacity>
          <Text style={styles.title}>Сигнал SOS</Text>
          <Text style={styles.subtitle}>Используйте, когда вам нужна помощь</Text>
        </View>

        {/* Первый шаг: выбор локации */}
        {step === 1 && (
          <Map 
            onNext={(loc: string | LocationData) => {  
              setLocation(typeof loc === 'string' ? { latitude: 0, longitude: 0, address: loc } : loc);
              setStep(2);
            }} 
            selectedLocation={location}
          />
        )}

        {/* Второй шаг: заполнение данных SOS-сигнала */}
        {step === 2 && location && (
          <DetailsStep
            onNext={(id) => router.push(`/sos-signal/${id}`)}
            location={{
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || 'Неизвестный адрес',
            }}
            goBackToMap={() => setStep(1)}
            initialData={initialData}
            sosId={getString(params.sosId)} // Преобразуем в строку
            isEditing={isEditing} // Говорим, что редактируем
          />
        )}
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
  },
  topBlock: {
    backgroundColor: '#fff',
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 17,
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    paddingTop: Platform.select({
      ios: 40,
      android: 40,
      web: 0,
    }),    
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    paddingTop: 10,
    fontWeight: '400',
    color: '#8b8b8b'
  },
  closeIcon: {
    position: 'absolute',
    left: 0,
    padding: 20,
    top: Platform.select({
      ios: 40,
      android: 40,
      web: 0,
    }),   
    zIndex: 1000
  }
});

export default SosPage;

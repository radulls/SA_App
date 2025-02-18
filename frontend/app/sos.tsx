import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Map, { LocationData } from '@/components/sos/Map'; 
import DetailsStep from '@/components/sos/DetailsStep';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';
import { useRouter } from 'expo-router';

const SosPage = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationData | null>(null);
  const router = useRouter();

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
            onNext={(id) => router.push(`/sos-signal/${id}`)} // 🔥 Теперь сразу переходим на страницу сигнала
            location={{
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || 'Неизвестный адрес',
            }}
            goBackToMap={() => setStep(1)}
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

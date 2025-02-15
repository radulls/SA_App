import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Map, { LocationData } from '@/components/sos/Map'; 
import DetailsStep from '@/components/sos/DetailsStep';
import SosView from '@/components/sos/SosView';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';
import { useRouter } from 'expo-router';

interface DetailsData {
  title: string;
  tags: string[];
  description: string;
  photos: string[];
}

const SosPage = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationData | string | null>(null);
  const [details, setDetails] = useState<DetailsData>({ title: '', tags: [], description: '', photos: [] });
  const router = useRouter();

  const closeSos = () => {
    router.push('/home')
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topBlock}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
            <CloseIcon fill='#000' />
          </TouchableOpacity>
          <Text style={styles.title}>
            Сигнал SOS
          </Text>
          <Text style={styles.subtitle}>
           Используйте, когда вам нужна помощь
          </Text>
        </View>
        {step === 1 && (
          <Map onNext={(loc: LocationData | string) => {  // ✅ Добавили тип
            setLocation(loc);
            setStep(2);
          }} />
        )}
        {step === 2 && <DetailsStep onNext={(data) => { setDetails({ ...data, photos: [] }); setStep(3); }} />}
        {step === 3 && <SosView location={location} details={details} />}
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer:{
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
})

export default SosPage;

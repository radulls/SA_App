import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Map, { LocationData } from '@/components/sos/Map'; 
import DetailsStep from '@/components/sos/DetailsStep';
import SosView from '@/components/sos/SosView';

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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <View style={styles.topBlock}>
        <Text>
        Сигнал SOS
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
    position: 'relative'
  }
})

export default SosPage;

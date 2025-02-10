import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Map from '@/components/sos/Map';
import DetailsStep from '@/components/sos/DetailsStep';
import SosView from '@/components/sos/SosView';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface DetailsData {
  title: string;
  tags: string[];
  description: string;
  photos: string[]; // Добавляем поле photos
}

const SosPage = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationData | string | null>(null); // Добавляем корректный тип
  const [details, setDetails] = useState<DetailsData>({ title: '', tags: [], description: '', photos: [] });

  return (
    <View style={{ flex: 1 }}>
      {step === 1 && <Map onNext={(loc) => { setLocation(loc); setStep(2); }} />}
      {step === 2 && <DetailsStep onNext={(data) => { setDetails({ ...data, photos: [] }); setStep(3); }} />}
      {step === 3 && <SosView location={location} details={details} />}
    </View>
  );
};

export default SosPage;

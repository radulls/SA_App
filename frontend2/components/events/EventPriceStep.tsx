// components/events/EventPriceStep.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { FullEventData } from '@/types/event';

interface Props {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onNext: () => void;
  onBack: () => void;
}

const EventPriceStep: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
  const { isFree, price } = eventData;

  const handleSetFree = () => {
    setEventData((prev) => ({
      ...prev,
      isFree: true,
      price: '',
    }));
  };

  const handleSetPaid = () => {
    setEventData((prev) => ({
      ...prev,
      isFree: false,
    }));
  };

  const handlePriceChange = (val: string) => {
    const onlyDigits = val.replace(/[^0-9]/g, '');
    setEventData((prev) => ({
      ...prev,
      price: onlyDigits,
    }));
  };  

  return (
    <View style={styles.container}>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionButton, isFree && styles.optionButtonActive]}
          onPress={handleSetFree}
        >
          <Text style={[styles.optionText, isFree && styles.optionTextActive]}>Бесплатно</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, !isFree && styles.optionButtonActive]}
          onPress={handleSetPaid}
        >
          <Text style={[styles.optionText, !isFree && styles.optionTextActive]}>Платно</Text>
        </TouchableOpacity>
      </View>

      {!isFree && (
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.input}
            placeholder="Стоимость"
            placeholderTextColor="#8B8B8B"
            keyboardType="numeric"
            value={price}
            onChangeText={handlePriceChange}
          />
          <Text style={styles.ruble}>₽</Text>
        </View>
      )}
    </View>
  );
};

export default EventPriceStep;

const styles = StyleSheet.create({
  container: {
 
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
  },
  optionButtonActive: {
    backgroundColor: '#000',
  },
  optionText: {
    color: '#808080',
    fontWeight: '700',
  },
  optionTextActive: {
    color: '#fff',
  },
  priceContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    width: 120,
    position: 'relative',
  },
  input: {
    paddingVertical: 19,
    paddingLeft: 15,
    paddingRight: 35,
    fontSize: 14,
    fontFamily: "SFUIDisplay-regular",
    fontWeight: '400',
    width: '100%',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  ruble:{
    position: 'absolute',
    right: 15,
    fontSize: 14,
    fontWeight: '700',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  backText: {
    fontWeight: '600',
    color: '#000',
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  nextText: {
    fontWeight: '700',
    color: '#fff',
  },
});

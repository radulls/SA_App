// components/events/EventTitleStep.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import type { FullEventData } from '@/types/event';

interface Props {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onNext: () => void;
  onBack: () => void;
}

const EventTitleStep: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
  const { title, description } = eventData;

  const handleChange = (field: 'title' | 'description', value: string) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>    
      <Text style={styles.label}>Название</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={title}
        onChangeText={(text) => handleChange('title', text)}
      />
      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder=""
        value={description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
        numberOfLines={5}
      />                 
    </View>
  );
};

export default EventTitleStep;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: '#F3F3F3',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }), 
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
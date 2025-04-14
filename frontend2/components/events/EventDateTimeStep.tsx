import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DataIcon from '../svgConvertedIcons/dataIcon';
import TimeIcon from '../svgConvertedIcons/timeIcon';
import type { FullEventData } from '@/types/event';
import './style.css'

interface EventDateTimeStepProps {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onNext: () => void;
  onBack: () => void;
}

const EventDateTimeStep: React.FC<EventDateTimeStepProps> = ({
  eventData,
  setEventData,
  onNext,
  onBack,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerField, setPickerField] = useState<
    'startDate' | 'startTime' | 'endDate' | 'endTime' | null
  >(null);
  const [tempValue, setTempValue] = useState<Date>(new Date());

  const handleOpenPicker = (field: typeof pickerField, mode: typeof pickerMode) => {
    if (Platform.OS === 'web') return;
    setPickerField(field);
    setPickerMode(mode);

    const currentVal = eventData[field!] ? new Date(eventData[field!] as string) : new Date();
    setTempValue(currentVal);

    setShowPicker(true);
  };

  const handleConfirm = () => {
    if (!pickerField) return;

    const formatted =
      pickerMode === 'date'
        ? tempValue.toISOString().split('T')[0]
        : tempValue.toTimeString().slice(0, 5);

    setEventData((prev) => ({
      ...prev,
      [pickerField]: formatted,
    }));

    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const renderInput = (
    icon: React.ReactNode,
    value: string,
    placeholder: string,
    field: typeof pickerField,
    mode: typeof pickerMode
  ) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.inputWrapper}>
          {icon}
          <input
            type={mode}
            value={value || ''}
            placeholder={placeholder}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, [field!]: e.target.value }))
            }
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: 14,
              flex: 1,
              outline: 'none',
              color: '#000',
              appearance: 'none',
            }}
          />
        </View>
      );
    }
    

    return (
      <TouchableOpacity
        onPress={() => handleOpenPicker(field, mode)}
        style={styles.inputWrapper}
        activeOpacity={0.7}
      >
        {icon}
        <Text style={[styles.inputText, !value && { color: '#aaa' }]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Начало</Text>
      {renderInput(<DataIcon />, eventData.startDate, 'Дата', 'startDate', 'date')}
      {renderInput(<TimeIcon />, eventData.startTime, 'Время', 'startTime', 'time')}

      <Text style={styles.sectionTitle}>Завершение</Text>
      {renderInput(<DataIcon />, eventData.endDate, 'Дата', 'endDate', 'date')}
      {renderInput(<TimeIcon />, eventData.endTime, 'Время', 'endTime', 'time')}

      {Platform.OS !== 'web' && showPicker && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                mode={pickerMode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={tempValue}
                onChange={(_, selectedDate) => {
                  if (selectedDate) setTempValue(selectedDate);
                }}
              />
              <View style={styles.buttonsRow}>
                <Pressable onPress={handleCancel} style={styles.button}>
                  <Text style={styles.buttonText}>Отмена</Text>
                </Pressable>
                <Pressable onPress={handleConfirm} style={styles.button}>
                  <Text style={styles.buttonText}>Готово</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default EventDateTimeStep;

const styles = StyleSheet.create({
  container: {},
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 12,
  },
  inputText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
  },
  pickerWrapper: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
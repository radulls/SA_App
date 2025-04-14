import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import type { FullEventData } from '@/types/event';
import AddressSearch from '../sos/Map/AddressSearch';

interface Props {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onNext: () => void;
  onBack: () => void;
}

const EventLocationStep: React.FC<Props> = ({
  eventData,
  setEventData,
}) => {
  const toggleOnline = (isOnline: boolean) => {
    setEventData((prev) => ({
      ...prev,
      isOnline,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionWrapper}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => toggleOnline(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Онлайн</Text>
          <View
            style={[
              styles.circle,
              eventData.isOnline && styles.circleSelected,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => toggleOnline(false)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Офлайн</Text>
          <View
            style={[
              styles.circle,
              !eventData.isOnline && styles.circleSelected,
            ]}
          />
        </TouchableOpacity>
      </View>

      {!eventData.isOnline && (
        <>
          <View style={styles.inputWrapper}>
          <AddressSearch
            initialAddress={eventData.location?.address || ''}
            useBoundingBox={false}
            onSelectAddress={({ label, latitude, longitude }) => {
              setEventData((prev) => ({
                ...prev,
                location: {
                  address: label,
                  latitude,
                  longitude,
                },
              }));
            }}
          />

          </View>
        </>
      )}
    </View>
  );
};

export default EventLocationStep;

const styles = StyleSheet.create({
  container: {

  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 12,
  },
  optionWrapper: {
    flexDirection: 'column',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E7E7E7',
  },
  circleSelected: {
    borderColor: '#000',
    borderWidth: 7,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginTop: 19,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    backgroundColor: '#F3F3F3',
    paddingRight: 42, // место под иконку
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  clearIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
});

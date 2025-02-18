import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SosMapView from '@/components/sos/ViewMap/SosMapView';
import { TouchableOpacity, Text } from 'react-native';

const SosFullMap = () => {
  const router = useRouter();
  const { lat, lng } = useLocalSearchParams();

  const closeMap = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SosMapView location={{ latitude: Number(lat), longitude: Number(lng) }} />
      <TouchableOpacity onPress={closeMap} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Закрыть</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SosFullMap;

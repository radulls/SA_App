import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SosMapView from '@/components/sos/ViewMap/SosMapView';
import { Ionicons } from '@expo/vector-icons';
import IconBack from '@/components/svgConvertedIcons/iconBack';

const EventMapScreen = () => {
  const { lat, lng, address } = useLocalSearchParams();
  const router = useRouter();

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const fullAddress = address || 'Адрес не указан';

  return (
    <View style={styles.container}>
      {/* Карта с кастомной иконкой для мероприятий */}
      <SosMapView
        location={{ latitude, longitude }}
        customIcon="eventGeotag"
      />
      {/* Кнопка назад */}
      <SafeAreaView style={styles.backButtonWrapper}>
        <View style={styles.backButton}>
          <IconBack onPress={() => router.back()} fill='black'/>
        </View>
      </SafeAreaView>

      {/* Блок с адресом */}
      <View style={styles.addressBlock}>
        <Text style={styles.addressLabel}>Локация</Text>
        <Text style={styles.addressText}>{fullAddress}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 16,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addressBlock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 20,
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
  },
});

export default EventMapScreen;

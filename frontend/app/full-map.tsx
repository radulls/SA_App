import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SosMapView from '@/components/sos/ViewMap/SosMapView';
import { TouchableOpacity, Text } from 'react-native';
import DetailsIcon from '@/components/svgConvertedIcons/sosIcons/detailsIcon';
import SosChatIcon from '@/components/svgConvertedIcons/sosIcons/sosChat';
import GeoIcon from '@/components/svgConvertedIcons/MapIcons/geoIcon';

const SosFullMap = () => {
  const router = useRouter();
  const { lat, lng } = useLocalSearchParams();

  const closeMap = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SosMapView location={{ latitude: Number(lat), longitude: Number(lng) }} />
        <View style={styles.bottomContent}>
          <View style={styles.bottomContentContainer}>
            <TouchableOpacity style={styles.geoButton}>
              <GeoIcon/>
            </TouchableOpacity>
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.blockContainer} onPress={closeMap}>
                <View style={styles.text}>
                  <Text style={styles.title}>Информация</Text>
                  <Text style={styles.subtitle}>Перейти к информации</Text>
                </View>
                <DetailsIcon/>
              </TouchableOpacity>
              <View style={[styles.blockContainer, styles.chatBlock]}>
                <View style={styles.text}>
                  <Text style={styles.title}>Чат сигнала</Text>
                  <Text style={styles.subtitle}>Перейти в чат</Text>
                </View>
                <SosChatIcon/>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer:{
    maxWidth: 600,
    height: '100%',
    width: '100%',
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
  geoButton: { 
    position: 'absolute', 
    zIndex: 400, 
    right: 16, 
    top: -78,   
  },
  bottomContent:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bottomContentContainer:{
    position: 'relative',
  },
  bottomContainer:{
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff', 
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopRightRadius: 16, 
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16, 
    borderBottomLeftRadius: 16,
    height: '100%',
  },
  blockContainer:{
    flex: 1,  
    backgroundColor: '#FFE300',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chatBlock:{
    backgroundColor: '#EFEFEF',
    justifyContent: 'space-between'
  },
  text:{
    paddingBottom: 40
  },
  title:{
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
  },
  subtitle:{
    fontSize: 14,
    fontFamily: "SFUIDisplay-regular",
    paddingVertical: 5,
  },
});

export default SosFullMap;

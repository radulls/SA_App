import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Platform, TouchableOpacity, ScrollView } from 'react-native';
import SosMapView from './ViewMap/SosMapView';
import { getSosSignalById, SOS_IMAGE_URL } from '@/api/sos/sosApi';
import { IMAGE_URL } from '@/api';
import CloseIcon from '../svgConvertedIcons/closeIcon';
import { useRouter } from 'expo-router';
import MoreOptionsIcon from '../svgConvertedIcons/MoreOptionsIcon';
import SosHelpersIcon from '../svgConvertedIcons/sosHelpersIcon';
import { Dimensions } from 'react-native';

interface SosViewProps {
  sosId: string; // 🔥 Теперь получаем ID
}
interface SosDetails {
  title: string;
  location: { latitude: number; longitude: number; address: string };
  tags: { _id: string; name: string }[];
  description: string;
  photos: string[];
  user: {
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
    city: string;
  } | null;
}

const SosView: React.FC<SosViewProps> = ({ sosId }) => {
  const [sosData, setSosData] = useState<SosDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    fetchSosData(sosId);
  }, [sosId]);

  const fetchSosData = async (sosId: string) => {
    try {
      console.log("📡 Загружаем SOS-сигнал с ID:", sosId);
      const response = await getSosSignalById(sosId);
      console.log("✅ Данные, полученные на фронте:", response.data);
      
      // 🛠 Разворачиваем user.user -> user
      const fixedData = { ...response.data, user: response.data.user?.user };
  
      setSosData(fixedData);
    } catch (error) {
      console.error("❌ Ошибка загрузки SOS-сигнала:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#F22C2C" />;
  }

  if (!sosData) {
    return <Text style={styles.error}>❌ SOS-сигнал не найден</Text>;
  }

  const closeSos = () => {
    router.push('/home');
  };

  const openFullMap = () => {
    router.push({
      pathname: '/full-map',
      params: {
        lat: sosData.location.latitude.toString(),
        lng: sosData.location.longitude.toString(),
      },
    });
  };  

  return (
    <ScrollView contentContainerStyle={styles.block}>
      <View style={styles.container}>
        <View style={styles.topItems}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
            <CloseIcon fill='#000' />
          </TouchableOpacity>
          <Text style={styles.sosTitle}>Сигнал SOS</Text>
          <View style={styles.options}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
            <SosHelpersIcon/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
            <MoreOptionsIcon fill='#000'/>
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.userContainer}>
            {sosData.user && (
              <>
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={{ uri: `${IMAGE_URL}${sosData.user.profileImage}` }} 
                    style={styles.profileImage} 
                    resizeMode="cover" 
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>
                    {sosData.user.firstName} {sosData.user.lastName}
                  </Text>
                  <Text style={styles.username}>@{sosData.user.username}</Text>
                  <View style={styles.locationContainer}>
                    <View style={styles.locationIcon}>
                      <Text style={styles.locationIconText}>sa</Text>
                    </View>
                    <Text style={styles.userCity}> {sosData.user.city}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
          <Text style={styles.label}>Локация</Text>
          <Text style={styles.address}>{sosData.location.address}</Text>
          <TouchableOpacity onPress={openFullMap} activeOpacity={1}>
            <Text style={styles.showMap}>Показать на карте</Text>
            <View style={styles.mapWrapper}>
              <View style={styles.mapContainer}>
                <SosMapView location={sosData.location} />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.label}>Теги</Text>
            <View style={styles.tagsContainer}>
              {Array.isArray(sosData.tags) && sosData.tags.length > 0 ? (
                sosData.tags.map((tag, index) => (
                  <View key={tag._id || `tag-${index}`} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noTags}>Нет тегов</Text>
              )}
            </View>
          <Text style={styles.title}>{sosData.title}</Text>
          <Text style={styles.info}>{sosData.description}</Text>
        </View>  
        <View style={styles.photoContainer}>
          {sosData.photos.length > 0 && (
            <View style={styles.photosContainer}>
              {sosData.photos.map((photo) => (
                <View key={photo} style={styles.photoContainer}>
                  <Image source={{ uri: `${SOS_IMAGE_URL}${photo}` }} style={styles.image} resizeMode="cover"/>
                </View>
              ))}

            </View>
          )}
        </View>      
      </View>
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  block:{
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
  },
  topItems:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 6,
    paddingTop: Platform.select({
      ios: 40,
      android: 40,
      web: 10,
    }),    
  },
  closeIcon: {
    padding: 10,
    zIndex: 1000
  },
  sosTitle:{
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 50
  },
  options:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  userContainer:{
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImageContainer:{
    position: 'absolute',
    width: 68,
    height: 68,
    zIndex: 1,
    top: -34
  },
  profileImage:{
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  userInfo: {
    backgroundColor: '#F6F6F6',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 40,
    borderRadius: 16
  },
  name:{
    fontSize: 18,
    fontWeight: '700',
  },
  username:{
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 5,
    paddingBottom: 13
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    backgroundColor: '#000000',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    alignItems: 'center',
    marginBottom: 2,
  },
  userCity:{
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 10,
    marginTop: 10,
  },
  address: {
    fontSize: 14,
    fontWeight: '400',
  },
  showMap:{
    fontSize: 14,
    fontWeight: '700',
    paddingTop: 5,
    paddingBottom: 20,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 150,
    width: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag:{
    backgroundColor: '#F22C2C',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  noTags: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
  },
  photosContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoContainer:{
    width: '100%',
    height: 414,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SosView;

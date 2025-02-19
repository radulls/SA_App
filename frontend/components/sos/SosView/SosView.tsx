import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import CancellationModal from './CancellationModal'; 
import { cancelSosSignal, getCancellationReasons, getSosSignalById, SOS_IMAGE_URL } from '@/api/sos/sosApi';
import { getUserProfile } from '@/api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import PhotoCarousel from '@/components/PhotoCarousel/PhotoCarousel';
import SosDetails from './SosDetails';
import SosHeader from './SosHeader';


interface SosViewProps {
  sosId: string; // 🔥 Теперь получаем ID
}
interface SosDetails {
  _id: string;
  title: string;
  location: { latitude: number; longitude: number; address: string };
  tags: { _id: string; name: string }[];
  description: string;
  photos: string[];
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
    city: string;
  } | null;
}
interface CancellationReason {
  _id: string;
  reason: string;
}

const SosView: React.FC<SosViewProps> = ({ sosId }) => {
  const [sosData, setSosData] = useState<SosDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [cancellationReasons, setCancellationReasons] = useState<CancellationReason[]>([]);

  
  useEffect(() => {
    fetchSosData(sosId);
  }, [sosId]);

  const fetchSosData = async (sosId: string) => {
    try {
      console.log("📡 Загружаем SOS-сигнал с ID:", sosId);
      const response = await getSosSignalById(sosId);
      console.log("✅ Данные, полученные на фронте:", response.data);
  
      const fixedData = { ...response.data, user: response.data.user?.user };
      console.log("📌 ID владельца сигнала:", fixedData.user?._id);
  
      setSosData(fixedData);
    } catch (error) {
      console.error("❌ Ошибка загрузки SOS-сигнала:", error);
    } finally {
      setLoading(false);
    }
  };  
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userProfile = await getUserProfile();
        console.log("📝 Загружаем профиль, ID пользователя:", userProfile.id);
  
        if (userProfile.id) { // Проверяем, что ID не undefined
          await AsyncStorage.setItem('userId', userProfile.id.toString());
          console.log("✅ Обновленный userId в AsyncStorage:", await AsyncStorage.getItem('userId'));
  
          setCurrentUser(userProfile.id.toString()); // Приводим к строке
        } else {
          console.error("❌ Ошибка: userProfile.id отсутствует");
        }
      } catch (error) {
        console.error("Ошибка загрузки текущего пользователя:", error);
      }
    };
  
    fetchCurrentUser();
  }, []);
  
  const isOwner = !!sosData?.userId && !!currentUser && currentUser.toString() === sosData.userId.toString();
  console.log("🔍 Проверка владельца сигнала:", {
    currentUser,
    sosOwnerId: sosData?.userId,
    isOwner
  });

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

  const handleEditPress = () => {
    router.push({
      pathname: "/sos",
      params: {
        editMode: "true",
        sosId: sosData?._id,
        title: sosData?.title,
        description: sosData?.description,
        tags: JSON.stringify(sosData?.tags.map(tag => tag.name)), 
        photos: JSON.stringify(sosData?.photos),
        latitude: sosData?.location.latitude,
        longitude: sosData?.location.longitude,
        address: sosData?.location.address,
      }
    });
  };
  
  const fetchCancellationReasons = async () => {
    try {
      const reasons = await getCancellationReasons();
      setCancellationReasons(reasons);
    } catch (error) {
      console.error("❌ Ошибка загрузки причин отмены:", error);
    }
  };

  const handleCancelSos = async () => {
    if (!selectedReason) {
      Alert.alert("Ошибка", "Выберите причину отмены.");
      return;
    }
    try {
      await cancelSosSignal(sosId, selectedReason);

      // Показываем Toast
      Toast.show({
        type: 'success',
        text1: 'SOS-сигнал отменён',
        position: 'bottom',
      });
      setModalVisible(false);
      // Пауза 2 секунды перед переходом на главную
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось отменить SOS-сигнал.");
    }
  };

  const openCancelModal = async () => {
    await fetchCancellationReasons();
    setModalVisible(true);
  };  
  
  return (
    <ScrollView contentContainerStyle={styles.block}>
      <View style={styles.container}>
        <SosHeader onClose={closeSos} />
        <SosDetails
          user={sosData.user}
          location={sosData.location}
          tags={sosData.tags}
          title={sosData.title}
          description={sosData.description}
          onOpenMap={openFullMap}
        />
        <PhotoCarousel photos={sosData.photos.map(photo => `${SOS_IMAGE_URL}${photo}`)}/>
        <View style={styles.buttonsContainer}>
          {isOwner ? (
            <>
              <TouchableOpacity style={styles.buttonItem} onPress={handleEditPress}>
                <Text style={styles.buttonText}>Редактировать</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonItem, styles.buttonItemCancel]} onPress={openCancelModal}>
                <Text style={[styles.buttonText, styles.buttomTextCancel]}>Отменить сигнал</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.buttonItem, styles.buttonItemCancel]}>
            <Text style={[styles.buttonText, styles.buttomTextCancel]}>Присоединиться</Text>
          </TouchableOpacity>
          )}
        </View>  
        <CancellationModal
          visible={modalVisible}
          reasons={cancellationReasons}
          selectedReason={selectedReason}
          onSelectReason={setSelectedReason}
          onClose={() => setModalVisible(false)}
          onConfirm={handleCancelSos}
        />
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
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsContainer:{
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  buttonItem:{
    paddingVertical: 15,
    flex: 1,
    borderRadius: 8,
  },
  buttonItemCancel:{
    backgroundColor: '#000',
  },
  buttonText:{
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center'
  },
  buttomTextCancel:{
    color: '#fff'
  },
});

export default SosView;

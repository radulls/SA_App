import React, { useEffect, useState } from 'react';
import { IMAGE_URL, UserDataProps, getUserProfile } from '@/api/index'; 
import { getSosSignalById, getSosSignalByUserId } from '@/api/sos/sosApi';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Text, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import Post from './Post';
import BottomNavigation from '../BottomNavigation';
import EditBackgroundImage from './EditBackgroundImage';
import SettingsIcon from '../svgConvertedIcons/SettingsIcon';
import SosIcon from '../svgConvertedIcons/sosIcons/SosIcon';
import QrIcon from '../svgConvertedIcons/qrIcon';
import { styles } from './profileStyle';
import ProfileSosIcon from '../svgConvertedIcons/sosIcons/profileSosIcon';

const ProfileMain: React.FC = () => {
  const [user, setUser] = useState<UserDataProps | null>(null); // Состояние для данных пользователя
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибок
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [backgroundImage, setBackgroundImage] = useState(user?.backgroundImage);

  const updateUserBackgroundProfile = (updatedBackgroundImage: string) => {
    if (user) {
      setUser({ ...user, backgroundImage: updatedBackgroundImage });
    }
  };

  const handleSave = (newImage: string) => {
    setBackgroundImage(newImage);
    setImageKey(Date.now()); // Обновляем ключ для сброса кэша
    updateUserBackgroundProfile(newImage); // Передаем новое изображение в родительский компонент
    setModalVisible(false);
    console.log('ProfileHeader props:', { backgroundImage, user });
  };  

  useEffect(() => {
    if (user?.backgroundImage) {
      setBackgroundImage(user.backgroundImage);
    }
  }, [user]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Запуск загрузки данных профиля...");
        setLoading(true);
        const userData = await getUserProfile();
        console.log("✅ Данные пользователя получены:", userData);
  
        let activeSosId = null;
  
        if (userData.id) {
          console.log(`📡 Ищем активный SOS-сигнал для userId: ${userData.id}`);
          
          // ✅ Теперь вызываем API для поиска активного SOS
          const sosResponse = await getSosSignalByUserId(userData.id);
  
          console.log("🎯 Ответ от getSosSignalByUserId:", sosResponse);
  
          if (sosResponse && sosResponse.status === "active") {
            activeSosId = sosResponse._id;
            console.log(`✅ Найден активный SOS: ${activeSosId}`);
          } else {
            console.warn("⚠️ У пользователя нет активного SOS-сигнала.");
          }
        }
  
        setUser({
          ...userData,
          sosSignalActive: !!activeSosId,
          sosSignalId: activeSosId,
        });
      } catch (err: any) {
        console.error("❌ Ошибка при загрузке данных пользователя:", err.message);
        setError(err.message || "Ошибка при загрузке данных пользователя.");
      } finally {
        console.log("✅ Загрузка завершена, setLoading(false)");
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const updateUserProfile = (updatedProfileImage: string) => {
    if (user) {
      setUser({ ...user, profileImage: updatedProfileImage });
    }
  };

  // Если данные загружаются
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Загрузка данных...</Text>
      </View>
    );
  }

  // Если произошла ошибка
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
      </View>
    );
  }

  // Если данные пользователя отсутствуют
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Данные пользователя не найдены</Text>
      </View>
    );
  }

  const fetchSosSignal = async (sosId: string) => {
    try {
      const response = await getSosSignalById(sosId);
    } catch (error){
      console.error("❌ Ошибка загрузки SOS-сигнала:", error)
    } 
  };

  // Отображение профиля
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => {
                if (user && user.id) {
                  console.log(`Navigating to: /profileQR/${user.id}`);
                  router.push(`/profileQR/${user.id}`);
                } else {
                  console.error("Данные пользователя не загружены или ID отсутствует.");
                }
              }}
            >
              <QrIcon width={22} height={22} />
            </TouchableOpacity>
            {user.sosSignalActive ? (
              <Pressable onPress={() => router.push(`/sos-signal/${user.sosSignalId}`)} style={styles.sosActiveContainer}>
                <ProfileSosIcon/>
                <Text style={styles.sosActiveText}>Cигнал SOS активирован</Text>
              </Pressable>
            ) : (
              ''
            )}
            <View style={styles.rightIcons}>
              {user.sosSignalActive ? (
                ''
              ) : (
                <TouchableOpacity onPress={() => router.push("/sos")} style={styles.sosIcon}>
                  <SosIcon width={22} height={22} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => router.push("/settings")} style={styles.settingIcon}>
                <SettingsIcon width={22} height={22} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.coverImageContainer}>
            {backgroundImage ? ( 
              <Image
                resizeMode="cover"
                source={{
                  uri: `${IMAGE_URL}${backgroundImage}?key=${imageKey}`,
                  cache: 'reload',
                }}
                style={styles.coverImage}
              />              
              ): (
              <View style={styles.coverImage} />
            )}
            </View>
          </TouchableOpacity>  
          <Modal visible={isModalVisible} animationType="slide">
            <EditBackgroundImage
            backgroundImage={backgroundImage || ''}
            onClose={() => setModalVisible(false)}
            onSave={handleSave}/>
          </Modal>          
          {user && <ProfileHeader user={user} isOwnProfile={true} onUpdateUserProfile={updateUserProfile} />}
          <ProfileStats user={user} />
          <View style={styles.divider} />
          <Post postType="image" />
          <Post postType="video" />
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default ProfileMain;

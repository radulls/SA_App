import React, { useEffect, useState } from 'react';
import { IMAGE_URL, UserDataProps, getUserProfile } from '@/api/index'; 
import { getSosSignalByUserId } from '@/api/sos/sosApi';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Text, Modal, Pressable, Platform, Alert, LayoutAnimation } from 'react-native';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import Post from '../Posts/Post';
import * as ImagePicker from 'expo-image-picker';
import BottomNavigation from '../BottomNavigation';
import EditBackgroundImage from './EditBackgroundImage';
import SettingsIcon from '../svgConvertedIcons/SettingsIcon';
import SosIcon from '../svgConvertedIcons/sosIcons/SosIcon';
import QrIcon from '../svgConvertedIcons/qrIcon';
import { styles } from './profileStyle';
import ProfileSosIcon from '../svgConvertedIcons/sosIcons/profileSosIcon';
import { updateUser } from '@/api'; 
import Toast from 'react-native-toast-message';
import { PostData, getPostsByUser } from '@/api/postApi';

const ProfileMain: React.FC = () => {
  const [user, setUser] = useState<UserDataProps | null>(null); // Состояние для данных пользователя
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибок
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [backgroundImage, setBackgroundImage] = useState(user?.backgroundImage);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sosSignal, setSosSignal] = useState<any | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    if (user?.backgroundImage) {
      let fixedUrl = user.backgroundImage;
      if (!user.backgroundImage.startsWith('http')) {
        fixedUrl = `${IMAGE_URL}${user.backgroundImage}`;
      }
      console.log(' Устанавливаем фото профиля:', fixedUrl); //  Логируем, что реально устанавливается
      setBackgroundImage(fixedUrl);
    }
  }, [user]);
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      const selectedImageUri = result.assets[0].uri;
      setSelectedImage(selectedImageUri);
      setModalVisible(true);
      setTimeout(() => setEditing(true), 100);
    }
  };
  
  const handleSave = async (newImage: string | null) => {
    try {
      if (!newImage) {
        // Если `newImage` пустое, просто обновляем состояние без загрузки файла
        setBackgroundImage(undefined);
        setUser(prev => prev ? { ...prev, backgroundImage: undefined } : prev);
        return;
      }
  
      let fileUri = newImage;
      let fileType = 'image/jpeg';
      let fileName = `background-${Date.now()}.jpg`;
      let fileBlob = null;
  
      if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        fileBlob = await response.blob();
        fileBlob = new File([fileBlob], fileName, { type: fileType });
      } else {
        fileBlob = {
          uri: fileUri,
          type: fileType,
          name: fileName,
        } as any;
      }
  
      const formData = new FormData();
      formData.append('backgroundImage', fileBlob);
  
      console.log('📤 Отправляем изображение:', formData);
  
      const response = await updateUser({}, formData);
  
      if (response?.user?.backgroundImage) {
        console.log("✅ Фон успешно обновлён на сервере:", response.user.backgroundImage);
        setBackgroundImage(response.user.backgroundImage);
        setUser(prev => prev ? { ...prev, backgroundImage: response.user.backgroundImage } : prev);
        setImageKey(Date.now());
        Toast.show({
          type: 'success',
          text1: 'Фон обновлён',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Сервер не вернул обновленное изображение.',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки изображения:', error);
      Toast.show({
        type: 'error',
        text1: 'Не удалось загрузить изображение.',
        visibilityTime: 2000,
      });
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("🚀 Загружаем профиль пользователя...");
        setLoading(true);
        const userData = await getUserProfile();
        console.log("✅ Данные пользователя:", userData);
  
        setUser(userData);
        if (userData?.backgroundImage) {
          setBackgroundImage(userData.backgroundImage);
        }
  
        // Проверяем, есть ли ID пользователя, прежде чем делать запрос SOS
        if (userData?.id) {
          console.log("📡 Проверяем активный SOS-сигнал для пользователя:", userData.id);
          const activeSos = await getSosSignalByUserId(userData.id);
          const userPosts = await getPostsByUser(userData.id);
          setPosts(userPosts);
  
          if (activeSos) {
            console.log("Найден активный SOS-сигнал:", activeSos);
            setSosSignal(activeSos);
          } else {
            console.log(" У пользователя нет активного SOS-сигнала.");
          }
        } else {
          console.warn("Ошибка: ID пользователя отсутствует.");
        }
      } catch (err: any) {
        console.error("Ошибка загрузки данных пользователя:", err.message);
        setError(err.message || "Ошибка загрузки данных.");
      } finally {
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
            {sosSignal ? (
              <Pressable onPress={() => router.push(`/sos-signal/${sosSignal._id}`)} style={styles.sosActiveContainer}>
                <ProfileSosIcon />
                <Text style={styles.sosActiveText}>SOS активирован</Text>
              </Pressable>
            ) : (
              ''
            )}
            <View style={styles.rightIcons}>
              {sosSignal ? (
                ''
              ) : (
                <TouchableOpacity onPress={() => router.push("/sos")} style={styles.sosIcon}>
                  <SosIcon width={22} height={22} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => router.push("/settings")} style={[ sosSignal ? styles.settingIconSos : styles.settingIcon]}>
                <SettingsIcon width={22} height={22} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={async () => {
              if (!backgroundImage) {
                await handleImagePick();
              } else {
                setModalVisible(true);
              }
            }}
          >
            <View style={styles.coverImageContainer}>
              {backgroundImage ? (
                <Image
                  resizeMode="cover"
                  source={{
                    uri: `${backgroundImage}?key=${imageKey}`,
                    cache: 'reload',
                  }}
                  style={styles.coverImage}
                />
              ) : (
                <View style={styles.coverImage} />
              )}
            </View>
          </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide">
          <EditBackgroundImage
            backgroundImage={selectedImage || backgroundImage || ''}
            onClose={() => { 
              setModalVisible(false);
              setEditing(false);
              setSelectedImage(null); 
            }} 
            onSave={(newImage) => {
              handleSave(newImage);
            }} 
            isEditing={isEditing} 
          />
        </Modal> 
          {user && <ProfileHeader user={user} isOwnProfile={true} onUpdateUserProfile={updateUserProfile} />}
          <ProfileStats user={user} />
          <View style={styles.divider} />
          {[...posts]
            .sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // по времени
            })
            .map((post) => (
              <Post
                key={post._id}
                post={post}
                onTogglePin={(id, newPinned) => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setPosts(prev =>
                    prev.map(p => (p._id === id ? { ...p, isPinned: newPinned } : p))
                  );
                }}
              />
          ))}
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default ProfileMain;

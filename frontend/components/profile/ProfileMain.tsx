import React, { useEffect, useState } from 'react';
import { IMAGE_URL, UserDataProps, getUserProfile } from '@/api/index'; // Импортируем интерфейс и функцию API
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Text, Modal } from 'react-native';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import Post from './Post';
import BottomNavigation from '../BottomNavigation';
import EditBackgroundImage from './EditBackgroundImage';

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
        setLoading(true);
        const userData = await getUserProfile(); // Получаем данные пользователя через API
        setUser(userData); // Устанавливаем данные пользователя
      } catch (err: any) {
        console.error('Ошибка при загрузке данных пользователя:', err.message);
        setError(err.message || 'Ошибка при загрузке данных пользователя.');
      } finally {
        setLoading(false); // Скрываем индикатор загрузки
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
                console.error('Данные пользователя не загружены или ID отсутствует.');
              }
            }}
          >
            <Image
              source={require('../../assets/images/profile/qr.png')}
              style={styles.qrIcon}
            />
          </TouchableOpacity>
            <View style={styles.rightIcons}>
              <Image
                source={require('../../assets/images/profile/sos.png')}
                style={styles.sosIcon}
              />
              <TouchableOpacity onPress={() => { router.push('/settings'); }}>
                <Image
                  source={require('../../assets/images/profile/settings.png')}
                  style={styles.settingsIcon}
                />
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
          <ProfileHeader onUpdateUserProfile={updateUserProfile} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  qrIcon: {
    width: 22,
    height: 22,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosIcon: {
    width: 22,
    height: 22,
    marginRight: 20,
  },
  settingsIcon: {
    width: 22,
    height: 22,
  },
  coverImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,  // Устанавливаем соотношение сторон 16:9, но можно адаптировать под нужное
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D2D2D2',
    resizeMode: 'cover',  // Сохраняет пропорции изображения при изменении размеров контейнера
  },
  divider: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    minHeight: 0.5,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
});

export default ProfileMain;

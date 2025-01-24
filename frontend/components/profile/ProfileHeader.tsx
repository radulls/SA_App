import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { IMAGE_URL, getUserProfile, UserDataProps } from '@/api';
import EditProfileImage from './EditProfileImage';

interface UserProps {
  onUpdateUserProfile: (updatedProfileImage: string) => void;
}

const ProfileHeader: React.FC<UserProps> = ({ onUpdateUserProfile }) => {
  const [user, setUser] = useState<UserDataProps | null>(null); // Состояние пользователя
  const [profileImage, setProfileImage] = useState<string | null>(null); // Состояние изображения профиля
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(); // Запрос данных пользователя из API
        setUser(userData);
        setProfileImage(userData.profileImage || null);
      } catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = (newImage: string) => {
    setProfileImage(newImage);
    setImageKey(Date.now()); // Обновляем ключ для сброса кэша
    onUpdateUserProfile(newImage); // Передаем новое изображение в родительский компонент
    setModalVisible(false);
    console.log('ProfileHeader props:', { profileImage, user });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Загрузка данных...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Не удалось загрузить данные пользователя.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.locationText}>{user.city}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {profileImage ? (
            <Image
              source={{
                uri: `${IMAGE_URL}${profileImage}?key=${imageKey}`,
                cache: 'reload',
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileImage} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{user.aboutMe}</Text>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
        <EditProfileImage
          profileImage={profileImage || ''}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  username: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginTop: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
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
    fontWeight: 'bold',
  },
  locationText: {
    marginLeft: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D2D2D2',
  },
  descriptionContainer: {
    marginTop: 12,
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: '#000000',
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
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ProfileHeader;

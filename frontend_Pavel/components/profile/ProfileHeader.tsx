import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image } from 'react-native';
import {mockUserData} from '@/api/mockApi'; // Импортируем мок-данные напрямую
import EditProfileImage from './EditProfileImage';

interface UserProps {
  onUpdateUserProfile: (updatedProfileImage: string) => void;
}

const ProfileHeader: React.FC<UserProps> = ({ onUpdateUserProfile }) => {
  const user = mockUserData; // Просто берем данные из мока
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null); // Изображение из мока
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Используется для сброса кэша

  const handleSave = (newImage: string) => {
    setProfileImage(newImage);
    setImageKey(Date.now()); // Обновляем ключ для сброса кэша
    onUpdateUserProfile(newImage); // Передаем новое изображение в родительский компонент
    setModalVisible(false);
  };

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
              source={user.profileImage}
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
    fontFamily: "SFUIDisplay-Bold",
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  username: {
    fontFamily: "SFUIDisplay-medium",
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginTop: 2,
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
    fontFamily: "SFUIDisplay-Bold",
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    alignItems: "center",
    marginBottom: 2,
  },
  locationText: {
    fontFamily: "SFUIDisplay-Bold",
    marginLeft: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
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
    fontFamily: "SFUIDisplay-regular",
    fontSize: 14,
    color: '#000000',
  },
});

export default ProfileHeader;

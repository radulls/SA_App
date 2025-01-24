import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Text, Modal } from 'react-native';
import { router } from 'expo-router';
import { mockUserData } from '@/api/mockApi'; // Импортируем данные из мока
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import Post from './Post';
import BottomNavigation from '../BottomNavigation';
import EditBackgroundImage from './EditBackgroundImage';

const ProfileMain: React.FC = () => {
  const [user, setUser] = useState(mockUserData); // Используем моковые данные
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Для обновления кэша изображений

  const updateUserProfile = (updatedProfileImage: string) => {
    setUser({ ...user, profileImage: updatedProfileImage });
  };

  const updateUserBackgroundProfile = (updatedBackgroundImage: string) => {
    setUser({ ...user, backgroundImage: updatedBackgroundImage });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => {
                if (user?.id) {
                  console.log(`Navigating to: /profileQR/${user.id}`);
                  router.push(`/profileQR/${user.id}`);
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
              {user.backgroundImage ? (
                <Image
                  resizeMode="cover"
                  source={user.backgroundImage}
                  style={styles.coverImage}
                  key={imageKey}
                />
              ) : (
                <View style={styles.coverImage} />
              )}
            </View>
          </TouchableOpacity>
          <Modal visible={isModalVisible} animationType="slide">
            <EditBackgroundImage
              backgroundImage={user.backgroundImage || ''}
              onClose={() => setModalVisible(false)}
              onSave={(newImage) => {
                updateUserBackgroundProfile(newImage);
                setImageKey(Date.now()); // Обновляем кэш
                setModalVisible(false);
              }}
            />
          </Modal>
          <ProfileHeader onUpdateUserProfile={updateUserProfile} />
          <ProfileStats />
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
    height: 210,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D2D2D2',
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

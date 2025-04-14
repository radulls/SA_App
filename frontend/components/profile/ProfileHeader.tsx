import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image, Platform, Alert } from 'react-native';
import { IMAGE_URL, UserDataProps, updateUser } from '@/api';
import EditProfileImage from './EditProfileImage';
import { BlurView } from 'expo-blur'; // Импортируем BlurView
import * as ImagePicker from 'expo-image-picker';
import { getFullName } from '@/utils/getFullName';

interface ProfileHeaderProps {
  user: UserDataProps | null;
  isOwnProfile: boolean;
  onUpdateUserProfile?: (updatedProfileImage: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onUpdateUserProfile }) => {
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [loading, setLoading] = useState<boolean>(!user);
  const [shouldHideName, setShouldHideName] = useState(true);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('Статус верификации:', user.verificationStatus);
      setShouldHideName(isOwnProfile && user.verificationStatus !== 'verified');
    }
  }, [user, isOwnProfile]);  

  useEffect(() => {
    if (user?.profileImage) {
      let fixedUrl = user.profileImage;
      if (!user.profileImage.startsWith('http')) {
        fixedUrl = `${IMAGE_URL}${user.profileImage}`;
      }
      console.log('🔥 Устанавливаем фото профиля:', fixedUrl); // 👀 Логируем, что реально устанавливается
      setProfileImage(fixedUrl);
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
  
  const handleSave = async (newImage: string) => {
    try {
      let fileUri = newImage;
      let fileType = 'image/jpeg';
      let fileName = `profile-${Date.now()}.jpg`;
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
      formData.append('profileImage', fileBlob);
  
      console.log('📤 Отправляем фото профиля:', formData);
      console.log("🔍 Отправляем файл:", {
        uri: fileUri,
        type: fileType,
        name: fileName,
        blob: fileBlob
      });      
  
      const response = await updateUser({}, formData);
  
      if (response?.user?.profileImage) {
        console.log(" Фото профиля загружено на сервер:", response.user.profileImage);
        
        setProfileImage(response.user.profileImage);
        setImageKey(Date.now()); // Обновляем ключ кэша
  
        if (onUpdateUserProfile) onUpdateUserProfile(response.user.profileImage);
        setModalVisible(false); 
      } else {
        Alert.alert('Ошибка', 'Сервер не вернул обновленное изображение.');
      }
    } catch (error) {
      console.error(' Ошибка загрузки изображения:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить изображение.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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

  console.log('Пользователь:', user);
  console.log('Статус верификации:', user?.verificationStatus);


  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.nameContainer}>
          {shouldHideName ? (
          <View style={styles.nameWrapper}>
            <BlurView intensity={25} style={styles.blurContainer}/>
            <Text style={styles.placeholderText}>Имя Фамилия</Text>
          </View>          
        ) : (
          <Text style={styles.name}>{getFullName(user)}</Text>
        )}
          <Text style={styles.username}>@{user.username}</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.locationText}>{user.city}</Text>
          </View>
        </View>

        {/* Фото профиля */}
        <TouchableOpacity
          onPress={async () => {
            if (!profileImage) {
              await handleImagePick(); // Если фото нет — сразу открываем загрузку
            } else {
              setModalVisible(true); //  Если фото есть — открываем редактор
            }
          }}
        >
          {profileImage ? (
            <Image
              source={{ uri: `${profileImage}?key=${imageKey}` }}  //  Добавляем key для обновления
              style={styles.profileImage}
              onError={() => console.log(" Ошибка загрузки фото:", profileImage)} // Логируем ошибку
            />
          ) : (
            <View style={styles.profileImage} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{user.aboutMe}</Text>
      </View>
      {/* Модальное окно для редактирования фото (только для владельца профиля) */}
      {isOwnProfile && (
      <Modal visible={isModalVisible} animationType="slide">
       <EditProfileImage 
        profileImage={selectedImage || profileImage || ''} 
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
    )}
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
    fontFamily: "SFUIDisplay-bold",
    color: '#000000',
  },
  username: {
    fontSize: 14,
    color: '#000000',
    fontFamily: "SFUIDisplay-medium",
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
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    marginLeft: 3,
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
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
    fontSize: 14,
    color: '#000000',
    fontFamily: "SFUIDisplay-regular",
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
  nameWrapper: {
    position: 'relative',
    overflow: 'visible'
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject, 
    borderRadius: 5,
    zIndex: 1,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    padding: 8,
  },
});

export default ProfileHeader;

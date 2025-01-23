import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateUser, IMAGE_URL } from '@/api';
import IconBack from '../svgConvertedIcons/iconBack';

interface EditProfileImageProps {
  profileImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
}

const EditProfileImage: React.FC<EditProfileImageProps> = ({ profileImage, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Управляет состоянием кнопки "Изменить"/"Готово"

  // Устанавливаем начальное изображение
  useEffect(() => {
    setSelectedImage(profileImage ? `${IMAGE_URL}${profileImage}` : null);
  }, [profileImage]);

  // Обработчик выбора изображения
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
      setIsEditing(true); // Меняем кнопку на "Готово"
    }
  };

  // Обработчик сохранения изображения
  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert('Ошибка', 'Выберите изображение.');
      return;
    }
  
    try {
      const file = {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      };
  
      const response = await updateUser({}, file as unknown as File);
  
      // Достаем обновленный путь к изображению из `response.user.profileImage`
      console.log('Сервер вернул:', response);
  
      if (response?.user?.profileImage) {
        onSave(response.user.profileImage); // Передаем обновленный путь
        Alert.alert('Успех', 'Фото профиля обновлено.');
        onClose();
      } else {
        Alert.alert('Ошибка', 'Сервер не вернул обновленное изображение.');
      }
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      Alert.alert('Ошибка', 'Не удалось обновить фото.');
    }
  };
  
  
  const handleReset = () => {
    setSelectedImage(profileImage ? `${IMAGE_URL}${profileImage}` : null); 
    setIsEditing(false); 
  };

  return (
    <View style={styles.container}>
      {/* Верхняя панель */}
      <View style={styles.headerIcons}>
        <View style={styles.iconBack}>
          <IconBack onPress={onClose} fill="black" />
        </View>
        <Text style={styles.headerTitle}>Аватар</Text>
        <TouchableOpacity onPress={handleReset} style={styles.dropButton}>
          <Text style={styles.buttonText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      {/* Область изображения */}
      <View style={styles.imageWrapper}>
        {selectedImage ? (
          <Image style={styles.fullscreenImage} source={{ uri: selectedImage }} />
        ) : (
          <View style={[styles.fullscreenImage, styles.imagePlaceholder]} />
        )}
      </View>

      {/* Кнопки */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={isEditing ? handleSave : handleImagePick}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Готово' : 'Изменить'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingHorizontal: 16,
    marginTop: 75,
    height: 22,
  },
  iconBack: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    fontSize: 15,
    paddingLeft: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
  },
  dropButton: {
    position: 'absolute',
    right: 0,
  },
  imageWrapper: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePlaceholder: {
    backgroundColor: '#D2D2D2', // Фон вместо заглушки
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default EditProfileImage;

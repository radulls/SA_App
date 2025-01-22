import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateUser, IMAGE_URL } from '@/api';

interface EditProfileImageProps {
  profileImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
}

const EditProfileImage: React.FC<EditProfileImageProps> = ({ profileImage, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Устанавливаем начальное значение selectedImage на основе переданного profileImage
    setSelectedImage(profileImage ? `${IMAGE_URL}${profileImage}` : null);
  }, [profileImage]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
      onSave(response.profileImage); // Обновляем аватарку
      Alert.alert('Успех', 'Фото профиля обновлено.');
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить фото.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.fullscreenImage}
          source={selectedImage ? { uri: selectedImage } : require('../../assets/images/avatar_post.png')}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleImagePick}>
          <Text style={styles.buttonText}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Готово</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Сбросить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfileImage;

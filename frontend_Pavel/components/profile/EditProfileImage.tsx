import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { mockUserData } from '@/api/mockApi'; // Импортируем мок-данные
import IconBack from '../svgConvertedIcons/iconBack';

type EditProfileImageProps = {
  profileImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
};

const EditProfileImage: React.FC<EditProfileImageProps> = ({ profileImage, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(mockUserData.profileImage || null); // Начальное изображение
  const [isEditing, setIsEditing] = useState(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Обновляем изображение, если пропсы изменились
  useEffect(() => {
    setSelectedImage(profileImage || mockUserData.profileImage);
  }, [profileImage]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
      setIsEditing(true);
    }
  };

  const handleReset = () => {
    setSelectedImage(mockUserData.profileImage); // Возвращаем исходное изображение из мока
    setIsEditing(false);
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };

  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert('Ошибка', 'Изображение не выбрано.');
      return;
    }

    try {
      const croppedImage = await ImageManipulator.manipulateAsync(
        selectedImage,
        [{ resize: { width: 300, height: 300 } }], // Обрезаем изображение до фиксированного размера
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      onSave(croppedImage.uri); // Передаем обрезанное изображение в родительский компонент
      Alert.alert('Успех', 'Фото профиля обновлено.');
      onClose();
    } catch (error) {
      console.error('Ошибка обработки изображения:', error);
      Alert.alert('Ошибка', 'Не удалось обработать изображение.');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePanGesture = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
    translateY.value = event.nativeEvent.translationY;
  };

  const handlePinchGesture = (event: any) => {
    scale.value = Math.max(1, scale.value * event.nativeEvent.scale);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <View style={styles.iconBack}>
          <IconBack onPress={onClose} fill="black" />
        </View>
        <Text style={styles.headerTitle}>{isEditing ? 'Обрезать' : 'Аватар'}</Text>
        {isEditing && (
          <TouchableOpacity onPress={handleReset} style={styles.dropButton}>
            <Text style={styles.buttonDrop}>Сбросить</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.imageWrapper}>
        {selectedImage ? (
          <PanGestureHandler onGestureEvent={handlePanGesture}>
            <PinchGestureHandler onGestureEvent={handlePinchGesture}>
              <Animated.Image
                source={selectedImage}
                style={[styles.fullscreenImage, animatedStyle]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          </PanGestureHandler>
        ) : (
          <View style={[styles.fullscreenImage, styles.imagePlaceholder]} />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : handleImagePick}>
          <Text style={styles.buttonText}>{isEditing ? 'Готово' : 'Изменить'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 75,
    height: 22,
  },
  iconBack: {
    position: 'absolute',
    left: -24,
  },
  headerTitle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
  },
  dropButton: {
    position: 'absolute',
    right: 0,
  },
  imageWrapper: {
    width: 380,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 190,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#D2D2D2',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    padding: 18,
    borderRadius: 5,
    backgroundColor: '#000',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  buttonDrop: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default EditProfileImage;

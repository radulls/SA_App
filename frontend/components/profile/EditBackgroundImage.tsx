import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { updateUser, IMAGE_URL } from '@/api';
import IconBack from '../svgConvertedIcons/iconBack';

type EditBackgroundImageProps = {
  backgroundImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
};

type Dimensions = {
  width: number;
  height: number;
};

const EditBackgroundImage: React.FC<EditBackgroundImageProps> = ({ backgroundImage, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [wrapperDimensions, setWrapperDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setSelectedImage(backgroundImage ? `${IMAGE_URL}${backgroundImage}` : null);
  }, [backgroundImage]);

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
    setSelectedImage(backgroundImage ? `${IMAGE_URL}${backgroundImage}` : null);
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
      const { width: wrapperWidth, height: wrapperHeight } = wrapperDimensions;
      const { width: imageWidth, height: imageHeight } = await new Promise<Dimensions>((resolve, reject) => {
        Image.getSize(
          selectedImage,
          (width, height) => resolve({ width, height }),
          (error) => reject(error)
        );
      });
  
      const imageAspectRatio = imageWidth / imageHeight;
      const wrapperAspectRatio = wrapperWidth / wrapperHeight;
  
      let displayedImageWidth, displayedImageHeight;
      if (imageAspectRatio > wrapperAspectRatio) {
        displayedImageWidth = wrapperWidth * scale.value;
        displayedImageHeight = displayedImageWidth / imageAspectRatio;
      } else {
        displayedImageHeight = wrapperHeight * scale.value;
        displayedImageWidth = displayedImageHeight * imageAspectRatio;
      }
  
      const offsetX = (wrapperWidth - displayedImageWidth) / 2 + translateX.value;
      const offsetY = (wrapperHeight - displayedImageHeight) / 2 + translateY.value;
  
      const originX = Math.max(0, (Math.abs(offsetX) / displayedImageWidth) * imageWidth);
      const originY = Math.max(0, (Math.abs(offsetY) / displayedImageHeight) * imageHeight);
  
      const cropWidth = Math.min(
        (wrapperWidth / displayedImageWidth) * imageWidth,
        imageWidth - originX
      );
      const cropHeight = Math.min(
        (wrapperHeight / displayedImageHeight) * imageHeight,
        imageHeight - originY
      );
  
      const croppedImage = await ImageManipulator.manipulateAsync(
        selectedImage,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const formData = new FormData();
      formData.append('backgroundImage', {
        uri: croppedImage.uri,
        type: 'image/jpeg',
        name: 'background.jpg',
      } as any);
  
      const response = await updateUser({}, formData);
  
      if (response?.user?.backgroundImage) {
        onSave(response.user.backgroundImage);
        Alert.alert('Успех', 'Картинка фона обновлена.');
        onClose();
      } else {
        Alert.alert('Ошибка', 'Сервер не вернул обновленное изображение.');
      }
    } catch (error) {
      console.error('Ошибка обрезки изображения:', error);
      Alert.alert('Ошибка', 'Не удалось обрезать изображение.');
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
    const incrementalScale = event.nativeEvent.scale;

    if (event.nativeEvent.state === 5) {
        // Завершение жеста: фиксируем масштаб
        scale.value = Math.max(1, scale.value);
    } else {
        // Плавное обновление масштаба
        const newScale = scale.value * incrementalScale;
        scale.value += (Math.max(1, newScale) - scale.value) * 0.1; // 0.1 для плавности
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <View style={styles.iconBack}>
          <IconBack onPress={onClose} fill="black" />
        </View>
        <Text style={styles.headerTitle}>{isEditing ? 'Обрезать' : 'Редактировать фон'}</Text>
        {isEditing && (
          <TouchableOpacity onPress={handleReset} style={styles.dropButton}>
            <Text style={styles.buttonDrop}>Сбросить</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={styles.imageWrapper}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setWrapperDimensions({ width, height });
        }}
      >
        {selectedImage ? (
          <PanGestureHandler onGestureEvent={handlePanGesture}>
            <PinchGestureHandler onGestureEvent={handlePinchGesture}>
              <Animated.Image
                source={{ uri: selectedImage }}
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
    width: '100%',
    height: 194,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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

export default EditBackgroundImage;

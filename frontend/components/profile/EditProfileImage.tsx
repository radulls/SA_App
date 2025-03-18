import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import { PanGestureHandler, PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { deleteProfileImage } from '@/api';
import IconBack from '../svgConvertedIcons/iconBack';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

type EditProfileImageProps = {
  profileImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
  isEditing?: boolean;
};

const EditProfileImage: React.FC<EditProfileImageProps> = ({ profileImage, onClose, onSave, isEditing = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(isEditing);
  const imageRef = useRef<View>(null);
  const router = useRouter();
  const { width } = useWindowDimensions(); // Получаем ширину экрана

  // Вычисляем размер изображения
  const imageSize = Math.min(width * 0.9, 380); // 90% от ширины экрана, но не более 380 пикселей

  // Управление жестами
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setEditing(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (profileImage) {
      setSelectedImage(profileImage);
    }
  }, [profileImage]);

  // **Добавляем обработчик зума колесиком мыши**
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const zoomFactor = event.ctrlKey ? 0.4 : 0.01; 
        scale.value = withTiming(Math.max(1, scale.value - event.deltaY * zoomFactor));
      };
  
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
      scale.value = 1; // Сбрасываем зум
      translateX.value = 0; // Сбрасываем смещение
      translateY.value = 0;
      setEditing(true);
    }
  };

  const handleReset = () => {
    console.log(' handleReset() вызван');
    if (!profileImage || isEditing) {
      console.log('🏠 Фото ещё не загружено — выходим на /home');
      handleExitToHome();
      return;
    }
    if (!isEditing && selectedImage === profileImage) {
      console.log('📌 Просто просмотр — закрываем модалку');
      onClose();
      return;
    }
    setSelectedImage(profileImage);
    setEditing(false);
    console.log('🔄 Отмена редактирования, возвращаем старое фото');
  };

  const handleExitToHome = () => {
    console.log('handleExitToHome() вызван');

    onClose(); 
    setTimeout(() => {
      console.log('Переход на /home');
      router.push('/home'); 
    }, 300); 
  };

  const handleDeleteBackground = async () => {
    try {
      await deleteProfileImage(); // Удаляем изображение с сервера
      setSelectedImage(null); // Очищаем локально
  
      Toast.show({
        type: 'success',
        text1: 'Фото удалено',
        visibilityTime: 2000,
      });
  
      onClose(); // Закрываем модальное окно
      setTimeout(() =>  router.push('/home'), 500); // Возвращаем пользователя назад
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Не удалось удалить изображение',
        visibilityTime: 2000,
      });
    }
  };

  const processAndSaveImage = async () => {
    if (!selectedImage) {
      console.error("Ошибка: нет выбранного изображения!");
      return;
    }
    if (!imageRef.current) {
      console.error("Ошибка: imageRef.current = null!");
      return;
    }
  
    try {
      // Получаем реальные размеры изображения
      Image.getSize(selectedImage, (width, height) => {
        console.log(`Исходное изображение: ${width}x${height}`);
      });
  
      setTimeout(async () => {
        const imageBase64 = await captureRef(imageRef, {
          format: 'png',
          quality: 1,
          result: 'base64'
        });
  
        console.log("Сохранённое изображение (base64, укорочено):", imageBase64.substring(0, 100));
        console.log("Отправляем изображение, размер base64:", imageBase64.length);
  
        onSave(`data:image/png;base64,${imageBase64}`);
      }, 200);
    } catch (error) {
      console.error("Ошибка при сохранении изображения:", error);
    }
  };

  const handleComplete = async () => {
    if (!selectedImage) return;

    try {
      await processAndSaveImage();
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Ошибка при сохранении изображения:', error);
    }
  };

  // **Анимации перемещения и зума**
  const animatedStyle = useAnimatedStyle(() => ({
    transform: editing
      ? [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ]
      : [{ scale: 1 }, { translateX: 0 }, { translateY: 0 }], // Сброс, если не редактирование
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerIcons}>
            {/* Контейнер для иконки "Назад" */}
            <View style={styles.leftContainer}>
              <View style={styles.iconBack}>
                <IconBack onPress={handleReset} fill="black" />
              </View>
            </View>
            {/* Заголовок по центру */}
            <Text style={styles.headerTitle}>{editing ? 'Обрезать' : 'Аватар'}</Text>
            {/* Контейнер для кнопки "Удалить" */}
            <View style={styles.rightContainer}>
              {!editing && selectedImage && (
                <TouchableOpacity onPress={handleDeleteBackground} style={styles.dropButton}>
                  <Text style={styles.buttonDrop}>Удалить</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Контейнер для фото с обработкой жестов */}
          {editing ? (
            <PanGestureHandler onGestureEvent={handlePanGesture}>
              <PinchGestureHandler onGestureEvent={handlePinchGesture}>
                <Animated.View 
                  ref={imageRef} 
                  collapsable={false} 
                  style={[
                    styles.imageWrapper, 
                    { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }
                  ]}
                >
                  {selectedImage ? (
                    <Animated.Image
                      source={{ uri: selectedImage }}
                      style={[styles.fullscreenImage, animatedStyle]}
                      resizeMode={editing ? "contain" : "cover"} // Показываем полное изображение при загрузке
                    />
                  ) : (
                    <View style={[styles.fullscreenImage, styles.imagePlaceholder]}>
                      <Text>Фото не выбрано</Text>
                    </View>
                  )}
                </Animated.View>
              </PinchGestureHandler>
            </PanGestureHandler>
            ) : (
            <View 
              ref={imageRef} 
              style={[
                styles.imageWrapper, 
                { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }
              ]}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullscreenImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.fullscreenImage, styles.imagePlaceholder]}>
                  <Text>Фото не выбрано</Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={editing ? handleComplete : handleImagePick}
            >
              <Text style={styles.buttonText}>{editing ? 'Готово' : 'Изменить'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Распределяем пространство между элементами
    width: '100%',
    marginTop: 57,
    height: 20,
  },
  leftContainer: {
    width: 50, // Ширина 50 пикселей
    alignItems: 'flex-start', // Выравниваем по левому краю
  },
  rightContainer: {
    width: 50, // Ширина 50 пикселей
    alignItems: 'flex-end', // Выравниваем по правому краю
  },
  iconBack: {
    // Стили для иконки "Назад"
  },
  headerTitle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontFamily: "SFUIDisplay-Bold",
    flex: 1, // Заголовок занимает всё доступное пространство между leftContainer и rightContainer
  },
  dropButton: {
    // Стили для кнопки "Удалить"
  },
  buttonDrop: {
    color: '#000',
    fontFamily: "SFUIDisplay-Bold",
    textAlign: 'center',
    fontSize: 14,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#D2D2D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#000',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontFamily: "SFUIDisplay-Bold",
    textAlign: 'center',
    fontSize: 12,
  },
});

export default EditProfileImage;
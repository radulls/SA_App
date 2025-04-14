import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { IMAGE_URL, deleteBackgroundImage } from '@/api';
import IconBack from '../svgConvertedIcons/iconBack';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

type EditBackgroundImageProps = {
  backgroundImage: string;
  onClose: () => void;
  onSave: (newImage: string) => void;
  isEditing?: boolean;
};

type Dimensions = {
  width: number;
  height: number;
};

const EditBackgroundImage: React.FC<EditBackgroundImageProps> = ({ backgroundImage, onClose, onSave, isEditing = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(isEditing);
  const [wrapperDimensions, setWrapperDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const imageRef = useRef<View>(null);
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions(); // Получаем ширину экрана

  // Вычисляем размеры изображения
  const baseWidth = 382; // Базовая ширина для экрана 414px
  const baseHeight = 194; // Базовая высота для экрана 414px
  const aspectRatio = baseHeight / baseWidth; // Соотношение сторон

  const imageWidth = Math.min(screenWidth * 0.9, baseWidth); // 90% от ширины экрана, но не более 382px
  const imageHeight = imageWidth * aspectRatio; // Высота вычисляется на основе ширины и соотношения сторон

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setEditing(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (backgroundImage) {
      setSelectedImage(backgroundImage);
    }
  }, [backgroundImage]);

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
      const selectedAsset = result.assets[0];
      scale.value = 1; // Сбрасываем зум
      translateX.value = 0; // Сбрасываем смещение
      translateY.value = 0;
      setSelectedImage(selectedAsset.uri);
      setEditing(true);
    }
  };

  const handleReset = () => {
    console.log(' handleReset() вызван');
    if (!backgroundImage || isEditing) {
      console.log('🏠 Фото ещё не загружено — выходим на /home');
      handleExitToHome();
      return;
    }
    if (!isEditing && selectedImage === backgroundImage) {
      console.log('📌 Просто просмотр — закрываем модалку');
      onClose();
      return;
    }
    setSelectedImage(backgroundImage);
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
      await deleteBackgroundImage(); // Удаляем изображение с сервера
      setSelectedImage(null); // Очищаем локально
  
      Toast.show({
        type: 'success',
        text1: 'Фон удалён',
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
        scale.value = Math.max(1, scale.value);
    } else {
        const newScale = scale.value * incrementalScale;
        scale.value += (Math.max(1, newScale) - scale.value) * 0.1;
    }
  };

  return (
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
          <Text style={styles.headerTitle}>{editing ? 'Обрезать' : 'Обложка'}</Text>
          {/* Контейнер для кнопки "Удалить" */}
          <View style={styles.rightContainer}>
            {!editing && selectedImage && (
              <TouchableOpacity onPress={handleDeleteBackground} style={styles.dropButton}>
                <Text style={styles.buttonDrop}>Удалить</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          ref={imageRef}
          style={[styles.imageWrapper, { width: imageWidth, height: imageHeight }]} // Динамические размеры
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setWrapperDimensions({ width, height });
          }}
        >
        {selectedImage ? (
          <PanGestureHandler onGestureEvent={handlePanGesture} enabled={editing}>
            <PinchGestureHandler onGestureEvent={handlePinchGesture} enabled={editing}>
              <Animated.Image
                source={{ uri: selectedImage }}
                style={[styles.fullscreenImage, animatedStyle]}
                resizeMode={editing ? "contain" : "cover"} // Полное изображение при загрузке, обрезка только в редактировании
              />
            </PinchGestureHandler>
          </PanGestureHandler>
        ) : (
          <View style={[styles.fullscreenImage, styles.imagePlaceholder]} />
        )}
        </View>
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
    maxWidth: 600,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center', // Центрируем дочерние элементы по горизонтали
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 57,
    height: 20,
  },
  leftContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  iconBack: {
    // Стили для иконки "Назад"
  },
  headerTitle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontFamily: "SFUIDisplay-Bold",
    flex: 1,
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
    alignSelf: 'center', // Центрируем контейнер по горизонтали
    backgroundColor: '#D2D2D2',
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

export default EditBackgroundImage;
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform,
  Modal, Animated, Dimensions, Easing
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UploadCouponImage from '@/components/svgConvertedIcons/settings/uploadCouponImage';
import DeleteColorIcon from '@/components/svgConvertedIcons/settings/deleteColorIcon';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import { captureRef } from 'react-native-view-shot';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import AnimatedReanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DeletePhotoIcon from '@/components/svgConvertedIcons/deletePhotoIcon';
import { createCoupon } from '@/api/adminApi';

const colors = ['#FF453A', '#FE8A01', '#FFD200', '#35C759', '#5AC8FA', '#63E6E1', '#0B84FE', '#BF5AF2'];

interface Props {
  onBack: () => void;
  subdivisionId?: string;
}

const CreateCouponScreen: React.FC<Props> = ({ onBack, subdivisionId }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [croppedBase64, setCroppedBase64] = useState<string | null>(null);

  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateYReanimated = useSharedValue(0);
  const imageRef = useRef<View>(null);

  useEffect(() => {
    if (isImagePreviewVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isImagePreviewVisible]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const zoomFactor = event.ctrlKey ? 0.4 : 0.01;
        scale.value = withTiming(Math.max(1, scale.value - event.deltaY * zoomFactor));
      };
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
  
      if (Platform.OS === 'web' && asset.file) {
        const url = URL.createObjectURL(asset.file);
        setImageUri(url);
      } else {
        setImageUri(asset.uri);
      }
  
      scale.value = 1;
      translateX.value = 0;
      translateYReanimated.value = 0;
  
      console.log('📸 PICKED IMAGE', Platform.OS === 'web' ? asset.file : asset.uri);
    }
  };  

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateYReanimated.value },
    ],
  }));

  const handlePanGesture = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
    translateYReanimated.value = event.nativeEvent.translationY;
  };

  const handlePinchGesture = (event: any) => {
    const newScale = scale.value * event.nativeEvent.scale;
    scale.value = Math.max(1, Math.min(15, newScale));
  };

  const handleSubmit = async () => {
    if (!title || !subdivisionId) {
      alert('Название и подразделение обязательны');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (details) formData.append('details', details);
      if (selectedColor) formData.append('color', selectedColor);
      formData.append('subdivisionId', subdivisionId);
      formData.append('status', 'active');
  
      if (Platform.OS === 'web' && croppedBase64) {
        const res = await fetch(croppedBase64);
        const blob = await res.blob();
        const file = new File([blob], 'cropped.png', { type: 'image/png' });
        formData.append('image', file);
        console.log('📸 Web: добавили файл', file);
      } else if (Platform.OS !== 'web' && imageUri) {
        const file = {
          uri: imageUri,
          name: `cropped-${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as any;
        formData.append('image', file);
        console.log('📸 Native: добавили файл', file);
      }      

      await createCoupon(formData);
      alert('Купон создан!');
      onBack();
    } catch (error) {
      console.error('❌ Ошибка при создании купона:', error);
      alert('Ошибка при создании купона');
    }
  };

  const handleDoneEditing = async () => {
    try {
      if (Platform.OS === 'web') {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUri!;
  
        img.onload = () => {
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;
  
          const outputSize = 600;
          const displayHeightPx = 78;
  
          const ratio = naturalHeight / displayHeightPx;
  
          const cropSize = outputSize / scale.value * ratio;
  
          const centerX = naturalWidth / 2 - translateX.value * ratio;
          const centerY = naturalHeight / 2 - translateYReanimated.value * ratio;
  
          const canvas = document.createElement('canvas');
          canvas.width = outputSize;
          canvas.height = outputSize;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('❌ Canvas context is null');
            return;
          }
  
          ctx.drawImage(
            img,
            centerX - cropSize / 2,
            centerY - cropSize / 2,
            cropSize,
            cropSize,
            0,
            0,
            outputSize,
            outputSize
          );
  
          const base64 = canvas.toDataURL('image/png');
          setCroppedBase64(base64);
          setImageUri(base64);
          setIsImagePreviewVisible(false);
        };
  
        img.onerror = () => {
          alert('❌ Ошибка загрузки изображения');
        };
      } else {
        const uri = await captureRef(imageRef, {
          format: 'jpg',
          quality: 1,
          result: 'tmpfile',
        });
        setImageUri(uri);
        setIsImagePreviewVisible(false);
      }
    } catch (err) {
      console.error('❌ Ошибка при обрезке изображения', err);
    }
  };  
  
  const handleDeletePhoto = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название купона</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={title}
        onChangeText={setTitle}
      />
  
      <Text style={styles.label}>Детали</Text>
      <TextInput
        style={[styles.input, { minHeight: 100 }]}
        placeholder=""
        multiline
        value={details}
        onChangeText={setDetails}
      />
  
      <Text style={styles.label}>Обложка</Text>
      <TouchableOpacity
        style={[styles.imagePicker, selectedColor && !imageUri ? { backgroundColor: selectedColor } : {}]}
        onPress={() => setIsImagePreviewVisible(true)}
      >
        {imageUri ? (
          <View style={styles.uploadedPhotoContainer}>
            <Image source={{ uri: croppedBase64 || imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.deletePhotoIcon} onPress={handleDeletePhoto}>
              <DeletePhotoIcon />
            </TouchableOpacity>
          </View>
        ) : selectedColor ? null : (
          <UploadCouponImage />
        )}
      </TouchableOpacity>
  
      <Text style={styles.label}>Или выбрать цвет</Text>
      <View style={styles.colorRow}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.colorCircleSelected]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
        <TouchableOpacity onPress={() => setSelectedColor(null)}>
          <View style={styles.borderIcon}><DeleteColorIcon /></View>
        </TouchableOpacity>
      </View>
  
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Создать</Text>
      </TouchableOpacity>  
      <Modal transparent visible={isImagePreviewVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
            <View style={styles.modalHeader}>
              <IconBack fill='#000' onPress={() => setIsImagePreviewVisible(false)} />
              <Text style={[styles.modalHeaderText, { fontWeight: 'bold' }]}>Обложка</Text>
              <TouchableOpacity onPress={() => {
                setImageUri(null);
                setSelectedColor(null);
                setIsImagePreviewVisible(false);
              }}>
                <Text style={styles.modalHeaderText}>Сбросить</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.9}
              style={[
                styles.modalImageWrapper,
                selectedColor && !imageUri ? { backgroundColor: selectedColor } : {},
              ]}
            >
              {imageUri ? (
              <View
                ref={imageRef}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F3F3F3',
                }}
              >
               <PanGestureHandler onGestureEvent={handlePanGesture}>
                 <PinchGestureHandler onGestureEvent={handlePinchGesture}>
                   <AnimatedReanimated.Image
                     source={{ uri: imageUri }}
                     style={[styles.modalImage, animatedStyle]}
                     resizeMode="contain"
                   />
                 </PinchGestureHandler>
               </PanGestureHandler>
              </View>
             
              ) : selectedColor ? null : (
                <UploadCouponImage />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitButton, { marginTop: 32 }]} onPress={handleDoneEditing}>
              <Text style={styles.submitText}>Готово</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 16 },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  imagePicker: {
    height: 78,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    resizeMode: 'cover',
  },
  uploadedPhotoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePhotoIcon: {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }], // assuming icon is 24x24
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: '#000',
  },
  borderIcon: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 23,
    padding: 2,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    marginVertical: 40,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    maxWidth: 600,
    paddingTop: 58,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalImageWrapper: {
    width: '100%',
    height: 78,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default CreateCouponScreen;

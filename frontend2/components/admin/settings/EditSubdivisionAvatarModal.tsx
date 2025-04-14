import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';
import CustomModal from '../CustomModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAvatarChange: (uri: string, applyToAll: boolean) => void;
  initialUri?: string;
}

const EditSubdivisionAvatarModal: React.FC<Props> = ({
  visible,
  onClose,
  onAvatarChange,
  initialUri,
}) => {
  const [selectedUri, setSelectedUri] = useState('');
  const [editing, setEditing] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [showApplyMenu, setShowApplyMenu] = useState(false);
  const imageRef = useRef<View>(null);
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.9, 380);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (initialUri) {
      setSelectedUri(initialUri);
      setEditing(false);
    }
  }, [initialUri]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (!editing) return;
        const zoomFactor = event.ctrlKey ? 0.4 : 0.01;
        scale.value = withTiming(Math.max(1, scale.value - event.deltaY * zoomFactor));
      };
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, [editing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: editing
      ? [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ]
      : [],
  }));

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Нет доступа к фото', 'Разреши доступ к галерее.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setSelectedUri(uri);
      setEditing(true);
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  const handlePanGesture = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
    translateY.value = event.nativeEvent.translationY;
  };

  const handlePinchGesture = (event: any) => {
    const s = event.nativeEvent.scale;
    if (event.nativeEvent.state === 5) {
      scale.value = Math.max(1, scale.value);
    } else {
      const newScale = scale.value * s;
      scale.value += (Math.max(1, newScale) - scale.value) * 0.1;
    }
  };

  const handleFinalConfirm = async () => {
    if (!selectedUri) {
      Alert.alert('Выберите изображение');
      return;
    }

    try {
      if (imageRef.current) {
        const base64 = await captureRef(imageRef, {
          format: 'png',
          quality: 1,
          result: 'base64',
        });
        onAvatarChange(`data:image/png;base64,${base64}`, applyToAll);
      } else {
        onAvatarChange(selectedUri, applyToAll);
      }
    } catch (error) {
      console.error('Ошибка сохранения изображения:', error);
    }

    onClose();
    setEditing(false);
    setShowApplyMenu(false);
  };

  const handleSavePress = () => {
    if (!selectedUri) {
      Alert.alert('Выберите изображение');
      return;
    }
    setShowApplyMenu(true);
  };

  const handleReset = () => {
    setSelectedUri('');
    setEditing(false);
    setApplyToAll(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View>
              <View style={styles.topBar}>
                <IconBack fill="#000" onPress={onClose} />
                <TouchableOpacity onPress={handleReset}>
                  <CloseIcon fill="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>Аватар</Text>
              <Text style={styles.subtitle}>Установите аватар для страницы подразделения</Text>

              <TouchableOpacity onPress={handlePickImage}>
                {selectedUri ? (
                  editing ? (
                    <PanGestureHandler onGestureEvent={handlePanGesture}>
                      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
                        <Animated.View
                          ref={imageRef}
                          collapsable={false}
                          style={{
                            width: imageSize,
                            height: imageSize,
                            borderRadius: imageSize / 2,
                            overflow: 'hidden',
                            alignSelf: 'center',
                            backgroundColor: '#eee',
                          }}
                        >
                          <Animated.Image
                            source={{ uri: selectedUri }}
                            style={[{ width: '100%', height: '100%' }, animatedStyle]}
                            resizeMode="cover"
                          />
                        </Animated.View>
                      </PinchGestureHandler>
                    </PanGestureHandler>
                  ) : (
                    <View
                      ref={imageRef}
                      style={{
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageSize / 2,
                        overflow: 'hidden',
                        alignSelf: 'center',
                        backgroundColor: '#eee',
                      }}
                    >
                      <Image
                        source={{ uri: selectedUri }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </View>
                  )
                ) : (
                  <View
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: imageSize / 2,
                      overflow: 'hidden',
                      alignSelf: 'center',
                      backgroundColor: '#eee',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#888' }}>Загрузить фото</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {!showApplyMenu ? (
              <TouchableOpacity style={styles.doneButton} onPress={handleSavePress}>
                <Text style={styles.doneButtonText}>Сохранить</Text>
              </TouchableOpacity>
            ) : (
              <CustomModal
                visible={true}
                onClose={() => setShowApplyMenu(false)}
                title="Новое изображение"
                buttons={[
                  {
                    label: 'Готово',
                    action: handleFinalConfirm,
                    type: 'full',
                  },
                ]}
                selectOptions={[
                  { label: 'Только для этого подразделения', value: 'single' },
                  { label: 'Для всех подразделений города', value: 'all' },
                ]}
                selectedOption={applyToAll ? 'all' : 'single'}
                onSelectOption={(val) => setApplyToAll(val === 'all')}
                optionTextStyle={{ fontSize: 12, fontWeight: '800' }} 
              />
            )}
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default EditSubdivisionAvatarModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
    paddingTop: 58,
    paddingBottom: 40,
    padding: 16,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8B8B8B',
    paddingTop: 12,
    paddingBottom: 36,
  },
  doneButton: {
    marginTop: 24,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
  },
  doneButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

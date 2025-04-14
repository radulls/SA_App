import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import IconBack from '@/components/svgConvertedIcons/iconBack';

const FIXED_WIDTH = 332;
const FIXED_HEIGHT = 414;
const SIDE_PADDING = 41;

interface Props {
  photoUri: string;
  onClose: () => void;
  onSave: (base64: string) => void;
}

const EditPhotoModal: React.FC<Props> = ({ photoUri, onClose, onSave }) => {
  const imageRef = useRef<View>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const zoomFactor = event.ctrlKey ? 0.4 : 0.01;
        const nextScale = Math.max(1, Math.min(5, scale.value - event.deltaY * zoomFactor));
        scale.value = withTiming(nextScale);
      };
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, []);

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
    const scaleFactor = event.nativeEvent.scale;
    const nextScale = Math.max(1, Math.min(5, scale.value * scaleFactor));
    scale.value = withTiming(nextScale);
  };

  const handleDone = async () => {
    try {
      const base64 = await captureRef(imageRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      onSave(`data:image/png;base64,${base64}`);
    } catch (error) {
      console.error('Ошибка при обрезке:', error);
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <IconBack fill="#000" onPress={onClose}/>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.doneText}>Готово</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageWrapper}>
          <View
            ref={imageRef}
            style={[styles.imageContainer, { maxWidth: FIXED_WIDTH, maxHeight: FIXED_HEIGHT }]}
          >
            <PanGestureHandler onGestureEvent={handlePanGesture}>
              <PinchGestureHandler onGestureEvent={handlePinchGesture}>
                <Animated.Image
                  source={{ uri: photoUri }}
                  style={[styles.image, animatedStyle]}
                  resizeMode="cover"
                />
              </PinchGestureHandler>
            </PanGestureHandler>
          </View>
        </View>
      </View>   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  contentContainer:{
    flex: 1, 
    maxWidth: 600,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 58,
  }, 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  imageWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#D2D2D2',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default EditPhotoModal;

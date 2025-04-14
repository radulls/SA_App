import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  LayoutChangeEvent,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import CropVideoIcon from '../svgConvertedIcons/cropVideoIcon';
import CropFrameOverlay from './CropFrameOverlay';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 60;
const THUMB_SIZE = 24;

interface Props {
  videoUri: string;
  onClose: () => void;
  onSave: (newUri: string) => void;
}

type ThumbType = 'left' | 'middle' | 'right' | null;

const EditVideoModal: React.FC<Props> = ({ videoUri, onClose, onSave }) => {
  const videoRef = useRef<Video>(null);
  const videoWrapperRef = useRef<View>(null);

  const [duration, setDuration] = useState<number | null>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [previewTime, setPreviewTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [webVideoSrc, setWebVideoSrc] = useState<string | null>(null);
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  const [activeThumb, setActiveThumb] = useState<ThumbType>(null);
  const [isCroppingDimensions, setIsCroppingDimensions] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 });
  const [trimmedVideoUri, setTrimmedVideoUri] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(3 / 4); // по умолчанию


  const [start, end] = range;
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const [sliderLeft, setSliderLeft] = useState(0);

  const leftThumbPos = 4 + (start / (duration || 1)) * (sliderWidth - 16);
  const middleThumbPos = 16 + (previewTime / (duration || 1)) * (sliderWidth - 16);
  const rightThumbPos = (end / (duration || 1)) * sliderWidth;

  const [thumbPositions, setThumbPositions] = useState({
    left: leftThumbPos,
    right: rightThumbPos,
    middle: middleThumbPos,
  });  

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (videoUri.startsWith('data:video')) {
        try {
          const base64Data = videoUri.split(',')[1];
          const mimeType = videoUri.substring(videoUri.indexOf(':') + 1, videoUri.indexOf(';'));
  
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
  
          for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
              byteNumbers[j] = slice.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
  
          const blob = new Blob(byteArrays, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setWebVideoSrc(url);
        } catch (e) {
          console.error('❌ Ошибка парсинга base64 video:', e);
        }
      } else {
        setWebVideoSrc(videoUri);
      }
    }
  }, [videoUri]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await videoRef.current?.getStatusAsync();
      if (status?.isLoaded) {
        const position = status.positionMillis / 1000;
  
        // Если видео вышло за пределы обрезки — перематываем в начало диапазона
        if (position > end) {
          await videoRef.current?.setPositionAsync(start * 1000);
          setPreviewTime(start);
        } else {
          setPreviewTime(position);
        }
  
        // Установка начального состояния
        if (duration === null && status.durationMillis) {
          const dur = status.durationMillis / 1000;
          setDuration(dur);
          setRange([0, dur]);
        }
      }
    }, 300);
  
    return () => clearInterval(interval);
  }, [duration, start, end]);

  useEffect(() => {
    if (Platform.OS === 'web' && htmlVideoRef.current) {
      const video = htmlVideoRef.current;
  
      const handleLoadedMetadata = () => {
        const dur = video.duration;
        setDuration(dur);
        setRange([0, dur]);
      };
  
      const handleTimeUpdate = () => {
        const position = video.currentTime;
        if (position > end) {
          video.currentTime = start;
          setPreviewTime(start);
        } else {
          setPreviewTime(position);
        }
      };
  
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
  
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [webVideoSrc, start, end]);  
  
  const handleCropButtonPress = async () => {
    setIsTrimming(true);
    const { processVideo } = await import('@/utils/processVideo');
    console.log('🔁 Импорт processVideo:', processVideo);
    const trimmedUri = await processVideo({ uri: videoUri, start, end });    
    if (trimmedUri) {
      setTrimmedVideoUri(trimmedUri);
      setIsCroppingDimensions(true);
    } else {
      alert('Не удалось подготовить видео для обрезки.');
    }
    setIsTrimming(false);
  };
  
  const handleTrim = async () => {
    setIsTrimming(true);
    console.log('📦 Вызов handleTrim');
  
    const { processVideo } = await import('@/utils/processVideo/');
    console.log('🔁 Импорт processVideo:', processVideo);
  
    const trimmedUri = await processVideo({ uri: videoUri, start, end });
    console.log('🎬 Результат processVideo:', trimmedUri);
  
    setIsTrimming(false);
  
    if (trimmedUri) onSave(trimmedUri);
    else alert('Не удалось обрезать видео.');
  };  
  
  const handleCropDimensions = async () => {
    try {
      setIsTrimming(true);
      const uriToCrop = trimmedVideoUri || videoUri;
      const { width: videoWidth, height: videoHeight } = await VideoThumbnails.getThumbnailAsync(uriToCrop, { time: 1000 });
      setVideoAspectRatio(videoWidth / videoHeight);
  
      const scaleX = videoWidth / containerSize.width;
      const scaleY = videoHeight / containerSize.height;
      const cropX = Math.round(cropRect.x * scaleX);
      const cropY = Math.round(cropRect.y * scaleY);
      const cropW = Math.round(cropRect.width * scaleX);
      const cropH = Math.round(cropRect.height * scaleY);
      
      const { processVideo } = await import('@/utils/processVideo');
      console.log('🔁 Импорт processVideo:', processVideo);
      const croppedUri = await processVideo({
        uri: uriToCrop,
        start,
        end,
        crop: { x: cropX, y: cropY, width: cropW, height: cropH },
      });
  
      if (croppedUri) onSave(croppedUri);
      else alert('Не удалось обрезать видео. Попробуй снова.');
    } catch (err) {
      console.error('Crop error:', err);
      alert('Произошла ошибка при обрезке видео.');
    } finally {
      setIsTrimming(false);
    }
  };  

  const handleSeek = async (value: number) => {
    const newTime = Math.max(start, Math.min(end, value));
    setPreviewTime(newTime);
  
    if (Platform.OS === 'web' && htmlVideoRef.current) {
      htmlVideoRef.current.currentTime = newTime;
    } else {
      await videoRef.current?.setPositionAsync(newTime * 1000);
    }
  };  

  const togglePlayPause = async () => {
    if (Platform.OS === 'web' && htmlVideoRef.current) {
      const video = htmlVideoRef.current;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setIsPlaying(!video.paused);
    } else {
      if (isPlaying) await videoRef.current?.pauseAsync();
      else await videoRef.current?.playAsync();
      setIsPlaying(!isPlaying);
    }
  };  

  const handleSliderLayout = (event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    setSliderWidth(width);
    setSliderLeft(x);
  };

  const handleMove = (gesture: any) => {
    
    if (!activeThumb || duration === null) return;
  
    const pageX = gesture.nativeEvent?.pageX ?? gesture.moveX ?? 0;
    const relativeX = pageX - sliderLeft;
    const clampedX = Math.max(0, Math.min(sliderWidth, relativeX));
    const newValue = (clampedX / sliderWidth) * duration;
    console.log('moveX:', pageX, 'sliderLeft:', sliderLeft, 'newValue:', newValue.toFixed(2));
 

    if (activeThumb === 'left') {
      const clampedValue = Math.min(newValue, end - 0.1);
      const final = Math.max(0, clampedValue);
      setRange([final, end]);
      if (previewTime < final) handleSeek(final);
    } else if (activeThumb === 'right') {
      const clampedValue = Math.max(newValue, start + 0.1);
      const final = Math.min(duration, clampedValue);
      setRange([start, final]);
      if (previewTime > final) handleSeek(final);
    } else if (activeThumb === 'middle') {
      handleSeek(newValue);
    }
  };  

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      const touchX = gestureState.x0 - sliderLeft;
      if (Math.abs(touchX - leftThumbPos) < THUMB_SIZE) setActiveThumb('left');
      else if (Math.abs(touchX - rightThumbPos) < THUMB_SIZE) setActiveThumb('right');
      else if (Math.abs(touchX - middleThumbPos) < THUMB_SIZE) setActiveThumb('middle');
    },
    onPanResponderMove: (_, gestureState) => handleMove(gestureState),
    onPanResponderRelease: () => setActiveThumb(null),
  });

  const handleMouseDragStart = (e: React.MouseEvent, thumb: ThumbType) => {
    e.preventDefault();
    setActiveThumb(thumb);
  
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateThumbPosition(thumb, moveEvent.clientX); // 👈 прямо вызываем обновление позиции
    };
  
    const handleMouseUp = () => {
      setActiveThumb(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }; 

  const updateThumbPosition = (thumb: ThumbType, pageX: number) => {
    const relativeX = pageX - sliderLeft;
    const clampedX = Math.max(0, Math.min(sliderWidth, relativeX));
    const newValue = (clampedX / sliderWidth) * (duration || 1);
  
    if (thumb === 'left') {
      const maxAllowedLeft = (end - 0.1) / (duration || 1) * sliderWidth;
      const finalX = Math.min(clampedX, maxAllowedLeft);
      const final = Math.min(newValue, end - 0.1);
      setRange([final, end]);
  
      const middleX = thumbPositions.middle;
      const updatedMiddle = Math.max(finalX, middleX); // не выходить за left
  
      setThumbPositions((prev) => ({
        ...prev,
        left: finalX,
        middle: updatedMiddle,
      }));
      // handleSeek(updatedTime); // ❌ убираем
    } else if (thumb === 'right') {
      const minAllowedRight = (start + 0.1) / (duration || 1) * sliderWidth;
      const finalX = Math.max(clampedX, minAllowedRight);
      const final = Math.max(newValue, start + 0.1);
      setRange([start, final]);
  
      const middleX = thumbPositions.middle;
      const updatedMiddle = Math.min(finalX, middleX); // не выходить за right
  
      setThumbPositions((prev) => ({
        ...prev,
        right: finalX,
        middle: updatedMiddle,
      }));
      // handleSeek(updatedTime); // ❌ убираем
    } else if (thumb === 'middle') {
      const safeValue = Math.max(start, Math.min(end, newValue));
      const safePos = Math.max(thumbPositions.left, Math.min(thumbPositions.right, clampedX));
      handleSeek(safeValue);
      setThumbPositions((prev) => ({ ...prev, middle: safePos }));
    }
  };

  useEffect(() => {
    if (activeThumb !== 'left' && activeThumb !== 'right') {
      setThumbPositions((prev) => ({
        ...prev,
        middle: 16 + (previewTime / (duration || 1)) * (sliderWidth - 16),
      }));
    }
  
    setThumbPositions((prev) => ({
      ...prev,
      left: 4 + (start / (duration || 1)) * (sliderWidth - 16),
      right: (end / (duration || 1)) * sliderWidth,
    }));
  }, [start, end, previewTime, duration, sliderWidth]);  
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.done}>Отмена</Text></TouchableOpacity>
          {!isCroppingDimensions && <Text style={styles.title}>Обрезка</Text>}
          <TouchableOpacity
            onPress={isCroppingDimensions ? handleCropDimensions : handleTrim}
            disabled={!isCroppingDimensions && (isTrimming || duration === null)}
          >
            <Text style={styles.done}>Готово</Text>
          </TouchableOpacity>
        </View>

        {isCroppingDimensions ? (
          <View style={styles.videoOuterWrapper}>
            <View
              ref={videoWrapperRef}
              style={{ width: '100%', aspectRatio: videoAspectRatio }}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setContainerSize({ width, height });
                setCropRect({ x: 0, y: 0, width, height });
              }}
            >
              {Platform.OS === 'web' ? (
                <video
                 
                  src={webVideoSrc ?? trimmedVideoUri ?? videoUri}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <Video
                  ref={videoRef}
                  source={{ uri: trimmedVideoUri || videoUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isMuted
                  isLooping
                />
              )}
              <CropFrameOverlay
                cropRect={cropRect}
                setCropRect={setCropRect}
                containerSize={containerSize}
              />
            </View>
          </View>
        ) : (
          <>
          <TouchableOpacity style={styles.videoWrapper} onPress={togglePlayPause}>
            {Platform.OS === 'web' ? (
              <video
                ref={htmlVideoRef}
                src={webVideoSrc ?? trimmedVideoUri ?? videoUri}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                muted
                playsInline
                autoPlay
                loop
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isMuted
                isLooping
              />
            )}
          </TouchableOpacity>
        
          {duration && (
            <View style={styles.sliderWrapper}>
              {Platform.OS === 'web' ? (
              <div
                style={{
                  position: 'relative',
                  height: 40,
                  width: '100%',
                  border: '4px solid black',
                  borderRadius: 12,
                  userSelect: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                ref={(ref) => {
                  if (ref) {
                    const rect = ref.getBoundingClientRect();
                    setSliderLeft(rect.left);
                    setSliderWidth(rect.width);
                  }
                }}
              >
                {(['left', 'middle', 'right'] as const).map((thumb) => (
                  <div
                    key={thumb}
                    onMouseDown={(e) => handleMouseDragStart(e, thumb)}
                    style={{
                      position: 'absolute',
                      left: thumbPositions[thumb] - THUMB_SIZE / 2,
                      top: thumb === 'middle' ? -12 : 4,
                      width: thumb === 'middle' ? 4 : 4,
                      height: thumb === 'middle' ? 64 : 24,
                      backgroundColor: thumb === 'middle' ? '#000' : '#fff',
                      cursor: thumb === 'middle' ? 'pointer' : 'ew-resize',
                      zIndex: thumb === 'middle' ? 5 : 3,
                      border: thumb === 'middle' ? undefined : '4px solid black',
                      borderRadius: 8,
                    }}                    
                  />
                ))}
              </div>
             
              ) : (
                <View
                  ref={sliderRef}
                  onLayout={handleSliderLayout}
                  style={styles.sliderContainer}
                  {...panResponder.panHandlers}
                >
                  <View style={[styles.thumb, styles.leftThumb, { left: leftThumbPos - THUMB_SIZE / 2 }]} />
                  <View style={[styles.thumb, styles.middleThumb, { left: middleThumbPos - THUMB_SIZE / 2 }]} />
                  <View style={[styles.thumb, styles.rightThumb, { left: rightThumbPos - THUMB_SIZE / 2 }]} />
                </View>
              )}
            </View>
          )}
           <TouchableOpacity style={styles.cropIcon} onPress={handleCropButtonPress}>
            <CropVideoIcon />
          </TouchableOpacity>

        </>
        
        )}
        {isTrimming && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  }, 
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 44,
  },
  done: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#000' 
  },
  title: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#000' 
  },
  videoOuterWrapper: {
    paddingHorizontal: 41,
    width: '100%',
  }, 
  videoWrapper: { 
    width: '100%', 
    aspectRatio: 3 / 4, 
  },
  video: { 
    width: '100%', 
    height: '100%' 
  },
  sliderWrapper: { 
    marginTop: 20, 
    paddingHorizontal: 12 
  },
  sliderContainer: {
    height: 48,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    borderWidth: 4,
    borderRadius: 12,
    borderColor: '#000',
  },
  thumb: {
    width: 12,
    height: 32,
    borderRadius: 6,
    position: 'absolute',
    borderWidth: 3,
    backgroundColor: '#fff',
  },
  leftThumb: { 
    zIndex: 3 
  },
  middleThumb: { 
    width: 0, 
    height: 64, 
    borderWidth: 2, 
    zIndex: 2, 
    top: -12 
  },
  rightThumb: { 
    zIndex: 3 
  },
  cropIcon: { 
    marginTop: 28, 
    alignItems: 'center' 
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditVideoModal;

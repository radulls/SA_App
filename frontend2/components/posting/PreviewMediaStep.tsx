import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import EditPhotoModal from './EditPhotoModal';
import EditVideoModal from './EditVideoModal';

const FIXED_WIDTH = 332;
const FIXED_HEIGHT = 414;
const MAX_WIDTH = 600;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = 282;

interface Props {
  media: { photos: string[]; videos: string[] };
  setMedia: (media: { photos: string[]; videos: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

const VideoPlayer = ({
  uri,
  style,
  onPress,
}: {
  uri: string;
  style: any;
  onPress?: () => void;
}) => {
  const [error, setError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (uri.startsWith('data:video')) {
        try {
          const base64Data = uri.split(',')[1];
          const mimeType = uri.substring(uri.indexOf(':') + 1, uri.indexOf(';'));

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
          setVideoSrc(url);
        } catch (e) {
          console.error('❌ Ошибка парсинга base64 video:', e);
          setError(true);
        }
      } else {
        setVideoSrc(uri);
      }
    }
  }, [uri]);

  if (error) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }]}>
        <Text style={{ color: 'red' }}>Не удалось загрузить видео</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return videoSrc ? (
      <TouchableOpacity onPress={onPress} style={style}>
        <video
          src={videoSrc}
          muted
          playsInline
          controls={false}
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onLoadedData={(e) => {
            try {
              (e.currentTarget as HTMLVideoElement).currentTime = 0.1;
              (e.currentTarget as HTMLVideoElement).pause();
            } catch (err) {
              console.warn('⚠️ Ошибка паузы видео:', err);
            }
          }}
        />
      </TouchableOpacity>
    ) : (
      <View style={style}>
        <Text>Загрузка видео...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Video
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
        useNativeControls={false}
        onError={() => setError(true)}
      />
    </TouchableOpacity>
  );
};

const PreviewMediaStep: React.FC<Props> = ({ media, setMedia, onNext, onBack }) => {
  const totalItems = media.photos.length + media.videos.length;
  const isSingleItem = totalItems === 1;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isVideoEditorVisible, setIsVideoEditorVisible] = useState(false);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  
  const mediaList = [
    ...media.photos.map((uri, index) => ({ type: 'photo' as const, uri, index })),
    ...media.videos.map((uri, index) => ({ type: 'video' as const, uri, index })),
  ];

  const handlePhotoPress = (index: number) => {
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const handleVideoPress = (index: number) => {
    setEditingVideoIndex(index);
    setIsVideoEditorVisible(true);
  };

  const handleSaveCroppedPhoto = (newUri: string) => {
    if (editingIndex === null) return;
    const updatedPhotos = [...media.photos];
    updatedPhotos[editingIndex] = newUri;
    setMedia({ ...media, photos: updatedPhotos });
    setEditingIndex(null);
    setIsEditorVisible(false);
  };

  const handleSaveTrimmedVideo = (newUri: string) => {
    if (editingVideoIndex === null) return;
    const updatedVideos = [...media.videos];
    updatedVideos[editingVideoIndex] = newUri;
    setMedia({ ...media, videos: updatedVideos });
    setEditingVideoIndex(null);
    setIsVideoEditorVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <IconBack fill="#000" onPress={onBack}/>
          <TouchableOpacity onPress={onNext}>
            <Text style={styles.headerText}>Далее</Text>
          </TouchableOpacity>
        </View>
        {/* Один элемент */}
        {isSingleItem && (
          <TouchableOpacity
            onPress={() => {
              mediaList[0].type === 'photo' 
                ? handlePhotoPress(0) 
                : handleVideoPress(0);
            }}          
            activeOpacity={0.9}
            style={styles.singleWrapper}
          >
            {mediaList[0].type === 'photo' ? (
              <TouchableOpacity
                onPress={() => handlePhotoPress(0)}
                activeOpacity={0.9}
                style={styles.singleWrapper}
              >
                <Image source={{ uri: mediaList[0].uri }} style={styles.singleImage} />
              </TouchableOpacity>
            ) : (
              <VideoPlayer
                uri={mediaList[0].uri}
                style={styles.singleWrapper}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    handleVideoPress(0);
                  }
                }}
              />
            )}
          </TouchableOpacity>
        )}

        {/* Несколько элементов */}
        {!isSingleItem && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
            decelerationRate="fast"
            style={{ width: '100%' }}
          >
            {mediaList.map((item, idx) => (
              <TouchableOpacity
                key={`${item.type}-${idx}`}
                style={[
                  styles.carouselItem,
                  {
                    marginLeft: idx === 0 ? 16 : ITEM_MARGIN,
                    marginRight: idx === mediaList.length - 1 ? 16 : ITEM_MARGIN,
                  },
                ]}
                activeOpacity={item.type === 'photo' ? 0.9 : 1}
                onPress={() => {
                  item.type === 'photo' 
                    ? handlePhotoPress(idx)
                    : handleVideoPress(idx - media.photos.length);
                }}                  
              >
                {item.type === 'photo' ? (
                  <Image source={{ uri: item.uri }} style={styles.media} />
                ) : (
                  <VideoPlayer
                  uri={item.uri}
                  style={styles.media}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      handleVideoPress(idx - media.photos.length);
                    }
                  }}
                />                
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Модалки для редактирования */}
        <Modal visible={isEditorVisible} animationType="slide">
          {editingIndex !== null && (
            <EditPhotoModal
              photoUri={media.photos[editingIndex]}
              onClose={() => setIsEditorVisible(false)}
              onSave={handleSaveCroppedPhoto}
            />
          )}
        </Modal>
        
        <Modal visible={isVideoEditorVisible} animationType="slide">
          {editingVideoIndex !== null && (
            <EditVideoModal
              videoUri={media.videos[editingVideoIndex]}
              onClose={() => setIsVideoEditorVisible(false)}
              onSave={handleSaveTrimmedVideo}
            />
          )}
        </Modal>
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
  contentContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
  },
  header: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  singleWrapper: {
    width: '100%',
    paddingHorizontal: 41,
    aspectRatio: 3 / 4,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
  },  
  singleImage: {
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoWeb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoError: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  errorText: {
    color: 'red',
  },
});

export default PreviewMediaStep;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import CheckMarkIcon from '../svgConvertedIcons/checkMarkIcon';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  media: { photos: string[]; videos: string[] };
  setMedia: (media: { photos: string[]; videos: string[] }) => void;
  onNext: () => void;
}

interface MediaAsset extends MediaLibrary.Asset {
  cleanUri: string;
}

const SelectMediaStep: React.FC<Props> = ({ media, setMedia, onNext }) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<MediaLibrary.Album | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlbumsDropdown, setShowAlbumsDropdown] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaAsset | null>(null);
  
  const albumSelectorRef = useRef<any>(null);

  const cleanUri = (uri: string): string => {
    return uri.split('#')[0].split('?')[0];
  };
  
  const fetchAlbumAssets = async (album: MediaLibrary.Album) => {
    try {
      setLoading(true);
      setError(null);
  
      const result = album.id === 'recent'
        ? await MediaLibrary.getAssetsAsync({
            mediaType: ['photo', 'video'],
            first: 100,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          })
        : await MediaLibrary.getAssetsAsync({
            mediaType: ['photo', 'video'],
            first: 100,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            album: album,
          });
  
      const assetsWithCleanUri: MediaAsset[] = [];
  
      for (const asset of result.assets) {
        try {
          const info = await MediaLibrary.getAssetInfoAsync(asset);
          let finalUri = info.localUri || asset.uri;
  
          // Для видео на iOS используем copyAsync, если URI начинается с 'ph://'
          if (asset.mediaType === 'video' && Platform.OS === 'ios') {
            const info = await MediaLibrary.getAssetInfoAsync(asset);
            let localUri = info.localUri;
          
            if (!localUri || localUri.startsWith('ph://')) {
              console.warn('⚠️ Невалидный localUri:', localUri);
              continue;
            }
          
            // Создаём безопасный путь для копирования
            const filename = asset.filename?.replace(/\s+/g, '_') || `video_${Date.now()}.mp4`;
            const destPath = FileSystem.cacheDirectory + filename;
          
            try {
              await FileSystem.copyAsync({
                from: localUri,
                to: destPath,
              });
          
              console.log('✅ Скопировано в:', destPath);
          
              assetsWithCleanUri.push({
                ...asset,
                cleanUri: cleanUri(destPath),
              });
            } catch (copyError) {
              console.warn('❌ Ошибка копирования:', copyError);
              continue;
            }
          
            continue; // не добавлять повторно ниже
          }
          
          const cleaned = cleanUri(finalUri);
          assetsWithCleanUri.push({
            ...asset,
            cleanUri: cleaned,
          });
        } catch (e) {
          console.warn('Ошибка обработки файла:', asset.uri, e);
        }
      }
  
      setCurrentAlbum(album);
      setAssets(assetsWithCleanUri);
    } catch (error) {
      console.error('Ошибка при загрузке медиа:', error);
      setError('Не удалось загрузить медиафайлы');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Нет доступа к медиа');
        return;
      }

      const allAlbums = await MediaLibrary.getAlbumsAsync();
      const recentAlbum = { id: 'recent', title: 'Недавние' } as MediaLibrary.Album;
      setAlbums([recentAlbum, ...allAlbums]);
      await fetchAlbumAssets(recentAlbum);
    } catch (error) {
      console.error('🔥 Ошибка при загрузке медиа:', error);
      setError('Не удалось загрузить медиафайлы');
    }
  };

  const pickFromLibraryWeb = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
        base64: true, // опционально, но может помочь
      });
  
      if (!result.canceled && result.assets) {
        console.log('🎞 Выбранные ассеты:', result.assets);
  
        const photos: string[] = [];
        const videos: string[] = [];
  
        for (const asset of result.assets) {
          if (asset.uri.startsWith('data:video') || asset.uri.endsWith('.mov') || asset.type === 'video') {
            videos.push(asset.uri);
          } else if (asset.uri.startsWith('data:image') || asset.type === 'image') {
            photos.push(asset.uri);
          }
        }
  
        setMedia({ photos, videos });
        console.log('🧠 Сохраняем media:', { photos, videos });
        onNext();
      }
    } catch (error) {
      console.error('Ошибка при выборе файлов:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файлы');
    }
  };
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      pickFromLibraryWeb();
    } else {
      fetchAssets();
    }
  }, []);

  const toggleSelect = (uri: string) => {
    setSelected((prev) =>
      prev.includes(uri) ? prev.filter((u) => u !== uri) : [...prev, uri]
    );
  };

  const handleNext = async () => {
    const photos = selected.filter((uri) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(uri)
    );
  
    const rawVideos = selected.filter((uri) =>
      /\.(mp4|mov|avi|mkv)$/i.test(uri)
    );
  
    const convertedVideos: string[] = [];
  
    for (const uri of rawVideos) {
      if (uri.toLowerCase().endsWith('.mov')) {
        try {
          console.log('⚙️ Конвертация .mov → .mp4:', uri);
          const { convertMovToMp4 } = await import('@/utils/convertMovToMp4');
          const converted = await convertMovToMp4(uri);
          convertedVideos.push(converted);
        } catch (e) {
          console.error('❌ Ошибка конвертации видео:', e);
          Alert.alert('Ошибка видео', 'Не удалось конвертировать .mov файл');
        }
      } else {
        convertedVideos.push(uri);
      }
    }
  
    setMedia({ photos, videos: convertedVideos });
    onNext();
  };

  const openAlbumsDropdown = () => {
    setShowAlbumsDropdown(true);
  };

  const renderMediaItem = ({ item }: { item: MediaAsset }) => {
    const isSelected = selected.includes(item.cleanUri);
    
    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => toggleSelect(item.cleanUri)}>
       {item.mediaType === 'video' ? (
        <Video
        source={{ uri: item.cleanUri }}
        style={styles.videoThumbnail}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        useNativeControls={false}
        isLooping={false}
        onError={(e: any) => {
          console.warn('❌ Thumbnail Video Error:', e?.nativeEvent?.error);
          Alert.alert('Ошибка превью', JSON.stringify(e?.nativeEvent?.error || e));
        }}
        onPlaybackStatusUpdate={(status) => {
          if (!status.isLoaded) {
            console.warn('❗ Видео не загрузилось:', status);
          } else {
            console.log('✅ Превью видео загружено успешно');
          }
        }}
      />
      
      ) : (
        <Image
          source={{ uri: item.cleanUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
        
        <View 
          style={[styles.selectionCircle, isSelected && styles.selectionCircleSelected]}
          
        >
          {isSelected && <CheckMarkIcon width={10}/>}
        </View>
        
        {item.mediaType === 'video' && (
          <View style={styles.videoIconContainer}>
            <Ionicons name="play" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedPreview = () => {
    if (selected.length === 0) return null;

    const firstSelectedUri = selected[0];
    const firstSelectedAsset = assets.find(asset => asset.cleanUri === firstSelectedUri);

    if (!firstSelectedAsset) return null;

    return (
      <View style={styles.selectedPreviewContainer}>
        {firstSelectedAsset.mediaType === 'video' ? (
         <Video
         source={{ uri: firstSelectedAsset.cleanUri }}
         style={styles.selectedPreview}
         resizeMode={ResizeMode.COVER}
         shouldPlay={false}
         isMuted={true}
         onError={(e: any) => {
           console.warn('❌ Preview Video Error:', e?.nativeEvent?.error);
           Alert.alert('Ошибка предпросмотра', JSON.stringify(e?.nativeEvent?.error || e));
         }}
         onPlaybackStatusUpdate={(status) => {
           if (!status.isLoaded) {
             console.warn('❗ Видео (предпросмотр) не загружено:', status);
           } else {
             console.log('✅ Предпросмотр видео загружен успешно');
           }
         }}
       />       
        ) : (
          <Image
            source={{ uri: firstSelectedAsset.cleanUri }}
            style={styles.selectedPreview}
            resizeMode="cover"
          />
        )}
        {selected.length > 1 && (
          <View style={styles.moreItemsBadge}>
            <Text style={styles.moreItemsText}>+{selected.length - 1}</Text>
          </View>
        )}
      </View>
    );
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>Загрузка файлов через файловый менеджер...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Загрузка медиа...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchAssets}
        >
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Хэдер */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMedia({ photos: [], videos: [] })}>
            <Text style={styles.headerText}>Отмена</Text>
          </TouchableOpacity>

          <View style={styles.albumSelectorContainer}>
            <TouchableOpacity 
              onPress={openAlbumsDropdown}
              style={styles.albumSelector}
              ref={albumSelectorRef}
            >
              <Text style={styles.headerText}>{currentAlbum?.title || 'Альбом'}</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>
            
            {showAlbumsDropdown && (
              <Modal
                transparent={true}
                visible={showAlbumsDropdown}
                onRequestClose={() => setShowAlbumsDropdown(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowAlbumsDropdown(false)}>
                  <View style={styles.albumsModalOverlay}>
                    <View style={styles.albumsDropdown}>
                      <ScrollView style={styles.albumsDropdownScroll}>
                        {albums.map((album) => (
                          <TouchableOpacity
                            key={album.id}
                            style={styles.albumDropdownItem}
                            onPress={() => {
                              fetchAlbumAssets(album);
                              setShowAlbumsDropdown(false);
                            }}
                          >
                            <Text style={styles.albumDropdownItemText}>{album.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            disabled={selected.length === 0}
          >
            <Text
              style={[
                styles.headerText,
                { color: selected.length > 0 ? '#000' : '#ccc' },
              ]}
            >
              Далее
            </Text>
          </TouchableOpacity>
        </View>

        {/* Предпросмотр выбранных */}
        {renderSelectedPreview()}

        {/* Сетка медиа */}
        <FlatList
          data={assets}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderMediaItem}
          contentContainerStyle={styles.grid}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
          removeClippedSubviews={true}
        />

        {/* Модальное окно предпросмотра */}
        {previewItem && (
          <Modal
            visible={!!previewItem}
            transparent={false}
            animationType="fade"
            onRequestClose={() => setPreviewItem(null)}
          >
            <View style={styles.previewContainer}>
              {previewItem.mediaType === 'video' ? (
              <Video
              source={{ uri: previewItem.cleanUri }}
              style={styles.fullPreview}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              isLooping={true}
              useNativeControls={true}
              onError={(e: any) => {
                console.warn('❌ Fullscreen Video Error:', e?.nativeEvent?.error);
                Alert.alert('Ошибка видео', JSON.stringify(e?.nativeEvent?.error || e));
              }}
              onPlaybackStatusUpdate={(status) => {
                if (!status.isLoaded) {
                  console.warn('❗ Полноэкранное видео не загрузилось:', status);
                } else {
                  console.log('✅ Полноэкранное видео загружено');
                }
              }}
            />
              ) : (
                <Image
                  source={{ uri: previewItem.cleanUri }}
                  style={styles.fullPreview}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity
                style={styles.previewCloseButton}
                onPress={() => setPreviewItem(null)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer:{
    flex: 1, 
    maxWidth: 600,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    width: '100%',
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  albumSelectorContainer: {
    position: 'relative',
  },
  albumSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 120,
  },
  albumsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  albumsDropdown: {
    position: 'absolute',
    top: 98,
    left: '50%', 
    transform: [{ translateX: -100 }],
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
    minWidth: 200,
    width: 'auto',
  },
  albumsDropdownScroll: {
    maxHeight: 300,
  },
  albumDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  albumDropdownItemText: {
    fontSize: 16,
  },
  grid: {
    padding: 2,
  },
  mediaItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  selectionCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectionCircleSelected: {
    backgroundColor: 'black',
  },
  selectedPreviewContainer: {
    width: '100%',
    height: 414,
    paddingHorizontal: 41,
    backgroundColor: '#D8D8D8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedPreview: {
    width: '100%',
    height: '100%',
  },
  moreItemsBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPreview: {
    width: screenWidth,
    height: '80%',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default SelectMediaStep;
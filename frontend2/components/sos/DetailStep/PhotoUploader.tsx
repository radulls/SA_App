import React from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { SOS_IMAGE_URL } from '@/api/sos/sosApi';
import PlusIcon from '../../svgConvertedIcons/MapIcons/plusIcon';
import DeleteIcon from '../../svgConvertedIcons/MapIcons/deleteIcon';

interface PhotoUploaderProps {
  photos: string[];
  setPhotos: (photos: string[] | ((prevPhotos: string[]) => string[])) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, setPhotos }) => {
  
  // 📌 Открываем галерею и выбираем фото
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      let fileUri = result.assets[0].uri;
      console.log("📸 Выбрано изображение:", fileUri);
  
      if (Platform.OS === 'web') {
        setPhotos((prevPhotos) => [...prevPhotos, fileUri]);
      } else {
        try {
          const fileName = fileUri.split('/').pop();
          const newUri = `${FileSystem.cacheDirectory}${fileName}`;
  
          console.log("📂 Копируем в кэш:", newUri);
          await FileSystem.copyAsync({ from: fileUri, to: newUri });
  
          // Проверяем, существует ли файл
          const fileInfo = await FileSystem.getInfoAsync(newUri);
          if (fileInfo.exists) {
            console.log("✅ Файл существует:", newUri);
            setPhotos((prevPhotos) => [...prevPhotos, newUri]);
          } else {
            console.error("❌ Файл не найден после копирования:", newUri);
          }
        } catch (error) {
          console.error("❌ Ошибка копирования файла:", error);
        }
      }
    }
  };
  
  // 📌 Удаляем фото
  const removePhoto = (index: number) => {
    setPhotos((prevPhotos: string[]) => prevPhotos.filter((_, i: number) => i !== index));
  };

  return (
    <View style={styles.photoContainer}>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <View style={styles.plusButton}>
          <PlusIcon />
        </View>    
      </TouchableOpacity>
      <FlatList
        horizontal
        data={photos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          let imageUrl = decodeURIComponent(item); // Декодируем на всякий случай
        
          if (!imageUrl.startsWith('data:image') && !imageUrl.startsWith('http') && !imageUrl.startsWith('file://')) {
            imageUrl = `${SOS_IMAGE_URL}${item}`;
          }
        
          console.log("🖼️ Отображаем изображение:", imageUrl);
        
          return (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                onError={(e) => console.error("❌ Ошибка загрузки изображения:", imageUrl, e.nativeEvent)}
              />
              <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removePhoto}>
                <DeleteIcon />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 112,
    height: 112,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -11 }, { translateY: -11 }],
  },
  photoButton: {
    width: 112,
    height: 112,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    position: 'relative',
  },
  plusButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
});

export default PhotoUploader;

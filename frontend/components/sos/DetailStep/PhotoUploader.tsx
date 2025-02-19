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
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      if (Platform.OS === 'web') {
        setPhotos((prevPhotos) => [...prevPhotos, fileUri]);
      } else {
        const newUri = `${FileSystem.cacheDirectory}${fileUri.split('/').pop()}`;
        await FileSystem.copyAsync({ from: fileUri, to: newUri });
        setPhotos((prevPhotos) => [...prevPhotos, newUri]);
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
          let imageUrl = item;

          if (!item.startsWith('data:image') && !item.startsWith('http')) {
            imageUrl = `${SOS_IMAGE_URL}${item}`;
          }

          return (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
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

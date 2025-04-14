import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { FullEventData } from '@/types/event';
import DeletePhotoIcon from '../svgConvertedIcons/deletePhotoIcon';
import { EVENT_IMAGE_URL } from '@/api/eventApi';

interface Props {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onNext: () => void;
  onBack: () => void;
}

const EventMediaStep: React.FC<Props> = ({ eventData, setEventData }) => {
  const handlePickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setEventData((prev) => ({
        ...prev,
        cover: uri,
      }));
    }
  };

  const handlePickPhoto = async (replaceIndex?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setEventData((prev) => {
        const updated = [...prev.photos];
        if (replaceIndex !== undefined) {
          updated[replaceIndex] = uri;
        } else if (updated.length < 6) {
          updated.push(uri);
        }
        return { ...prev, photos: updated };
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCover = () => {
    setEventData((prev) => ({
      ...prev,
      cover: '',
    }));
  };

  return (
    <View style={styles.container}>
      {/* Обложка */}
      <TouchableOpacity
        style={styles.mainPhoto}
        onPress={handlePickCover}
        activeOpacity={0.8}
      >
        {eventData.cover ? (
          <>
            <Image source={{ uri: eventData.cover }} style={styles.mainPhotoImage} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={handleRemoveCover}
            >
              <DeletePhotoIcon />
            </TouchableOpacity>
          </>
        ) : (
          <Ionicons name="add" size={32} color="#bbb" />
        )}
      </TouchableOpacity>

      {/* Остальные фото (до 6) */}
      <View style={styles.rowWrap}>
        {[0, 1].map((row) => (
          <View key={row} style={styles.row}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              const uri = eventData.photos[index];
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.item}
                  onPress={() => handlePickPhoto(index)}
                >
                  {uri ? (
                    <>
                      <Image source={{ uri }} style={styles.itemImage} />
                      <TouchableOpacity
                        style={styles.removeIcon}
                        onPress={() => handleRemovePhoto(index)}
                      >
                        <DeletePhotoIcon />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Ionicons name="add" size={24} color="#bbb" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default EventMediaStep;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  mainPhoto: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  mainPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 2,
    elevation: 2,
  },  
  rowWrap: {
    width: '100%',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

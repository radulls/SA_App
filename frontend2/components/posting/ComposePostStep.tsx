import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import DeletePhotoIcon from '../svgConvertedIcons/deletePhotoIcon';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import CreatePostIcon from '../svgConvertedIcons/createPostIcon';

interface Props {
  media: { photos: string[]; videos: string[] };
  description: string;
  hashtags: string[];
  mentions: string[];
  setDescription: (val: string) => void;
  setHashtags: (val: string[]) => void;
  setMentions: (val: string[]) => void;
  removePhoto: (index: number) => void;
  removeVideo: (index: number) => void;
  onBack: () => void;
  onSubmit?: () => void;
}

const ComposePostStep: React.FC<Props> = ({
  media,
  description,
  setDescription,
  removePhoto,
  removeVideo,
  onBack,
  onSubmit,
  setMentions,
  setHashtags
}) => {

  const insertSymbol = (symbol: string) => {
    setDescription(description + symbol);
    if (symbol === '#' && getHashtagCount() >= 5) return;
  };  

  const getHashtagCount = () => {
    return description.split(' ').filter((word) => word.startsWith('#')).length;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBack fill="#000" onPress={onBack}/>  
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Новый пост</Text>
          <Text style={styles.subtitle}>Пост размещается на 24 часа.</Text>
        </View> 
        <TouchableOpacity onPress={onSubmit}>
          <CreatePostIcon/>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.previewContainer}>
          {media.photos.map((uri, idx) => (
            <View key={`photo-${idx}`} style={styles.mediaWrapper}>
              <Image source={{ uri }} style={styles.thumb} />
              <TouchableOpacity
                onPress={() => removePhoto(idx)}
                style={styles.deleteIcon}
              >
                <DeletePhotoIcon />
              </TouchableOpacity>
            </View>
          ))}
          {media.videos.map((uri, idx) => (
            <View key={`video-${idx}`} style={styles.mediaWrapper}>
              <Video
                source={{ uri }}
                style={styles.thumb}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping={false}
              />
              <TouchableOpacity
                onPress={() => removeVideo(idx)}
                style={styles.deleteIcon}
              >
                <DeletePhotoIcon />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.insertButtons}>
          <TouchableOpacity onPress={() => insertSymbol('#')} style={styles.insertButton}>
          <Text style={styles.insertText}># <Text style={styles.hashNumbers}>{getHashtagCount()}/5</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => insertSymbol('@')} style={styles.insertButton}>
            <Text style={styles.insertText}>@</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholderTextColor="#000"
          multiline
          placeholder="Чем вы хотите поделиться?..."
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  titleContainer:{
    gap: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#888' 
  },
  contentContainer:{
    padding: 16, 
    gap: 20,
    maxWidth: 600,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  mediaWrapper: {
    position: 'relative',
    width: 112,
    height: 112,
  },
  thumb: {
    width: 112,
    height: 112,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  deleteIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    zIndex: 10,
  },
  insertButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  insertButton: {
    backgroundColor: '#F3F3F4',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  insertText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hashNumbers:{
    fontSize: 10,
  },
  input: {
    minHeight: 100,
    borderTopWidth: 0.5,
    borderColor: '#ECECEC',
    paddingVertical: 21,
    textAlignVertical: 'top',
    color: '#000',
    fontWeight: '400',
    fontSize: 14,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
});

export default ComposePostStep;

import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

interface PostVideoProps {
  uri: string;
  preview?: string;
  onPress?: () => void;
}

const PostVideo: React.FC<PostVideoProps> = ({ uri, preview, onPress }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        setIsLoaded(true);
        video.currentTime = 0.1;
      };

      video.addEventListener('loadeddata', handleLoadedData);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [videoSrc]);

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

    if (Platform.OS === 'web') {
      return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
          <Image
            source={{ uri: preview || '' }}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        </TouchableOpacity>
      );
    }
  
    return (
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <Video
          source={{ uri }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isMuted
          useNativeControls={false}
          usePoster={!!preview}
          posterSource={preview ? { uri: preview } : undefined}
          style={styles.nativeVideo}
          onError={() => {}}
        />
      </TouchableOpacity>
    );
  };
  
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  nativeVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});

export default PostVideo;

import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PostVideoProps {
  uri: string;
  preview?: string;
  onPress?: () => void;
}

const PostVideo: React.FC<PostVideoProps> = ({ uri, preview, onPress }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      const video = videoRef.current;
  
      const handleLoadedData = () => {
        video.currentTime = 0.1;
      };
  
      const handleSeeked = () => {
        video.pause(); // только после того, как кадр обновился
      };
  
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('seeked', handleSeeked);
  
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('seeked', handleSeeked);
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
    if (error) {
      return (
        <View style={styles.wrapper}>
          <Text style={styles.error}>Не удалось загрузить видео</Text>
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
       <video
          ref={videoRef}
          src={videoSrc || ''}
          muted
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />


        {onPress && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onPress}
          />
        )}
      </View>
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
        onError={() => setError(true)}
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

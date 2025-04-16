// components/Posts/PostMediaView.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
  uri: string;
  preview?: string; // путь к превью (если видео)
  maxWidth?: number;
}

const PostMediaView: React.FC<Props> = ({ uri, preview, maxWidth = screenWidth }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  const isVideo = uri.endsWith('.mp4') || uri.startsWith('data:video');

  useEffect(() => {
    if (!isVideo) {
      Image.getSize(
        uri,
        (width, height) => {
          setAspectRatio(width / height);
          setLoading(false);
        },
        () => {
          setAspectRatio(1);
          setLoading(false);
        }
      );
    } else {
      setAspectRatio(3 / 4); // примерное соотношение, можно улучшить
      setLoading(false);
    }
  }, [uri]);

  const width = Math.min(maxWidth, screenWidth);
  const height = aspectRatio ? width / aspectRatio : screenHeight * 0.6;

  if (loading) {
    return (
      <View style={[styles.wrapper, { height }]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { width, height }]}>
      {isVideo ? (
        Platform.OS === 'web' ? (
          <video
            src={uri}
            poster={preview}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <Video
            ref={videoRef}
            source={{ uri }}
            resizeMode={ResizeMode.COVER}
            isMuted
            shouldPlay
            isLooping
            style={{ width: '100%', height: '100%' }}
            usePoster={!!preview}
            posterSource={preview ? { uri: preview } : undefined}
          />
        )
      ) : (
        <Image source={{ uri }} resizeMode="contain" style={{ width, height }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostMediaView;

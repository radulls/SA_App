import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Dimensions, ActivityIndicator, Platform } from 'react-native';

interface PostImageViewProps {
  uri: string;
  maxWidth?: number;
}

const PostImageView: React.FC<PostImageViewProps> = ({ uri, maxWidth = Dimensions.get('window').width }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const finalWidth = Math.min(maxWidth, screenWidth);

  useEffect(() => {
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
  }, [uri]);

  if (loading || !aspectRatio) {
    return (
      <View style={[styles.imageWrapper, { height: screenHeight * 0.6 }]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  // Вычисляем размер с ограничением по экрану
  let width = finalWidth;
  let height = width / aspectRatio;

  if (height > screenHeight) {
    height = screenHeight;
    width = height * aspectRatio;
  }

  return (
    <View style={[styles.imageWrapper, { width, height }]}>
      <Image source={{ uri }} resizeMode="contain" style={{ width, height }} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostImageView;

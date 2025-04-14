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

  const finalWidth = Platform.OS === 'web' ? Math.min(maxWidth, 600) : screenWidth;

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

  const isTall = aspectRatio < 0.8;
  const isWide = aspectRatio > 1.2;

  let imageStyle = {
    width: finalWidth,
    height: finalWidth,
  };

  if (isTall) {
    imageStyle = {
      width: finalWidth,
      height: screenHeight * 0.92,
    };
  } else if (isWide) {
    imageStyle = {
      width: finalWidth,
      height: finalWidth / aspectRatio,
    };
  }

  return (
    <View style={[styles.imageWrapper, { width: finalWidth, justifyContent: isWide ? 'center' : 'flex-start' }]}>
      <Image source={{ uri }} resizeMode="cover" style={imageStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: '#000',
    alignItems: 'center',
  },
});

export default PostImageView;

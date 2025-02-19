import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface PhotoCarouselProps {
  photos: string[];
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.photoCarouselContainer}>
      <View style={[styles.photoCarouselWrapper, { width: Math.min(screenWidth, 600) }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {photos.map((photo, index) => (
            <View key={index} style={[styles.photoWrapper, { width: Math.min(screenWidth, 600) }]}>
              <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>

        {/* Индикатор (точки) */}
        <View style={styles.indicatorContainer}>
          {photos.map((_, index) => (
            <View key={index} style={[styles.indicatorDot, currentIndex === index && styles.activeDot]} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoCarouselContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  photoCarouselWrapper: {
    maxWidth: 600,
    width: '100%',
    overflow: 'hidden',
  },
  photoWrapper: {
    width: '100%',
    height: 414,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#000',
  },
});

export default PhotoCarousel;

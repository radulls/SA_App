import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

interface PhotoCarouselProps {
  photos: string[];
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth } = useWindowDimensions(); // Динамически получаем ширину экрана

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Math.min(screenWidth, 600));
    setCurrentIndex(index);
  };

  // Вычисляем ширину и высоту контейнера динамически
  const containerWidth = Math.min(screenWidth, 600);
  const containerHeight = containerWidth; // Сохраняем пропорции 1:1

  return (
    <View style={styles.photoCarouselContainer}>
      <View style={[styles.photoCarouselWrapper, { width: containerWidth }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {photos.map((photo, index) => (
            <View key={index} style={{ width: containerWidth, height: containerHeight, overflow: 'hidden' }}>
              <Image source={{ uri: photo }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            </View>
          ))}
        </ScrollView>

        {/* Индикатор (точки) */}
        <View style={styles.indicatorContainer}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoCarouselContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  photoCarouselWrapper: {
    overflow: 'hidden',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
});

export default PhotoCarousel;
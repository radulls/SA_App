import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

interface PhotoCarouselProps {
  photos: string[];
  onImagePress?: (index: number) => void;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, onImagePress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth } = useWindowDimensions();

  const containerWidth = Math.min(screenWidth, 600);
  const containerHeight = containerWidth;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    setCurrentIndex(index);
  };

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
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => onImagePress?.(index)}
              style={{ width: containerWidth, height: containerHeight }}
            >
              <Image
                source={{ uri: photo }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Индикаторы */}
        {photos.length > 1 && (
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
        )}
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

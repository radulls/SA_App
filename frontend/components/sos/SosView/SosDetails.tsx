import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SosMapView from '../ViewMap/SosMapView';
import { IMAGE_URL } from '@/api';

interface SosDetailsProps {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
    city: string;
  } | null;
  location: { latitude: number; longitude: number; address: string };
  tags: { _id: string; name: string }[];
  title: string;
  description: string;
  onOpenMap: () => void;
}

const SosDetails: React.FC<SosDetailsProps> = ({ user, location, tags, title, description, onOpenMap }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [measured, setMeasured] = useState(false);
  const descriptionRef = useRef<Text>(null);

  const handleTextLayout = (event: any) => {
    if (measured) return; // Избегаем повторных измерений
    const { height } = event.nativeEvent.layout;
    const lineHeight = 20; // Ориентировочная высота строки
    const maxLines = 4;
    
    setTimeout(() => {
      if (height > lineHeight * maxLines) {
        setShowReadMore(true);
      }
      setMeasured(true);
    }, 0);
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.userContainer}>
        {user && (
          <>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: `${IMAGE_URL}${user.profileImage}` }} style={styles.profileImage} resizeMode="cover" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.username}>@{user.username}</Text>
              <View style={styles.locationContainer}>
                <View style={styles.locationIcon}>
                  <Text style={styles.locationIconText}>sa</Text>
                </View>
                <Text style={styles.userCity}>{user.city}</Text>
              </View>
            </View>
          </>
        )}
      </View>
      <Text style={styles.label}>Локация</Text>
      <Text style={styles.address}>{location.address}</Text>
      <TouchableOpacity onPress={onOpenMap} activeOpacity={1}>
        <Text style={styles.showMap}>Показать на карте</Text>
        <View style={styles.mapWrapper}>
          <View style={styles.mapContainer}>
            <SosMapView location={location} />
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>Теги</Text>
      <View style={styles.tagsContainer}>
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <View key={tag._id || `tag-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTags}>Нет тегов</Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      
      <Text
        ref={descriptionRef}
        style={styles.info}
        numberOfLines={measured && !isExpanded ? 4 : undefined}
        onLayout={handleTextLayout}
      >
        {description}
      </Text>

      {showReadMore && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.readMore}>{isExpanded ? 'Скрыть' : 'Читать полностью'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  userContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'absolute',
    width: 68,
    height: 68,
    zIndex: 1,
    top: -34,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  userInfo: {
    backgroundColor: '#F6F6F6',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 40,
    borderRadius: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 5,
    paddingBottom: 13,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationIcon: {
    backgroundColor: '#000000',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    alignItems: 'center',
    marginBottom: 2,
  },
  userCity: {
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 10,
    marginTop: 10,
  },
  address: {
    fontSize: 14,
    fontWeight: '400',
  },
  showMap: {
    fontSize: 14,
    fontWeight: '700',
    paddingTop: 5,
    paddingBottom: 20,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 150,
    width: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#F22C2C',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  noTags: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
});

export default SosDetails;

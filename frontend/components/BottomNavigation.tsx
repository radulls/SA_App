import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router'; // Импортируем usePathname
import HomeIcon from './svgConvertedIcons/BottomMenuIcons/HomeIcon';
import SearchIcon from './svgConvertedIcons/BottomMenuIcons/SearchIcon';
import AddIcon from './svgConvertedIcons/BottomMenuIcons/AddIcon';
import NotificationIcon from './svgConvertedIcons/BottomMenuIcons/NotificationIcon';
import { IMAGE_URL, getUserProfile, UserDataProps } from '@/api';

const BottomNavigation: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [gap, setGap] = useState(60);
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий маршрут

  useEffect(() => {
    const updateGap = () => {
      const screenWidth = Dimensions.get('window').width;
      if (screenWidth >= 375 && screenWidth <= 414) {
        const newGap = 60 - (414 - screenWidth) * (60 - 45) / (414 - 375);
        setGap(newGap);
      } else if (screenWidth > 320 && screenWidth < 375) {
        const newGap = 45 - (375 - screenWidth) * (45 - 40) / (375 - 320);
        setGap(newGap);
      } else if (screenWidth <= 320) {
        setGap(40);
      } else if (screenWidth >= 414) {
        setGap(60);
      }
    };
    updateGap();
    const onChange = Dimensions.addEventListener('change', updateGap);
    return () => {
      onChange.remove();
    };
  }, []);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const userData = await getUserProfile();
        setProfileImage(userData.profileImage || null);
      } catch (err) {
        console.log('Ошибка загрузки данных пользователя:', err);
      }
    };
    fetchProfilePhoto();
  }, []);

  // Функция для определения активного таба
  const isActiveTab = (tab: string) => {
    if (tab === 'dome' && pathname === '/dome') return true;
    if (tab === 'search' && pathname === '/search') return true;
    if (tab === 'add' && pathname === '/eventCreation') return true;
    if (tab === 'notifications' && pathname === '/messages') return true;
    if (tab === 'profile' && pathname === '/home') return true; // Убедились, что '/home' — это профиль
    return false;
  };

  return (
    <View style={[styles.nav, { gap }]}>
      <TouchableOpacity onPress={() => router.push('/dome')}>
        <HomeIcon fill={isActiveTab('dome') ? '#000000' : '#A2A2A2'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/search')}>
        <SearchIcon fill={isActiveTab('search') ? '#000000' : '#A2A2A2'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/eventCreation')}>
        <AddIcon fill={isActiveTab('add') ? '#000000' : '#A2A2A2'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/messages')}>
        <NotificationIcon fill={isActiveTab('notifications') ? '#000000' : '#A2A2A2'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/home')}
        style={[
          styles.profileWrapper,
          { borderColor: isActiveTab('profile') ? '#000000' : 'transparent' },
        ]}
      >
        {profileImage ? (
          <Image
            source={{
              uri: `${IMAGE_URL}${profileImage}`,
            }}
            resizeMode="cover"
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    height: 83,
    width: '100%',
    backgroundColor: '#FDFDFD',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 13.5,
  },
  profileWrapper: {
    width: 29,
    height: 29,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: 25,
    height: 25,
    borderRadius: 18,
    backgroundColor: '#D2D2D2',
  },
});

export default BottomNavigation;

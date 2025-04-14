import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import HomeIcon from './svgConvertedIcons/BottomMenuIcons/HomeIcon';
import SearchIcon from './svgConvertedIcons/BottomMenuIcons/SearchIcon';
import AddIcon from './svgConvertedIcons/BottomMenuIcons/AddIcon';
import NotificationIcon from './svgConvertedIcons/BottomMenuIcons/NotificationIcon';
import { IMAGE_URL, getUserProfile, getSubdivisionsICanPostTo } from '@/api';
import BottomSheetMenu from './Menu/BottomSheetMenu';

const BottomNavigation: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [gap, setGap] = useState(56); // Изменено начальное значение на 56
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateMenuVisible, setIsCreateMenuVisible] = useState(false);

  useEffect(() => {
    const updateGap = () => {
      const screenWidth = Dimensions.get('window').width;
      if (screenWidth >= 375 && screenWidth <= 414) {
        const newGap = 56 - (414 - screenWidth) * (56 - 45) / (414 - 375); // Обновлено для gap: 56
        setGap(newGap);
      } else if (screenWidth > 320 && screenWidth < 375) {
        const newGap = 45 - (375 - screenWidth) * (45 - 40) / (375 - 320);
        setGap(newGap);
      } else if (screenWidth <= 320) {
        setGap(40);
      } else if (screenWidth >= 414) {
        setGap(56); // Обновлено для gap: 56
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

  const isActiveTab = (tab: string) => {
    if (tab === 'dome' && pathname === '/dome') return true;
    if (tab === 'search' && pathname === '/search') return true;
    if (tab === 'add' && pathname === '/create-post') return true;
    if (tab === 'notifications' && pathname === '/messages') return true;
    if (tab === 'profile' && pathname === '/home') return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.nav, { gap }]}>
        {/* Контейнер для иконки "Дом" */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push('/dome')}>
            <HomeIcon fill={isActiveTab('dome') ? '#000000' : '#A2A2A2'} />
          </TouchableOpacity>
        </View>

        {/* Контейнер для иконки "Поиск" */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <SearchIcon fill={isActiveTab('search') ? '#000000' : '#A2A2A2'} width={22} height={22} />
          </TouchableOpacity>
        </View>

        {/* Контейнер для иконки "Добавить" */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setIsCreateMenuVisible(true)}>
            <AddIcon fill={isActiveTab('add') ? '#000000' : '#A2A2A2'} />
          </TouchableOpacity>
        </View>

        {/* Контейнер для иконки "Уведомления" */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push('/messages')}>
            <NotificationIcon fill={isActiveTab('notifications') ? '#000000' : '#A2A2A2'} />
          </TouchableOpacity>
        </View>

        {/* Контейнер для иконки "Профиль" */}
        <View style={styles.iconContainer}>
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
      </View>
      <BottomSheetMenu
        isVisible={isCreateMenuVisible}
        onClose={() => setIsCreateMenuVisible(false)}
        buttons={[
          {
            label: 'Новый пост',
            onPress: () => {
              setIsCreateMenuVisible(false);
              router.push('/create-post');
            },
          },
          {
            label: 'Новое мероприятие',
            onPress: () => {
              setIsCreateMenuVisible(false);
              router.push('/create-event'); // если будет отдельный
            },
          },
        ]}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: Platform.select({
      ios: 83,
      android: 83,
      web: 83,
    }),
  },
  nav: {
    position: 'absolute',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
    maxWidth: 600,
    width: '100%',
    height: '100%',
    backgroundColor: '#FDFDFD',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
  },
  iconContainer: {
    width: 26, // Фиксированная ширина контейнера
    height: 26, // Фиксированная высота контейнера
    alignItems: 'center', // Центрирование иконки по горизонтали
    justifyContent: 'center', // Центрирование иконки по вертикали
  },
  profileWrapper: {
    width: 26,
    height: 26,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 22,
    height: 22,
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 18,
    backgroundColor: '#D2D2D2',
  },
});

export default BottomNavigation;
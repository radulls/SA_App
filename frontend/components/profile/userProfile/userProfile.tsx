import { IMAGE_URL, UserDataProps, getUserProfileById } from '@/api';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProfileHeader from '../ProfileHeader';
import { styles } from '../profileStyle';
import ProfileStats from '../ProfileStats';
import UserProfileButtons from './userProfileButtons';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import MoreOptionsIcon from '@/components/svgConvertedIcons/MoreOptionsIcon';
import BottomSheetMenu from '@/components/BottomSheetMenu/BottomSheetMenu';
import CopyLink from '@/components/svgConvertedIcons/copyLink';
import ShareIcon from '@/components/svgConvertedIcons/shareIcon';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDataProps | null>(null);
  const { userId } = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Получен userId:', userId);
    if (!userId) {
      setError('ID пользователя отсутствует.');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfileById(userId as string);
        setUser(userData);
      } catch (err: any) {
        console.error('❌ Ошибка при загрузке данных пользователя:', err.message);
        setError(err.message || 'Ошибка при загрузке данных пользователя.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.errorText}>Ошибка: {error}</Text>;
  if (!user) return <Text style={styles.errorText}>Пользователь не найден.</Text>;

  // 📌 Копирование ссылки с использованием Clipboard
  const copyToClipboard = async () => {
    console.log('Кнопка нажата!'); // Проверяем, вызывается ли функция
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'ID пользователя отсутствует.',
        position: 'bottom',
      });
      return;
    }
  
    try {
      const deepLink = Linking.createURL(`/profile/${userId}`);
      console.log('🔗 Ссылка для копирования:', deepLink);
  
      await Clipboard.setStringAsync(deepLink); // <-- Проверяем работает ли это
  
      console.log('✅ Ссылка успешно скопирована!');
      Toast.show({
        type: 'success',
        text1: 'Ссылка скопирована!',
        position: 'bottom',
      });
    } catch (err) {
      console.error('❌ Ошибка при копировании:', err);
      Toast.show({
        type: 'error',
        text1: 'Не удалось скопировать ссылку.',
        position: 'bottom',
      });
    }
  };
  

  // 📌 Поделиться ссылкой
  const shareLink = async () => {
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'ID пользователя отсутствует.',
        position: 'bottom',
      });
      return;
    }

    try {
      const deepLink = Linking.createURL(`/profile/${userId}`);
      console.log('📤 Ссылка для шаринга:', deepLink);

      await Share.share({
        message: `Посмотрите мой профиль: ${deepLink}`,
        url: deepLink,
      });
    } catch (err) {
      console.error('❌ Ошибка при шаринге:', err);
      Toast.show({
        type: 'error',
        text1: 'Не удалось поделиться ссылкой.',
        position: 'bottom',
      });
    }
  };

  // 📌 Отправка жалобы
  const reportUser = () => {
    Toast.show({
      type: 'success',
      text1: 'Спасибо, что сообщили нам об этом',
      position: 'bottom',
    });
  };

  // 📌 Блокировка пользователя
  const blockUser = () => {
    Toast.show({
      type: 'success',
      text1: 'Пользователь заблокирован',
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.coverImageContainer}>
            {user?.backgroundImage ? (
              <Image
                resizeMode="cover"
                source={{ uri: `${IMAGE_URL}${user.backgroundImage}` }}
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.coverImage} />
            )}
          </View>
          <View style={styles.headerButtons}>
            <View style={styles.backIcon}>
              <IconBack width={14} height={14} onPress={() => router.back()} />
            </View>
            <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.moreIcon}>
              <MoreOptionsIcon width={21} height={12} />
            </TouchableOpacity>
          </View>
          <ProfileHeader user={user} isOwnProfile={false} />
          <ProfileStats user={user} />
          <UserProfileButtons />
        </View>
      </ScrollView>

      {/* Вызов меню */}
      <BottomSheetMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        buttons={[
          { label: 'Копировать ссылку', onPress: copyToClipboard, icon: <CopyLink fill={'#000'} />, isRowButton: true },
          { label: 'Поделиться через…', onPress: shareLink, icon: <ShareIcon fill={'#000'} />, isRowButton: true },
          { label: 'Пожаловаться', onPress: reportUser, icon: null, isRowButton: false },
          { label: 'Заблокировать', onPress: blockUser, icon: null, isRowButton: false },
        ]}
      />
    </View>
  );
};

export default UserProfile;

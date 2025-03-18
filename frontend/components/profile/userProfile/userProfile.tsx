import { IMAGE_URL, UserDataProps, checkIfSubscribed, getUserProfileById, getUserProfile } from '@/api';
import { getReportTopics } from '@/api/reportService';
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, Share, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import ProfileHeader from '../ProfileHeader';
import ProfileStats from '../ProfileStats';
import UserProfileButtons from './userProfileButtons';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import MoreOptionsIcon from '@/components/svgConvertedIcons/MoreOptionsIcon';
import BottomSheetMenu from '@/components/Menu/BottomSheetMenu';
import ReportMenu from '@/components/Menu/ReportMenu';
import CopyLink from '@/components/svgConvertedIcons/copyLink';
import ShareIcon from '@/components/svgConvertedIcons/shareIcon';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { blockUser, checkIfBlocked, unblockUser } from '@/api/blockedUsers';

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDataProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isReportMenuVisible, setIsReportMenuVisible] = useState(false);
  const [reportTopics, setReportTopics] = useState<{ _id: string; name: string }[]>([]);
  const router = useRouter();
  const [closeAnimation, setCloseAnimation] = useState<(() => void) | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserDataProps | null>(null); // ✅ Новый стейт
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  //  Получаем `userId` из `useLocalSearchParams()` или `useSegments()`
  const params = useLocalSearchParams();
  const segments = useSegments();
  // let userId = '6787bfd597715a6fc67231c9'

  let userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  if (!userId && segments.length > 1) {
    userId = segments[segments.length - 1];
  }

  console.log("📡 useLocalSearchParams():", params);
  console.log("📌 Полученный userId:", userId);

  useEffect(() => {
    if (!userId) {
      console.error("❌ Ошибка: userId отсутствует, запрос не отправлен");
      setError("Ошибка: отсутствует идентификатор пользователя");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfileById(userId);
        setUser(userData);
  
        const subscriptionStatus = await checkIfSubscribed(userId);
        setUser((prevUser) => prevUser ? { ...prevUser, isSubscribed: subscriptionStatus } : prevUser);
  
        const blockedStatus = await checkIfBlocked(userId); // ✅ Проверяем блокировку
        setIsBlocked(blockedStatus);
      } catch (err: any) {
        console.error("❌ Ошибка загрузки данных пользователя:", err.message);
        setError(err.message || "Ошибка загрузки.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        console.log("📡 Загружаем данные залогиненного пользователя...");
        const userData = await getUserProfile(); //  Запрашиваем данные о себе
        console.log(" Данные залогиненного пользователя:", userData);
        setLoggedInUser(userData); //  Сохраняем в стейт
      } catch (error) {
        console.error(" Ошибка загрузки залогиненного пользователя:", error);
      }
    };
  
    fetchLoggedInUser();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.errorText}>Ошибка: {error}</Text>;
  if (!user) return <Text style={styles.errorText}>Пользователь не найден.</Text>;

  // 📌 Копирование ссылки
  const copyToClipboard = async () => {
    if (!userId || typeof userId !== "string") {
      console.error("❌ Ошибка: userId имеет неверный формат:", userId);
      setError("Некорректный идентификатор пользователя");
      return;
    }
    try {
      const deepLink = Linking.createURL(`/profile/${userId}`);
      await Clipboard.setStringAsync(deepLink);
  
      if (closeAnimation) {
        closeAnimation(); // Закрываем меню плавно
        setTimeout(() => {
          Toast.show({ type: 'success', text1: 'Ссылка скопирована!', position: 'bottom' });
        }, 300); // Запускаем `Toast` после завершения анимации (200мс)
      } else {
        setIsMenuVisible(false);
        Toast.show({ type: 'success', text1: 'Ссылка скопирована!', position: 'bottom' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Ошибка копирования.', position: 'bottom' });
    }
  };

  // 📌 Поделиться ссылкой
  const shareLink = async () => {
    if (!userId) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'ID отсутствует.', position: 'bottom' });
      return;
    }
    try {
      const deepLink = Linking.createURL(`/profile/${userId}`);
      await Share.share({ message: `Посмотрите профиль: ${deepLink}`, url: deepLink });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Ошибка при шаринге.', position: 'bottom' });
    }
  };

  // 📌 Блокировка пользователя
  const handleBlockUser = async () => {
    try {
      await blockUser(userId);
      setIsBlocked(true);
      Toast.show({ type: 'success', text1: 'Пользователь заблокирован!', position: 'bottom' });
      setIsMenuVisible(false);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка блокировки.', position: 'bottom' });
    }
  };
  
  const handleUnblockUser = async () => {
    try {
      await unblockUser(userId);
      setIsBlocked(false);
      Toast.show({ type: 'success', text1: 'Пользователь разблокирован!', position: 'bottom' });
      setIsMenuVisible(false);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка разблокировки.', position: 'bottom' });
    }
  };
  

  // 📌 Открыть меню жалоб
  const openReportMenu = async () => {
    if (closeAnimation) {
      closeAnimation(); // ✅ Просто вызываем без аргументов
      setTimeout(() => {
        getReportTopics()
          .then((topics) => {
            setReportTopics(topics);
            setIsReportMenuVisible(true);
          })
          .catch(() => {
            Toast.show({ type: 'error', text1: 'Не удалось загрузить темы.', position: 'bottom' });
          });
      }, 200); // Открываем меню жалоб после анимации закрытия
    } else {
      console.warn("⚠ closeAnimation не установлен");
      setIsMenuVisible(false);
      setTimeout(() => setIsReportMenuVisible(true), 200);
    }
  }; 

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.contentContainer}>
        <View style={styles.coverImageContainer}>
          {user?.backgroundImage ? (
            <Image resizeMode="cover" source={{ uri: `${IMAGE_URL}${user.backgroundImage}` }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverImage} />
          )}
        </View>
        <View style={styles.headerButtons}>
          <View>
            <IconBack width={14} height={14} onPress={() => router.back()} />
          </View>
          <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
            <MoreOptionsIcon width={21} height={12} />
          </TouchableOpacity>
        </View>
        <ProfileHeader user={user} isOwnProfile={false} />
        <ProfileStats user={user} />
        <UserProfileButtons
          userId={userId}
          initialSubscribed={user?.isSubscribed ?? false}
          onSubscriptionChange={(status) => {
            setUser((prevUser) => (prevUser ? { ...prevUser, isSubscribed: status } : prevUser));
          }}
        />
      </View>
    </ScrollView>
    <BottomSheetMenu
      key={loggedInUser?.role} //  Перерисовываем при смене роли
      isVisible={isMenuVisible}
      onClose={() => setIsMenuVisible(false)}
      setCloseAnimation={setCloseAnimation}
      buttons={[
        { label: 'Копировать ссылку', onPress: copyToClipboard, icon: <CopyLink fill={'#000'} />, isRowButton: true },
        { label: 'Поделиться через…', onPress: shareLink, icon: <ShareIcon fill={'#000'} />, isRowButton: true },
        loggedInUser?.role === 'admin' || loggedInUser?.role === 'creator' // Проверяем именно залогиненного пользователя
          ? { label: 'Управление', onPress: () => router.push(`/home`), icon: null, isRowButton: false }
          : { label: 'Пожаловаться', onPress: openReportMenu, icon: null, isRowButton: false },
          isBlocked
          ? { label: 'Разблокировать', onPress: handleUnblockUser, icon: null, isRowButton: false }
          : { label: 'Заблокировать', onPress: handleBlockUser, icon: null, isRowButton: false },
      ]}
    />
    <ReportMenu
    isVisible={isReportMenuVisible}
    onClose={() => setIsReportMenuVisible(false)}
    userId={userId as string}
    />
  </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 58,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between', // Распределяет пространство между элементами
    alignItems: 'center', // Выравнивает элементы по центру по вертикали
  },
  coverImageContainer: {
    width: '100%',
    aspectRatio: 414 / 210, // Рассчитанное соотношение 414:210 = 1.971:1
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D2D2D2',
    resizeMode: 'cover',  // Сохраняет пропорции изображения при изменении размеров контейнера
  },
  divider: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    minHeight: 0.5,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
});

export default UserProfile;

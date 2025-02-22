import { IMAGE_URL, UserDataProps, checkIfSubscribed, getUserProfileById } from '@/api';
import { getReportTopics, reportUser } from '@/api/reportService';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import ProfileHeader from '../ProfileHeader';
import { styles } from '../profileStyle';
import ProfileStats from '../ProfileStats';
import UserProfileButtons from './UserProfileButtons';
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
  const [error, setError] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isReportMenuVisible, setIsReportMenuVisible] = useState(false);
  const [reportTopics, setReportTopics] = useState<{ _id: string; name: string }[]>([]);
  const router = useRouter();

  // 🛠️ Получаем `userId` из `useLocalSearchParams()` или `useSegments()`
  const params = useLocalSearchParams();
  const segments = useSegments();

  let userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  if (!userId && segments.length > 1) {
    userId = segments[segments.length - 1]; // Берём ID из URL
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
        console.log("📡 Запрос к API с userId:", userId);

        const userData = await getUserProfileById(userId);
        console.log("✅ Данные пользователя:", userData);

        setUser(userData);

        const subscriptionStatus = await checkIfSubscribed(userId);
        setUser((prevUser) => prevUser ? { ...prevUser, isSubscribed: subscriptionStatus } : prevUser);
      } catch (err: any) {
        console.error("❌ Ошибка загрузки данных пользователя:", err.message);
        setError(err.message || "Ошибка загрузки.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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
      Toast.show({ type: 'success', text1: 'Ссылка скопирована!', position: 'bottom' });
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

  // 📌 Открыть меню жалоб
  const openReportMenu = async () => {
    try {
      const topics = await getReportTopics();
      setReportTopics(topics);
      setIsReportMenuVisible(true);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Не удалось загрузить темы.', position: 'bottom' });
    }
  };

  // 📌 Отправка жалобы
  const handleReportSubmit = async (topicId: string) => {
    try {
      await reportUser(userId as string, topicId);
      Toast.show({ type: 'success', text1: 'Спасибо, что сообщили нам об этом', position: 'bottom' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Не удалось отправить жалобу.', position: 'bottom' });
    } finally {
      setIsReportMenuVisible(false);
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
            <View style={styles.backIcon}>
              <IconBack width={14} height={14} onPress={() => router.back()} />
            </View>
            <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.moreIcon}>
              <MoreOptionsIcon width={21} height={12} />
            </TouchableOpacity>
          </View>
          <ProfileHeader user={user} isOwnProfile={false} />
          <ProfileStats user={user} />
          <UserProfileButtons 
            userId={userId} 
            initialSubscribed={user?.isSubscribed ?? false} 
            onSubscriptionChange={(status) => {
              setUser((prevUser) => prevUser ? { ...prevUser, isSubscribed: status } : prevUser);
            }} 
          />
        </View>
      </ScrollView>
      <BottomSheetMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        buttons={[
          { label: 'Копировать ссылку', onPress: copyToClipboard, icon: <CopyLink fill={'#000'} />, isRowButton: true },
          { label: 'Поделиться через…', onPress: shareLink, icon: <ShareIcon fill={'#000'} />, isRowButton: true },
          { label: 'Пожаловаться', onPress: openReportMenu, icon: null, isRowButton: false },
        ]}
      />
      <BottomSheetMenu
        isVisible={isReportMenuVisible}
        onClose={() => setIsReportMenuVisible(false)}
        type="report"
        userId={userId as string}
        buttons={reportTopics.map((topic) => ({
          label: topic.name,
          onPress: () => handleReportSubmit(topic._id),
          icon: null,
          isRowButton: false,
        }))}
      />
    </View>
  );
};

export default UserProfile;

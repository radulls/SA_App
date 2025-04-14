import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable, ScrollView, Dimensions, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { UserDataProps, getPublicProfile, IMAGE_URL } from '@/api/index';
import CopyLink from '@/components/svgConvertedIcons/copyLink';
import ShareIcon from '@/components/svgConvertedIcons/shareIcon';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScanQr from '@/components/svgConvertedIcons/scanQr';
import * as Linking from 'expo-linking';
import getFullName from '@/utils/getFullName';

const ProfileQRCard: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [user, setUser] = useState<UserDataProps | null>(null); // Данные пользователя
  const [loading, setLoading] = useState<boolean>(true); // Индикатор загрузки
  const [error, setError] = useState<string | null>(null); // Ошибки загрузки
  const router = useRouter();
  const { userId } = useLocalSearchParams(); // Получение `userId` из параметров URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!userId) {
          throw new Error('ID пользователя не указан.');
        }
        // Загружаем публичные данные пользователя
        const userData = await getPublicProfile(userId as string);
        setUser(userData); // Устанавливаем данные пользователя
      } catch (err: any) {
        console.error('Ошибка при загрузке данных пользователя:', err.message);
        setError(err.message || 'Ошибка при загрузке данных пользователя.');
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    console.log('Получен userId:', userId); // Логируем значение
  }, [userId]);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', updateScreenWidth);

    return () => {
      subscription?.remove();
    };
  }, []);

  const copyToClipboard = () => {
    if (userId) {
      const deepLink = Linking.createURL(`/profileQR/${userId}`);
      Clipboard.setStringAsync(deepLink)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Ссылка скопирована!',
            position: 'bottom',
          });
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Не удалось скопировать ссылку.',
            position: 'bottom',
          });
        });
    }
  };
  
  const shareLink = async () => {
    try {
      if (userId) {
        const deepLink = Linking.createURL(`/profileQR/${userId}`);
        await Share.share({
          message: `Посмотрите мой профиль: ${deepLink}`,
          url: deepLink,
        });
      } else {
        alert('ID пользователя отсутствует.');
      }
    } catch (error) {
      console.error('Ошибка при попытке поделиться ссылкой:', error);
    }
  };
  
  const shareOptions = [
    { icon: <CopyLink />, text: 'Копировать ссылку', action: copyToClipboard },
    { icon: <ShareIcon />, text: 'Поделиться через…', action: shareLink },
  ];

  const goBack = () => {
    router.push('/home');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerIcons}>
          <IconBack onPress={goBack} width={14} height={14} />
          <ScanQr />
        </View>
        {loading ? (
          <Text>Загрузка...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <>
            <View style={styles.header}>
              <Image
                resizeMode="cover"
                source={{
                  uri: `${IMAGE_URL}${user?.profileImage}` || 'https://via.placeholder.com/150',
                }}
                style={styles.profilePicture}
              />
              <Text style={styles.userName}>
                {user ? getFullName({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  hideLastName: user.hideLastName ?? false, // 👈 обязательно передаём явно
                }) : null}
              </Text>
              <View style={styles.userInfoContainer}>
              <View style={styles.locationIcon}>
                <Text style={styles.locationIconText}>sa</Text>
              </View>
              <Text style={styles.userLocation}>{user?.city}</Text>
              </View>
              <View style={styles.qrCodeContainer}>
                {user?.qrCode ? (
                  <Image
                    resizeMode="contain"
                    source={{ uri: user.qrCode }}
                    style={styles.qrCode}
                  />
                ) : (
                  <Text style={{ color: 'gray' }}>QR-код не найден</Text>
                )}
              </View>
            </View>
            <View style={styles.shareOptionsContainer}>
              {shareOptions.map((option, index) => (
                <Pressable
                  key={index}
                  style={styles.shareOption}
                  onPress={option.action} // Привязываем действие
                >
                  <View style={styles.shareIcon}>{option.icon}</View>
                  <Text style={styles.shareText}>{option.text}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: 'rgba(255, 210, 0, 1)', 
  },
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
    marginTop: 55,
    width: '100%',
  }, 
  header: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 40,
    marginTop: 76,
    width: '100%',
  },
  profilePicture: {
    height: 68,
    width: 68,
    borderRadius: 34,
    backgroundColor: '#D2D2D2',
  },
  userName: {
    color: 'rgba(255, 255, 255, 1)',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationIcon: {
    backgroundColor: '#fff',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 1)',
    marginLeft: 3,
    fontSize: 14,
    fontWeight: '700',
  },
  qrCodeContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(246, 246, 246, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    alignSelf: 'center',
    marginTop: 24,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    width: '100%',
    padding: 42,
  },
  qrCode: {
    width: '100%', 
    height: '100%', 
    borderRadius: 20,
  },
  shareOptionsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 125,
    marginBottom: 65,
    width: '100%',
    maxWidth: 304,
  },
  shareOption: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  shareIcon: {
    width: 22,
    aspectRatio: 1,
  },
  shareText: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProfileQRCard;

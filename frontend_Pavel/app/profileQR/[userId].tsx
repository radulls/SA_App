import React from 'react';
import { View, StyleSheet, Image, Text, Pressable, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import CopyLink from '@/components/svgConvertedIcons/copyLink';
import ShareIcon from '@/components/svgConvertedIcons/shareIcon';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import ScanQr from '@/components/svgConvertedIcons/scanQr';
import { mockUserData } from '@/api/mockApi'; // Импортируем мок-данные напрямую
import { useRouter } from 'expo-router';

const ProfileQRCard: React.FC = () => {
  const user = mockUserData; // Просто берем мок-данные
  const router = useRouter();

  const copyToClipboard = () => {
    Toast.show({
      type: 'success',
      text1: 'Ссылка скопирована!',
      text2: 'Ссылка добавлена в буфер обмена.',
      position: 'bottom',
    });
  };

  const shareLink = () => {
    Toast.show({
      type: 'success',
      text1: 'Поделиться',
      text2: 'Ссылка отправлена!',
      position: 'bottom',
    });
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
          <View style={styles.iconBack}>
            <IconBack onPress={goBack} width={14} height={14} />
          </View>
          <ScanQr />
        </View>
        <View style={styles.header}>
          <Image
            resizeMode="cover"
            source={user.profileImage} // Берем из мока
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.userLocation}>{user.city}</Text>
          </View>
          <View style={styles.qrCodeContainer}>
            <Image
              resizeMode="contain"
              source={user.qrCode} // Берем из мока
              style={styles.qrCode}
            />
          </View>
        </View>
        <View style={styles.shareOptionsContainer}>
          {shareOptions.map((option, index) => (
            <Pressable
              key={index}
              style={styles.shareOption}
              onPress={option.action} // Выполняем действие
            >
              <View style={styles.shareIcon}>{option.icon}</View>
              <Text style={styles.shareText}>{option.text}</Text>
            </Pressable>
          ))}
        </View>
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
    marginTop: 75,
    width: '100%',
  },
  iconBack: {
    marginLeft: -20,
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

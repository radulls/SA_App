import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileMain from '@/components/profile/ProfileMain';
import VerificationPageStart from '@/components/notify/VerificationPageStart';
import LoadingScreen from '@/components/profile/LoadingScreen';
import { checkVerificationStatus } from '@/api';
import { router } from 'expo-router';
import VerificationPageProgress from '@/components/notify/VerificationPageProgress';
import VerificationPageSub from '@/components/notify/VerificationPageSub';
import VerificationRejected from '@/components/notify/VerificationPageDecline';
import VerificationPageDeleted from '@/components/notify/VerificationPageDelete';

const ProfileScreen: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setLoading(true);
        const response = await checkVerificationStatus();
        console.log('Ответ от API:', response);
        setVerificationStatus(response.verificationStatus);
      } catch (err: any) {
        console.error('Ошибка проверки статуса верификации:', err.message);
        setError(err.message || 'Ошибка при загрузке статуса верификации.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <VerificationPageStart onStart={() => router.push('/verification')} />;
  }
  //
//enum: ['not_verified', 'pending', 'verified', 'paymant', 'rejected', 'blocked'],

  const showOverlay = verificationStatus === 'not_verified' || verificationStatus === 'pending' || verificationStatus === 'paymant' || verificationStatus === 'rejected' || verificationStatus === 'blocked';
  const showVerificationStart = verificationStatus === 'not_verified';
  const showVerificationProgress = verificationStatus === 'pending';
  const showVerificationSubs = verificationStatus === 'paymant';
  const showVerificationRejected = verificationStatus === 'rejected';
  const showVerificationBlocked = verificationStatus === 'blocked';

  return (
    <View style={styles.container}>
      {/* Основной экран профиля */}
      <ProfileMain />
  
      {/* Затемненный фон, если пользователь не верифицирован */}
      {showOverlay && <View style={styles.darkOverlay} />}
  
      {/* Экран верификации поверх затемненного фона */}
      {showVerificationStart && (
        <View style={styles.overlay}>
          <VerificationPageStart onStart={() => router.push('/verification')} />
        </View>
      )}
  
      {showVerificationProgress && (
        <View style={styles.overlay}>
          <VerificationPageProgress onStart={() => router.push('/home')} />
        </View>
      )}

    {showVerificationSubs && (
        <View style={styles.overlay}>
          <VerificationPageSub onStart={() => router.push('/home')} />
        </View>
      )}

    {showVerificationRejected && (
        <View style={styles.overlay}>
          <VerificationRejected onStart={() => router.push('/home')} />
        </View>
      )}

    {showVerificationBlocked && (
        <View style={styles.overlay}>
          <VerificationPageDeleted onStart={() => router.push('/home')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Полупрозрачный черный фон
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
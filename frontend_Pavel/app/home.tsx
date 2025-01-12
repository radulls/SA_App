import React, { useEffect, useState } from 'react';
import ProfileMain from '@/components/profile/ProfileMain';
import VerificationPageStart from '@/components/notify/VerificationPageStart';
import VerificationPageProgress from '@/components/notify/VerificationPageProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Временная фиктивная проверка статуса
const mockCheckVerificationStatus = async (userId: string): Promise<any> => {
  console.log(`Mock проверка статуса для userId: ${userId}`);
  return { verificationStatus: 'not_verified' }; // Меняйте статус для тестирования
};

const ProfileScreen: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId'); // Получаем userId
        if (!userId) throw new Error('Пользователь не авторизован.');

        const response = await mockCheckVerificationStatus(userId); // Используем мок-функцию
        console.log('Статус верификации:', response.verificationStatus);
        setVerificationStatus(response.verificationStatus);
      } catch (err: any) {
        console.error('Ошибка при проверке статуса:', err.message);
        setError(err.message || 'Ошибка при загрузке статуса верификации.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  if (loading) {
    return (
      <VerificationPageProgress
        onStart={(value) => console.log('Загрузка...')}
      />
    ); // Пока идёт загрузка
  }

  if (error) {
    return (
      <VerificationPageStart
        onStart={() => router.push('/verification')}
      />
    ); // При ошибке направляем на старт
  }

  // Возвращаем соответствующий экран в зависимости от статуса
  if (verificationStatus === 'not_verified') {
    return <VerificationPageStart onStart={() => router.push('/verification')} />;
  } else if (verificationStatus === 'pending') {
    return <VerificationPageProgress onStart={(value) => console.log('Ожидание проверки')} />;
  } else if (verificationStatus === 'verified') {
    return <ProfileMain />;
  } else {
    return <VerificationPageStart onStart={() => router.push('/verification')} />;
  }
};

export default ProfileScreen;

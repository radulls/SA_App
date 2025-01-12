import React, { useEffect, useState } from 'react';
import ProfileMain from '@/components/profile/ProfileMain';
import VerificationPageStart from '@/components/notify/VerificationPageStart';
import VerificationPageProgress from '@/components/notify/VerificationPageProgress';
import { checkVerificationStatus } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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
		
				const response = await checkVerificationStatus(userId); // Проверяем статус
				console.log('статус: ', response.verificationStatus)
				setVerificationStatus(response.verificationStatus);
			} catch (err: any) {
				setError(err.message || 'Ошибка при загрузке статуса верификации.');
			} finally {
				setLoading(false);
			}
		};
		

    fetchVerificationStatus();
  }, []);

  if (loading) {
    return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)}/>; // Пока идет загрузка, показываем индикатор
  }

  if (error) {
    return <VerificationPageStart onStart={(value) => console.log('Старт нажат:', value)}/>; // Если есть ошибка, можно направить на экран старта верификации
  }

  // Возвращаем соответствующий экран в зависимости от статуса
  if (verificationStatus === 'not_verified') {
    return <VerificationPageStart onStart={() => router.push('/verification')} />;
  } else if (verificationStatus === 'pending') {
    return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)}/>;
  } else if (verificationStatus === 'verified') {
    return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)}/>;
  } else {
    return <ProfileMain />;
  }
};

export default ProfileScreen;

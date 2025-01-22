import React, { useEffect, useState } from 'react';
import ProfileMain from '@/components/profile/ProfileMain';
import VerificationPageStart from '@/components/notify/VerificationPageStart';
import VerificationPageProgress from '@/components/notify/VerificationPageProgress';
import { checkVerificationStatus } from '@/api';
import { router } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setLoading(true);
        const response = await checkVerificationStatus(); // Удаляем передачу userId
        console.log('Ответ от API:', response); // Логируем весь ответ
        setVerificationStatus(response.verificationStatus); // Логируем verificationStatus
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
    return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)} />; // Пока идет загрузка, показываем индикатор
  }

  if (error) {
    return <VerificationPageStart onStart={(value) => console.log('Старт нажат:', value)} />; // Если есть ошибка, можно направить на экран старта верификации
  }

  // Возвращаем соответствующий экран в зависимости от статуса
  if (verificationStatus === 'not_verified') {
    return <VerificationPageStart onStart={() => router.push('/verification')} />;
  } else if (verificationStatus === 'pending') {
    return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)} />;
  } else if (verificationStatus === 'verified') {
    return <ProfileMain />;
  } 
  // else if (verificationStatus === 'verified') {
  //   return <VerificationPageProgress onStart={(value) => console.log('Старт нажат:', value)} />;
  // } 
};

export default ProfileScreen;

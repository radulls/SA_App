import React from 'react';
import CaptchaScreen from '@/components/auth/CaptchaScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CaptchaWrapper = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams(); // Хук для получения параметров из строки запроса
  const action = searchParams.action; // Извлекаем параметр `action`

  const handleCaptchaSuccess = () => {
    console.log('Action:', action);
    if (action === 'register') {
      console.log('Redirecting to /register');
      router.push('/register');
    } else {
      console.log('Redirecting to /home');
      router.push('/home');
    }
  };

  return <CaptchaScreen onSuccess={handleCaptchaSuccess} />;
};

export default CaptchaWrapper;

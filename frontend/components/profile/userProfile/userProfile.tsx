import { UserDataProps, getUserProfileById } from '@/api';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки
  const [user, setUser] = useState<UserDataProps | null>(null);
  const { userId } = useLocalSearchParams(); // Получение `userId` из параметров URL
  const [error, setError] = useState<string | null>(null); 

useEffect(() => {
  const fetchUserData = async () => {
    try{
      setLoading(true);
      const userData = await getUserProfileById(userId as string);
      setUser(userData);
    } catch (err: any) {
      console.error('Ошибка при загрузке данных пользователя:', err.message);
      setError(err.message || 'Ошибка при загрузке данных пользователя.');
    } finally {
      setLoading(false); // Скрываем индикатор загрузки
    }
  }
})

  return (
    <View>

    </View>
  )
}

export default UserProfile
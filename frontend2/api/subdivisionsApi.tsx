import api from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subdivision } from '@/types/subdivision'; // если типы вынесены

export const getAllSubdivisions = async (): Promise<Subdivision[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Нет токена');

    const response = await api.get('/subdivisions', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при получении подразделений:', error.message);
    throw error;
  }
};

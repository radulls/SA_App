import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.3.16:5001/api';

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Получение списка тем жалоб
export const getReportTopics = async (): Promise<{ _id: string; name: string }[]> => {
  try {
    const response = await api.get('/reports/topics');
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при получении тем жалоб:', error.message);
    throw new Error('Не удалось загрузить темы жалоб.');
  }
};

// Отправка жалобы
export const reportUser = async (reportedUserId: string, topicId: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Необходимо авторизоваться.');
    }

    const response = await api.post(
      '/reports/submit',
      { reportedUserId, topicId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при отправке жалобы:', error.message);
    throw new Error('Не удалось отправить жалобу. Попробуйте позже.');
  }
};

// Получение списка жалоб (для админов)
export const getUserReports = async (): Promise<any[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Необходимо авторизоваться.');
    }

    const response = await api.get('/reports/all', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при получении списка жалоб:', error.message);
    throw new Error('Не удалось загрузить жалобы.');
  }
};

// Удаление жалобы (для админов)
export const deleteReport = async (reportId: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Необходимо авторизоваться.');
    }

    const response = await api.delete(`/reports/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при удалении жалобы:', error.message);
    throw new Error('Не удалось удалить жалобу.');
  }
};

export default api;

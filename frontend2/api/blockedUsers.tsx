import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api, { UserDataProps } from '.';

const API_BASE_URL = 'http://89.108.118.249:5001/api';

export interface BlockedUserData {
  _id: string; 
  blocked: UserDataProps; 
}

/**
 * 📌 Блокировка пользователя
 * @param {string} userId - ID пользователя, которого нужно заблокировать
 */
export const blockUser = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Вы не авторизованы', position: 'bottom' });
      return;
    }

    await axios.post(
      `${API_BASE_URL}/blockedUsers/block`,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Toast.show({ type: 'success', text1: 'Пользователь заблокирован!', position: 'bottom' });
  } catch (error: any) {
    console.error('Ошибка блокировки:', error);
    Toast.show({ type: 'error', text1: 'Ошибка блокировки.', position: 'bottom' });
  }
};

/**
 * 📌 Разблокировка пользователя
 * @param {string} userId - ID пользователя, которого нужно разблокировать
 */
export const unblockUser = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Вы не авторизованы', position: 'bottom' });
      return;
    }

    await axios.post(
      `${API_BASE_URL}/blockedUsers/unblock`,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Toast.show({ type: 'success', text1: 'Пользователь разблокирован!', position: 'bottom' });
  } catch (error: any) {
    console.error('Ошибка разблокировки:', error);
    Toast.show({ type: 'error', text1: 'Ошибка разблокировки.', position: 'bottom' });
  }
};

/**
 * 📌 Проверка, заблокирован ли пользователь
 * @param {string} userId - ID пользователя, статус которого нужно проверить
 * @returns {boolean} - true, если пользователь заблокирован, иначе false
 */
export const checkIfBlocked = async (userId: string): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('Ошибка: пользователь не авторизован');
      return false;
    }

    const response = await axios.get(
      `${API_BASE_URL}/blockedUsers/isBlocked/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.isBlocked;
  } catch (error: unknown) {
    console.error('Ошибка проверки блокировки:', (error as Error).message);
    return false;
  }
};

export const getBlockedUsers = async (): Promise<BlockedUserData[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('❌ Токен отсутствует!');

    console.log("📡 Отправка запроса на получение заблокированных пользователей...");
    
    const response = await axios.get(`${API_BASE_URL}/blockedUsers/blocked-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Полученные заблокированные пользователи:", response.data.blockedUsers);

    return response.data.blockedUsers;
  } catch (error: any) {
    console.error("❌ Ошибка при получении списка заблокированных:", error.response?.data || error.message);
    throw error;
  }
};

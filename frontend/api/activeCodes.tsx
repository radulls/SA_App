import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://89.108.118.249:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🔹 Функция для безопасного получения токена
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ Токен отсутствует! Запрос может не пройти.');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Генерация кода
export const generateCode = async (type: 'user' | 'admin') => {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) throw new Error('Не найден токен авторизации.');

    console.log(`📡 Отправляем запрос на генерацию кода (${type})`);
    const response = await api.post('/codes/generate', { type }, { headers });

    console.log('✅ Код успешно сгенерирован:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при генерации кода:', error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Получение приглашенных пользователей
export const getInvitedUsers = async () => {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) throw new Error('Не найден токен авторизации.');

    console.log('📡 Запрашиваем список приглашенных пользователей...');
    const response = await api.get('/codes/invited-users', { headers });

    console.log(`✅ Найдено ${response.data.length} приглашенных пользователей.`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении списка приглашенных пользователей:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserCodes = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.get('/codes/user-codes', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении кодов пользователя:', error);
    throw error;
  }
};
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://192.168.1.72:5001/api'; // Укажите реальный IP или домен сервера

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция POST-запроса
export const post = async <T>(url: string, data: T): Promise<any> => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    console.error('POST error:', error.response?.data || error.message);
    throw error;
  }
};

// Функция GET-запроса
export const get = async (url: string): Promise<any> => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error('GET error:', error.response?.data || error.message);
    throw error;
  }
};

export default api;

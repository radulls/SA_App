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
    console.log('данные:', data);
    return response.data;
  } catch (error: any) {
    console.error('POST error:', error.response?.data || error.message);
    throw error;
  }
};

// Функция PATCH с FormData
export const patchWithFiles = async (
  url: string,
  formData: FormData,
  config: object = {} // Добавляем опциональный параметр для дополнительных настроек
): Promise<any> => {
  try {
    console.log(`PATCH ${url} с FormData:`, formData);
    const response = await axios.patch(`${API_BASE_URL}${url}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config, // Объединяем дополнительные настройки
    });
    console.log('Успешный ответ PATCH:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Ошибка PATCH ${url} с FormData:`, error.response?.data || error.message);
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

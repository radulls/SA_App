import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.3.16:5001/api';
export const IMAGE_URL = 'http://192.168.3.16:5001';

export interface UserDataProps {
  id?: string;
  firstName: string;
  lastName: string;
  aboutMe: string;
  username: string;
  city: string; // Меняем тип на строку
  intro?: string;
  profileImage?: string;
  backgroundImage?: string;
  subscribers?: number;
  rating?: number;
  qrCode?: string;
  isSubscribed?: boolean; // ✅ Добавляем статус подписки
}

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Метод для обновления токена
const refreshToken = async (): Promise<string> => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      console.error('Отсутствует refreshToken в AsyncStorage');
      throw new Error('Требуется повторная авторизация.');
    }

    const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
      refreshToken: storedRefreshToken,
    });

    console.log('Ответ сервера при обновлении токена:', response.data);

    const { token, refreshToken: newRefreshToken } = response.data;

    if (!token || !newRefreshToken) {
      console.error('Сервер не вернул новые токены');
      throw new Error('Токены не получены. Требуется повторная авторизация.');
    }

    // Сохраняем новые токены
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', newRefreshToken);

    return token;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', (error as Error).message);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    throw new Error('Не удалось обновить токен. Требуется повторная авторизация.');
  }
};

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Не удалось обновить токен. Требуется повторная авторизация.');
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

// Общие методы
export const post = async <T>(url: string, data: T): Promise<any> => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    const customError = handleError(error);
    if (!customError) {
      console.log('Произошла скрытая ошибка', error.message);
    }
    throw error;
  }
};

export const patch = async <T>(url: string, data: T, config: Record<string, any> = {}): Promise<any> => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error: any) {
    const customError = handleError(error);
    if (!customError) {
      console.log('Скрытая ошибка PATCH:', error.message);
    }
    throw error;
  }
};

export const get = async (url: string): Promise<any> => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    const customError = handleError(error);
    if (!customError) {
      console.log('Скрытая ошибка GET:', error.message);
    }
    throw error;
  }
};

export const patchWithFiles = async (url: string, formData: FormData): Promise<any> => {
  try {
    const response = await api.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('PATCH error:', error.response?.data || error.message);
    throw error;
  }
};

// Функция логина пользователя
export const loginUser = async (identifier: string, password: string): Promise<any> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');

    const response = await post('/users/login', { identifier, password });

    const { token, refreshToken } = response;

    if (!token || !refreshToken) {
      console.error('Сервер не вернул токены');
      throw new Error('Ошибка логина. Попробуйте снова.');
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response;
  } catch (error) {
    console.error('Ошибка логина:', (error as Error).message);
    throw error;
  }
};

// Функция регистрации пользователя
export const registerUser = async (code: string): Promise<any> => {
  try {
    const response = await post('/users/register', { code });

    const { token, refreshToken } = response;

    if (!token || !refreshToken) {
      console.error('Сервер не вернул токены');
      throw new Error('Ошибка регистрации. Попробуйте снова.');
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', (error as Error).message);
    throw error;
  }
};

// Функция для отправки кода смены пароля
export const sendResetPasswordCode = async (email: string): Promise<{ message: string; email: string }> => {
  try {
    const response = await post('/users/send-reset-password-code', { email });
    return { message: response.message, email }; // Возвращаем email
  } catch (error: any) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage === 'Пользователь не найден') {
      throw new Error('Пользователь не найден');
    }

    throw new Error('Ошибка при отправке кода для смены пароля. Попробуйте снова.');
  }
};

// Функция для смены пароля
export const changePassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<any> => {
  try {
    const response = await post('/users/change-password', { email, code, newPassword });
    return response;
  } catch (error: any) {
    const customError = handleError(error);
    if (customError) {
      throw new Error(customError);
    }
    throw new Error('Ошибка при смене пароля. Попробуйте снова.');
  }
};

export const validateActivationCode = async (code: string): Promise<any> => {
  try {
    const response = await post('/users/validate-code', { code });
    return response;
  } catch (error: any) {
    const customError = handleError(error);
    if (customError) {
      throw new Error(customError);
    }
    throw new Error('Произошла ошибка. Попробуйте снова.');
  }
};

export const updateUser = async (
  data: Record<string, any>,
  files?: FormData
): Promise<any> => {
  try {
    const formData = files || new FormData();

    // Добавляем текстовые данные в FormData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    const response = await patch('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error('Слишком много попыток');
    }
    const customError = handleError(error);
    if (customError) {
      throw new Error(customError);
    }
    throw new Error('Ошибка при обновлении данных. Попробуйте снова.');
  }
};

export const sendVerificationCode = async (email: string): Promise<any> => {
  return await patch('/users/send-code', { email });
};

export const verifyResetPasswordCode = async (email: string, code: string): Promise<any> => {
  try {
    console.log('Проверяем код смены пароля:', { email, code });
    const response = await post('/users/verify-reset-password-code', { email, code });
    console.log('Ответ от сервера на проверку кода:', response);
    return response;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Неверный или истёкший код смены пароля.');
    }
    if (error.response?.status === 404) {
      throw new Error('Пользователь не найден.');
    }
    throw error;
  }
};

export const verifyEmailCode = async (email: string, code: string): Promise<any> => {
  try {
    console.log('Отправляем запрос на проверку кода:', { email, code });
    const response = await post('/users/verify-code', { email, code });
    console.log('Ответ от сервера на проверку кода:', response);
    return response;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error('Слишком много попыток');
    }
    if (error.response?.data?.message === 'Неверный код подтверждения.') {
      throw new Error('Неверный код подтверждения.');
    }

    const customError = handleError(error);
    if (!customError) {
      console.log('Скрытая ошибка проверки кода');
    }

    throw error;
  }
};

export const blockUser = async (userId: string, isBlocked: boolean): Promise<any> => {
  return await post('/users/block', { userId, isBlocked });
};

export const checkUsername = async (username: string): Promise<any> => {
  return await post('/users/check-username', { username });
};

export const checkEmail = async (email: string): Promise<any> => {
  return await post('/users/check-email', { email });
};

export const checkPhone = async (phone: string): Promise<any> => {
  return await post('/users/check-phone', { phone });
};

export const checkVerificationStatus = async (): Promise<any> => {
  const token = await AsyncStorage.getItem('token'); // Получаем токен из AsyncStorage

  if (!token) {
    throw new Error('Токен отсутствует. Пожалуйста, авторизуйтесь.');
  }

  console.log('Используем токен:', token);

  const response = await api.post('/users/check-verify-status', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Ответ API:', response);

  // Возвращаем только данные ответа
  return response.data;
};

export const getUserProfile = async (): Promise<UserDataProps> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Токен отсутствует. Пожалуйста, авторизуйтесь.');
    }

    const response = await api.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data.user;

    // Логируем полученные данные
    console.log('Получены данные пользователя из API:', userData);

    return {
      id: userData._id, // Убедимся, что это поле возвращается
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      aboutMe: userData.aboutMe || 'Всем привет, меня зовут Катя, катаюсь на скейте и сноуборде, люблю вкусную еду)',
      username: userData.username || '',
      city: typeof userData.city === 'string' ? userData.city : userData.city?.name || 'Не указан', // Проверяем, строка или объект
      profileImage: userData.profileImage || '',
      backgroundImage: userData.backgroundImage || '',
      qrCode: userData.qrCode || '',
    };
  } catch (error: any) {
    console.error('Ошибка при получении данных пользователя:', error.message);
    throw error;
  }
};

export const getPublicProfile = async (userId: string): Promise<UserDataProps> => {
  try {
    console.log('Запрос данных профиля для ID:', userId);
    const response = await api.get(`/users/public-qr-code/${userId}`);
    const userData = response.data.user;

    console.log('Получены данные профиля:', userData);

    return {
      id: userData._id,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      aboutMe: userData.aboutMe || '',
      username: userData.username || '',
      city: typeof userData.city === 'string' ? userData.city : userData.city?.name || 'Не указан', // Проверяем, строка или объект
      profileImage: userData.profileImage || '',
      qrCode: userData.qrCodeLink || '',
    };
  } catch (error: any) {
    console.error('Ошибка при получении публичного профиля:', error.message);
    throw error;
  }
};

export const getUserProfileById = async (userId: string): Promise<UserDataProps> => {
  try {
    console.log('Запрос данных профиля для ID:', userId);
    const response = await api.get(`/users/profile/${userId}`);
    const userData = response.data.user;
    console.log('Получены данные профиля:', userData);

    return {
      id: userData._id,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      aboutMe: userData.aboutMe || 'Основатель магазина Скейтшоп SK8, в сфободное время фотографирую природу.',
      username: userData.username || '',
      city: typeof userData.city === 'string' ? userData.city : userData.city?.name || 'Не указан',
      profileImage: userData.profileImage || '',
      backgroundImage: userData.backgroundImage || '',
      rating: userData.rating || 0,
      subscribers: userData.subscribers || 0,
      isSubscribed: userData.isSubscribed || false,
    };
  } catch (error: any) {
    console.error('Ошибка при получении публичного профиля:', error.message);
    throw error;
  }
};

// Функция подписки на пользователя
export const subscribeToUser = async (userId: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Токен отсутствует. Пожалуйста, авторизуйтесь.');
    }

    const response = await api.post(`/users/subscribe/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Успешная подписка на пользователя ${userId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Ошибка при подписке на пользователя ${userId}:`, error.message);
    throw error;
  }
};

// Функция отписки от пользователя
export const unsubscribeFromUser = async (userId: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Токен отсутствует. Пожалуйста, авторизуйтесь.');
    }

    const response = await api.post(`/users/unsubscribe/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Успешная отписка от пользователя ${userId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Ошибка при отписке от пользователя ${userId}:`, error.message);
    throw error;
  }
};

export const checkIfSubscribed = async (userId: string): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return false;

    const response = await api.get(`/users/is-subscribed/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.isSubscribed;
  } catch (error: any) {
    console.error('Ошибка при проверке подписки:', error.message);
    return false; // В случае ошибки считаем, что не подписан
  }
};

// Обработка ошибок
export const handleError = (error: any): string | null => {
  if (error.response?.data?.message) {
    const serverMessage = error.response.data.message;

    const allowedMessages = [
      'Неверный активационный код.',
      'Неверный код подтверждения.',
      'Код обязателен.',
      'Email уже используется.',
      'Телефон уже используется.',
      'ID уже используется.',
      'Пользователь не найден',
    ];

    if (allowedMessages.includes(serverMessage)) {
      return serverMessage; // Возвращаем серверное сообщение
    }
  }

  console.log('Скрытая ошибка:', error.response?.data || error.message);
  return 'Произошла ошибка. Попробуйте снова.';
};

export default api;

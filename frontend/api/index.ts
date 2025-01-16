import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.65:5001/api';

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Метод для обновления токена
const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });
  await AsyncStorage.setItem('token', response.data.token);
  return response.data.token;
};

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
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

export const patch = async <T>(url: string, data: T): Promise<any> => {
  try {
    const response = await api.patch(url, data);
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

export const loginUser = async (identifier: string, password: string): Promise<any> => {
  try {
    console.log('Отправка данных на сервер:', { identifier, password });

    // Выполняем запрос
    const response = await post('/users/login', { identifier, password });

    console.log('Ответ от сервера:', response);

    // Сохраняем токен в хранилище, если он есть
    if (response.token) {
      console.log('Токен сохранён:', response.token);
      await AsyncStorage.setItem('token', response.token);
    } else {
      console.warn('Токен отсутствует в ответе сервера');
    }

    return response;
  } catch (error: any) {
    console.error('Ошибка при выполнении запроса:', error);

    // Обработка ошибок
    if (error.response?.status === 429) {
      throw new Error('Слишком много попыток');
    }
    if (error.response?.status === 404) {
      throw new Error('Аккаунт не существует');
    }
    if (error.response?.data?.message === 'Неверный логин или пароль') {
      throw new Error('Неверный логин или пароль');
    }

    // Если ошибка не соответствует описанным, выбрасываем её
    throw error;
  }
};

export const registerUser = async (code: string): Promise<any> => {
  try {
    const response = await post('/users/register', { code });
    if (response?.token) {
      await AsyncStorage.setItem('token', response.token);
    }
    if (response?.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  } catch (error: any) {
    const customError = handleError(error);
    if (customError) {
      throw new Error(customError);
    }
    throw new Error('Произошла ошибка. Попробуйте снова.');
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

export const updateUser = async (data: Record<string, any>): Promise<any> => {
  try {
    const response = await patch('/users/update', data);
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

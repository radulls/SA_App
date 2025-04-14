import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://89.108.118.249:5002/api/sos';
export const SOS_IMAGE_URL = 'http://89.108.118.249:5002/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export interface SosTag {
  _id: string;
  name: string;
}

// 📌 Получаем токен и передаём в заголовки
export const getAuthHeaders = async (): Promise<{ Authorization: string; userId: string }> => {
  const token = await AsyncStorage.getItem('token');

  if (!token) {
    console.error("❌ Ошибка: Токен отсутствует");
    throw new Error("Токен не найден. Авторизуйтесь заново.");
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadString = atob(payloadBase64);
    const payload = JSON.parse(payloadString);

    if (!payload || (!payload.id && !payload._id)) {
      throw new Error("❌ Ошибка: userId отсутствует в токене");
    }

    const userId = payload.id || payload._id;
    console.log("✅ userId успешно извлечён:", userId);

    return {  // ✅ Гарантированно возвращает объект
      Authorization: `Bearer ${token}`,
      userId,
    };
  } catch (error) {
    console.error("❌ Ошибка при декодировании токена:", error);
    throw new Error("Ошибка обработки токена. Авторизуйтесь заново.");
  }
};

// 📌 Создать SOS-сигнал
export const createSosSignal = async (sosData: FormData) => {
  const headers = await getAuthHeaders(); // Убедись, что `Authorization` есть

  return api.post('/create', sosData, {
    headers: {
      ...headers, 
      'Content-Type': 'multipart/form-data', // ❌ Не ставь `application/json`
    },
  });
};

// 📌 Обновить SOS-сигнал
export const updateSosSignal = async (sosId: string, sosData: FormData) => {
  const headers = await getAuthHeaders();

  return api.put(`/${sosId}`, sosData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 📌 Получить все SOS-сигналы
export const getSosSignals = async () => {
  return api.get('/');
};

// 📌 Получить конкретный SOS-сигнал
export const getSosSignalById = async (sosId: string) => {
  return api.get(`/${sosId}`);
};

export const getSosSignalByUserId = async (userId: string) => {
  try {
    console.log(`📡 Отправляем запрос в SOS-сервис: ${API_BASE_URL}/active?userId=${userId}`);
    
    const response = await api.get(`/active?userId=${userId}`);

    console.log("✅ Получен активный SOS-сигнал:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`У пользователя ${userId} нет активного SOS-сигнала.`);
      return null; // <== Возвращаем null, а не кидаем ошибку!
    }
    console.error("Ошибка при получении активного SOS-сигнала:", error);
    throw error;
  }
};

// 📌 Удалить SOS-сигнал
export const cancelSosSignal = async (sosId: string, reasonId: string) => {
  const headers = await getAuthHeaders();
  try {
    const response = await api.post(`/cancel/${sosId}`, { reasonId }, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка отмены SOS-сигнала:", error);
    throw new Error("Не удалось отменить SOS-сигнал");
  }
};

// 📌 Отметить помощь
export const markAsHelper = async (sosId: string) => {
  const headers = await getAuthHeaders();
  return api.post('/help', { sosId }, { headers });
};

// 📌 Получить помощников для SOS-сигнала
export const getSosHelpers = async (sosId: string): Promise<any> => {
  return api.get(`/helpers/${sosId}`);
};

// 📌 Проверить, является ли текущий пользователь помощником SOS-сигнала
export const isUserHelper = async (sosId: string): Promise<boolean> => {
  const headers = await getAuthHeaders();
  try {
    const response = await api.get(`/helpers/check/${sosId}`, { headers });
    return response.data.isHelper; // ✅ true/false
  } catch (error) {
    console.error("❌ Ошибка проверки помощника:", error);
    return false;
  }
};

// 📌 Получить теги SOS
export const getSosTags = async (): Promise<SosTag[]> => {
  try {
    const response = await api.get<SosTag[]>('/tags');
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки SOS-тэгов:', error);
    throw new Error('Не удалось загрузить SOS-тэги');
  }
};

// 📌 Получить список причин отмены SOS-сигнала
export const getCancellationReasons = async () => {
  try {
    const response = await api.get('/cancellation-reasons');
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки причин отмены:', error);
    throw new Error('Не удалось загрузить причины отмены');
  }
};

export const confirmHelpers = async (sosId: string, helpers: string[]) => {
  const headers = await getAuthHeaders();
  return api.post('/confirm-helpers', { sosId, helpers }, { headers });
};

// 📌 Отмена участия в SOS-сигнале
export const leaveSosSignal = async (sosId: string) => {
  const headers = await getAuthHeaders();
  try {
    const response = await api.post('/leave', { sosId }, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка выхода из SOS-сигнала:", error);
    throw new Error("Не удалось выйти из SOS-сигнала");
  }
};

// 📌 Проверка доступа к созданию SOS-сигнала
export const checkSosAccess = async () => {
  const headers = await getAuthHeaders();
  try {
    const response = await api.get('/check-access', { headers });
    console.log("📡 ✅ Ответ сервера:", response.data);
    return response.data;
  } catch (error: any) {
    // console.error("❌ Ошибка при проверке доступа к SOS:", error);

    // Если сервер вернул 403, но в `response.data` есть информация, возвращаем её
    if (error.response && error.response.status === 403) {
      console.log("🔄 Обрабатываем 403:", error.response.data);
      return error.response.data;
    }
    return { access: false, message: "Ошибка загрузки доступа" };
  }
};

export const createSosTag = async (name: string): Promise<SosTag> => {
  const headers = await getAuthHeaders();

  try {
    const response = await api.post('/tags', { name }, { headers });
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании SOS-тега:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Не удалось создать тег');
  }
};

export const deleteSosTag = async (tagId: string) => {
  const headers = await getAuthHeaders();

  console.log("📤 Отправка DELETE запроса на удаление тега:", tagId);

  const response = await api.delete(`/tags/${tagId}`, {
    headers
  });

  console.log("📥 Ответ от сервера после удаления тега:", response.data);
  return response.data;
};


export default api;
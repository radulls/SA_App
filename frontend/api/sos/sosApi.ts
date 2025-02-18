import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.3.16:5002/api/sos';
export const SOS_IMAGE_URL = 'http://192.168.3.16:5002/';

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

// 📌 Получить все SOS-сигналы
export const getSosSignals = async () => {
  return api.get('/');
};

// 📌 Получить конкретный SOS-сигнал
export const getSosSignalById = async (sosId: string) => {
  return api.get(`/${sosId}`);
};

// 📌 Удалить SOS-сигнал
export const deleteSosSignal = async (sosId: string) => {
  const headers = await getAuthHeaders();
  return api.delete(`/${sosId}`, { headers });
};

// 📌 Отметить помощь
export const markAsHelper = async (sosId: string) => {
  const headers = await getAuthHeaders();
  return api.post('/help', { sosId }, { headers });
};

// 📌 Получить помощников для SOS-сигнала
export const getSosHelpers = async (sosId: string) => {
  return api.get(`/helpers/${sosId}`);
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

export default api;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EventData {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  cover?: string;
  photos: string[];
  hashtags: string[];
  mentions: string[];
  likes: string[];
  isPinned: boolean;
  isDeleted: boolean;
  from: 'user' | 'subdivision';
  subdivisionId?: string;
  isFree: boolean;
  price?: number;
  isOnline: boolean;

  subdivision?: {
    city?: string;
  };

  // ✅ Обновлённый формат локации
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  // Дата и время
  startDateTime: string;
  endDateTime: string;

  // ✅ Участники
  participants?: string[]; // массив userId участников

  // Партнёры
  partnersUsers: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  }[];

  partnersMarkets: {
    _id: string;
    name: string;
    avatar?: string;
  }[];

  createdAt: string;
  updatedAt: string;

  // Дополнительно
  user?: {
    city?: string;
    username: string;
    profileImage?: string;
    firstName?: string;
    lastName?: string;
    hideLastName?: boolean;
  };
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  hashtags?: string[];
  mentions?: string[];
  photos?: File[];
  cover?: string | File;
  from?: 'user' | 'subdivision';
  subdivisionId?: string;
  isOnline: boolean;
  address?: string;
  startDateTime: string;
  endDateTime: string;
  isFree: boolean;
  price?: number;
  partnersUsers?: string[];
  partnersMarkets?: string[];
}

export interface UpdateEventPayload extends CreateEventPayload {
  existingPhotos?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
}

const eventApi = axios.create({
  baseURL: 'http://89.108.118.249:5003/api',
});
export const EVENT_IMAGE_URL = 'http://89.108.118.249:5003';

eventApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Получить все мероприятия
export const getAllEvents = async (): Promise<EventData[]> => {
  const response = await eventApi.get('/events');
  return response.data;
};

// ✅ Получить мероприятия пользователя
export const getEventsByUser = async (userId: string): Promise<EventData[]> => {
  const response = await eventApi.get(`/events/user/${userId}`);
  return response.data;
};

// ✅ Создать мероприятие
export const createEvent = async (formData: FormData): Promise<any> => {
  console.log('Функция createEvent вызвана с данными:', formData);
  const response = await eventApi.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ✅ Обновить мероприятие
export const updateEvent = async (eventId: string, data: UpdateEventPayload): Promise<EventData> => {
  const formData = new FormData();

  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.hashtags) formData.append('hashtags', JSON.stringify(data.hashtags));
  if (data.mentions) formData.append('mentions', JSON.stringify(data.mentions));
  if (data.existingPhotos) formData.append('existingPhotos', JSON.stringify(data.existingPhotos));
  if (data.from) formData.append('from', data.from);
  if (data.subdivisionId) formData.append('subdivisionId', data.subdivisionId);
  formData.append('isOnline', String(data.isOnline));

  // 🧭 Локация, если офлайн
  if (!data.isOnline && data.location) {
    formData.append('address', data.location.address);
    formData.append('latitude', String(data.location.latitude));
    formData.append('longitude', String(data.location.longitude));
  }

  formData.append('startDateTime', data.startDateTime);
  formData.append('endDateTime', data.endDateTime);
  formData.append('isFree', String(data.isFree));
  if (!data.isFree && data.price !== undefined) formData.append('price', String(data.price));
  if (data.partnersUsers) formData.append('partnersUsers', JSON.stringify(data.partnersUsers));
  if (data.partnersMarkets) formData.append('partnersMarkets', JSON.stringify(data.partnersMarkets));

  // 📷 Фото
  data.photos?.forEach(photo => {
    formData.append('photos', photo);
  });

  // 🖼️ Обложка
  if (data.cover && typeof data.cover !== 'string') {
    formData.append('cover', data.cover);
  }

  const response = await eventApi.put(`/events/${eventId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.event;
};


// ✅ Удалить мероприятие
export const deleteEvent = async (eventId: string) => {
  const response = await eventApi.delete(`/events/${eventId}`);
  return response.data;
};

// ✅ Лайк / дизлайк
export const toggleLikeEvent = async (eventId: string) => {
  const response = await eventApi.post(`/events/${eventId}/like`, {});
  return response.data;
};

// ✅ Закрепить / открепить
export const togglePinEvent = async (eventId: string) => {
  const response = await eventApi.post(`/events/${eventId}/pin`, {});
  return response.data;
};

// ✅ Пожаловаться на мероприятие
export const reportEvent = async (eventId: string, topicId: string) => {
  const response = await eventApi.post('/events/report', {
    targetId: eventId,
    topicId,
  });
  return response.data;
};

// ✅ Получить мероприятие по ID
export const getEventById = async (eventId: string): Promise<EventData> => {
  const response = await eventApi.get(`/events/${eventId}`);
  return response.data;
};

// ✅ Участвовать / выйти
export const toggleParticipationEvent = async (eventId: string) => {
  const response = await eventApi.post(`/events/${eventId}/participate`, {});
  return response.data; // желательно { message, participantsCount }
};

// ✅ Получить участников мероприятия
export const getEventParticipants = async (eventId: string) => {
  const response = await eventApi.get(`/events/${eventId}/participants`);
  return response.data;
};


export default eventApi;

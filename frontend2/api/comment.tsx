import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const commentApi = axios.create({
  baseURL: 'http://89.108.118.249:5003/api/comments',
});

commentApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Получить все комментарии к посту
export const getCommentsByPost = async (postId: string) => {
  const response = await commentApi.get(`/${postId}`);
  return response.data;
};

// ➕ Создать комментарий (или ответ)
export const createComment = async (postId: string, text: string, parentCommentId?: string) => {
  const response = await commentApi.post(`/${postId}`, {
    text,
    ...(parentCommentId ? { parentCommentId } : {}),
  });
  return response.data;
};

// ✏️ Обновить комментарий
export const updateComment = async (commentId: string, text: string) => {
  const response = await commentApi.put(`/edit/${commentId}`, { text });
  return response.data;
};

// 🗑 Удалить комментарий (soft delete)
export const deleteComment = async (commentId: string) => {
  const response = await commentApi.delete(`/delete/${commentId}`);
  return response.data;
};

// ❤️ Лайк / дизлайк комментария
export const toggleLikeComment = async (commentId: string) => {
  const response = await commentApi.post(`/like/${commentId}`);
  return response.data;
};

// 🚨 Пожаловаться на комментарий
export const reportComment = async (commentId: string, topicId: string) => {
  console.log('📡 reportComment URL:', commentApi.defaults.baseURL + '/report');
  console.log('📨 reportComment API вызван с:', { commentId, topicId });
  const response = await commentApi.post('/report', {
    targetId: commentId, 
    topicId,  
  });
  return response.data;
};
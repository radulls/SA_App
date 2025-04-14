import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PostData {
	videoPreviews: any;
  _id: string;
  userId: string;
  description?: string;
  photos: string[];
  videos: string[];
  hashtags: string[];
  mentions: string[];
  likes: string[];
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  // Добавляем ↓
  user?: {
    username: string;
    profileImage?: string;
  };
}


export interface CreatePostPayload {
  description?: string;
  hashtags?: string[];
  mentions?: string[];
  photos?: File[];
  videos?: File[];
}

export interface UpdatePostPayload extends CreatePostPayload {
  existingPhotos?: string[];
  existingVideos?: string[];
}

// 🔥 Создаём отдельный инстанс API для постов (порт 5003)
const postApi = axios.create({
  baseURL: 'http://89.108.118.249:5003/api',
});
export const POST_IMAGE_URL = 'http://89.108.118.249:5003';


postApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Получить все посты
export const getAllPosts = async (filters?: { description?: string; hashtag?: string }): Promise<PostData[]> => {
  const params = new URLSearchParams(filters || {}).toString();
  const response = await postApi.get(`/posts${params ? `?${params}` : ""}`);
  return response.data;
};

// ✅ Получить посты пользователя
export const getPostsByUser = async (userId: string): Promise<PostData[]> => {
  try {
    console.log("📡 Запрос постов пользователя с ID:", userId);
    const response = await postApi.get(`/posts/user/${userId}`);
    console.log("✅ Полученные посты:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при получении постов пользователя:", error.message);
    throw error;
  }
};  
 
// ✅ Создать пост
export const createPost = async (formData: FormData): Promise<any> => {
  try {
    const response = await postApi.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при создании поста:', error.message);
    throw error;
  }
};

// ✅ Обновить пост
export const updatePost = async (postId: string, data: UpdatePostPayload): Promise<PostData> => {
  const formData = new FormData();

  if (data.description) formData.append("description", data.description);
  if (data.hashtags) formData.append("hashtags", JSON.stringify(data.hashtags));
  if (data.mentions) formData.append("mentions", JSON.stringify(data.mentions));
  if (data.existingPhotos) formData.append("existingPhotos", JSON.stringify(data.existingPhotos));
  if (data.existingVideos) formData.append("existingVideos", JSON.stringify(data.existingVideos));
  data.photos?.forEach(file => formData.append("photos", file));
  data.videos?.forEach(file => formData.append("videos", file));

  const response = await postApi.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.post;
};

// ✅ Удалить пост (soft-delete)
export const deletePost = async (postId: string) => {
  const response = await postApi.delete(`/posts/${postId}`);
  return response.data;
};

// ✅ Лайк / дизлайк поста
export const toggleLikePost = async (postId: string) => {
  const response = await postApi.post(`/posts/${postId}/like`, {});
  return response.data;
};

// ✅ Закрепить / открепить пост
export const togglePinPost = async (postId: string) => {
  const response = await postApi.post(`/posts/${postId}/pin`, {});
  return response.data;
};

export const reportPost = async (postId: string, topicId: string) => {
  const response = await postApi.post('/posts/report', {
    targetId: postId,
    topicId,
  });
  return response.data;
};
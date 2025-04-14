import { MarketDataProps } from "@/types/market";
import api, { UserDataProps, get, patch, post, del, put } from ".";

import { Subdivision } from '@/types/subdivision'; // если типы вынесены
import { SubdivisionAdminPermissions } from "@/types/subdivisionAdmin";

export interface UserStatsProps {
  sosPublished: number;
  sosResponses: number;
  connectedUsers: number;
  generalTasks: number;
  generalHelp: number;
  marketDeals: number;
  signalFire: number;
  sporterGreetings: number;
  complaintMentions: number;
  awards: number;
}

export interface FreezeDataProps {
  _id: string;
  entityId: string;
  entityType: "user" | "market";
  frozenActions: string[];
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface FreezeStatsProps {
  totalFreezes: number;
  activeFreezes: number;
  actionsStats: {
    sos: { active: number; past: number };
    market: { active: number; past: number };
  };
}

export interface DeleteReasonProps {
  _id: string;
  name: string;
}

export interface TopUserProps {
  id: string;
  username: string;
  rating: number;
  generalTasks: number;
  sosResponses: number;
}

export interface MonthlyTopUsersResponse {
  topByRating: TopUserProps[];
  topByTasks: TopUserProps[];
  topBySOS: TopUserProps[];
}

export interface UserMatchResult {
  emailMatches: number;
  phoneMatches: number;
  nameMatches: number;
  totalMatches: number;
}

// ✅ Получение полных данных пользователя (только для админа или создателя)
export const getUserData = async (userId: string): Promise<UserDataProps> => {
  try {
    const response = await get(`/admin/users/${userId}`);
    return response.user;
  } catch (error: any) {
    console.error("Ошибка при получении данных пользователя:", error.message);
    throw error;
  }
};

// ✅ Получение данных пользователя для верификации
export const getUserVerificationData = async (userId: string): Promise<UserDataProps> => {
  try {
    const response = await get(`/admin/users/${userId}/verification`);
    return response.user;
  } catch (error: any) {
    console.error("Ошибка при получении данных для верификации:", error.message);
    throw error;
  }
};

// ✅ Обновление статуса верификации
export const updateUserVerificationStatus = async (
  userId: string,
  status: string,
  rejectionReason?: string
) => {
  const payload: any = { status };

  if (status === 'rejected') {
    payload.rejectionReason = rejectionReason || '';
  }

  try {
    const response = await patch(`/admin/users/${userId}/verification`, payload);
    return response;
  } catch (error: any) {
    console.error("Ошибка при обновлении статуса пользователя:", error.message);
    throw error;
  }
};

// ✅ Получение статистики пользователя
export const getUserStats = async (userId: string): Promise<UserStatsProps> => {
  try {
    const response = await get(`/admin/users/${userId}/stats`);
    return response.stats;
  } catch (error: any) {
    console.error("Ошибка при получении статистики пользователя:", error.message);
    throw error;
  }
};

// ✅ Получение списка активных заморозок пользователя
export const getUserFreezes = async (userId: string): Promise<FreezeDataProps[]> => {
  try {
    const response = await get(`/admin/freeze/user/${userId}`);
    return response;
  } catch (error: any) {
    console.error("Ошибка при получении заморозок пользователя:", error.message);
    throw error;
  }
};

// ✅ Заморозка пользователя
export const freezeUser = async (userId: string, frozenActions: string[], duration: number, reason?: string) => {
  try {
    console.log("📡 Отправляем запрос на сервер:", { userId, frozenActions, duration, reason });

    const response = await post(`/admin/freeze`, {
      entityId: userId,
      entityType: "user",
      frozenActions,
      duration,
      reason,
    });

    console.log("✅ Ответ от сервера:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Ошибка при заморозке пользователя:", error.message);
    throw error;
  }
};

// ✅ Разморозка пользователя (удаление записи о заморозке)
export const unfreezeUser = async (freezeId: string) => {
  try {
    const response = await del(`/admin/freeze/${freezeId}`);
    return response;
  } catch (error: any) {
    console.error("Ошибка при разморозке пользователя:", error.message);
    throw error;
  }
};

// ✅ Проверка, заморожено ли действие у пользователя
export const checkUserFreeze = async (userId: string, action: string): Promise<boolean> => {
  try {
    const response = await get(`/admin/freeze/user/${userId}/${action}`);
    return response.frozen;
  } catch (error: any) {
    console.error("Ошибка при проверке статуса заморозки:", error.message);
    throw error;
  }
};

// ✅ Получение статистики заморозок пользователя
export const getUserFreezeStats = async (userId: string): Promise<FreezeStatsProps> => {
  try {
    const response = await get(`/admin/users/${userId}/freeze-stats`);
    return response;
  } catch (error: any) {
    console.error("Ошибка при получении статистики заморозок:", error.message);
    throw error;
  }
};

// ✅ Получение списка причин удаления аккаунта
export const getDeleteAccountReasons = async (): Promise<DeleteReasonProps[]> => {
  const url = `/admin/delete/topics`;
  console.log("📡 [getDeleteAccountReasons] Отправляем GET-запрос на:", url);
  try {
    const response = await get(url);
    console.log("✅ [getDeleteAccountReasons] Ответ от сервера:", response);
    return response;
  } catch (error: any) {
    console.error("❌ [getDeleteAccountReasons] Ошибка при получении причин удаления:", error.message);
    throw error;
  }
};

// ✅ Удаление пользователя или маркета с указанием причины
export const deleteEntity = async (entityId: string, entityType: "user" | "market", reasonId: string) => {
  try {
    const url = `/admin/delete/${entityType}/${entityId}`;
    console.log("📡 [deleteEntity] POST", url, "BODY:", { reasonId });

    const response = await post(url, { reasonId });
    console.log("✅ Ответ от сервера:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Ошибка при удалении:", error.message);
    throw error;
  }
};

export const getMarketByUserId = async (userId: string): Promise<MarketDataProps | null> => {
  try {
    const response = await get(`/admin/market/by-user/${userId}`);
    return {
      ...response.market,
      id: response.market._id, // обязательно
    };
  } catch (error: any) {
    console.error("Ошибка при получении маркета по userId:", error.message);
    return null;
  }
};

// ✅ Получение топ-3 пользователей месяца
export const getMonthlyTopUsers = async (): Promise<MonthlyTopUsersResponse> => {
  try {
    const response = await get('/admin/top-users');
    return response;
  } catch (error: any) {
    console.error("Ошибка при получении топ-3 пользователей:", error.message);
    throw error;
  }
};

/**
 * Обновление подразделения
 * @param subdivisionId ID подразделения
 * @param updates Обновляемые поля
 * @returns Обновленное подразделение
 */
export const updateSubdivision = async (
  subdivisionId: string,
  data: Record<string, any>,
  files?: FormData
): Promise<any> => {
  try {
    const formData = files || new FormData();

    // Добавляем текстовые данные
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    const response = await patch(`/admin/subdivisions/${subdivisionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error: any) {
    console.error('❌ Ошибка в updateSubdivision:', error);
    throw error;
  }
};

/**
 * Создание нового подразделения
 * @param params Параметры для создания подразделения
 * @returns Созданное подразделение
 */
export const createSubdivision = async (params: {
  cityId: string;
  group: string; // теперь принимаем любую группу
  description?: string;
  avatar?: string;
}): Promise<Subdivision> => {
  try {
    const response = await post('/admin/subdivisions', params);
    return response.subdivision;
  } catch (error: any) {
    console.error('Ошибка при создании подразделения:', error.message);
    throw error;
  }
};

/**
 * Удаление подразделения
 * @param subdivisionId ID подразделения
 * @returns Результат удаления
 */
export const deleteSubdivision = async (subdivisionId: string): Promise<void> => {
  try {
    await del(`/admin/subdivisions/${subdivisionId}`);
  } catch (error: any) {
    console.error('Ошибка при удалении подразделения:', error.message);
    throw error;
  }
};

/**
 * Получение списка всех подразделений
 * @returns Массив подразделений
 */
export const getAllSubdivisions = async (): Promise<Subdivision[]> => {
  try {
    const response = await get('/admin/subdivisions');
    return response.subdivisions;
  } catch (error: any) {
    console.error('Ошибка при получении подразделений:', error.message);
    throw error;
  }
};

/**
 * Получение подразделений для конкретного города
 * @param cityId ID города
 * @returns Массив подразделений города
 */
export const getSubdivisionsByCity = async (cityId: string): Promise<Subdivision[]> => {
  try {
    const response = await get(`/admin/subdivisions/city/${cityId}`);
    return response.subdivisions;
  } catch (error: any) {
    console.error('Ошибка при получении подразделений города:', error.message);
    throw error;
  }
};

/**
 * Получение конкретного подразделения по ID
 * @param subdivisionId ID подразделения
 * @returns Подразделение или null если не найдено
 */
export const getSubdivisionById = async (subdivisionId: string): Promise<Subdivision | null> => {
  try {
    const allSubdivisions = await getAllSubdivisions();
    return allSubdivisions.find(sub => sub._id === subdivisionId) || null;
  } catch (error: any) {
    console.error('Ошибка при получении подразделения:', error.message);
    throw error;
  }
};

export const addSubdivisionAdmin = async (params: {
  subdivisionId: string;
  userId: string;
  permissions: SubdivisionAdminPermissions;
}) => {
  try {
    const response = await post('/admin/subdivisions/admins', params);
    return response.admin;
  } catch (error: any) {
    console.error('Ошибка при добавлении админа:', error.message);
    throw error;
  }
};

export const updateSubdivisionAdmin = async (
  adminId: string,
  permissions: SubdivisionAdminPermissions
) => {
  try {
    const response = await patch(`/admin/subdivisions/admins/${adminId}`, { permissions });
    return response.admin;
  } catch (error: any) {
    console.error('Ошибка при обновлении прав админа:', error.message);
    throw error;
  }
};

export const removeSubdivisionAdmin = async (adminId: string) => {
  try {
    const response = await del(`/admin/subdivisions/admins/${adminId}`);
    return response;
  } catch (error: any) {
    console.error('Ошибка при удалении админа:', error.message);
    throw error;
  }
};

export const getSubdivisionAdminByUserId = async (subdivisionId: string, userId: string) => {
  const res = await get(`/admin/subdivisions/${subdivisionId}/admin/${userId}`);
  return res?.admin;
};


export const getUserMatches = async (userId: string): Promise<UserMatchResult> => {
  try {
    const response = await get(`/admin/users/${userId}/matches`);
    return response.matches;
  } catch (error: any) {
    console.error("Ошибка при получении совпадений:", error.message);
    throw error;
  }
};

export const getUserMatchesDetailed = async (userId: string): Promise<UserDataProps[]> => {
  try {
    const response = await get(`/admin/users/${userId}/matches/detailed`);
    return response.users;
  } catch (error: any) {
    console.error("Ошибка при получении детальных совпадений:", error.message);
    throw error;
  }
};

/**
 * Создание нового купона
 * @param data Данные купона
 * @param imageFile (необязательно) файл изображения
 */
export const createCoupon = async (formData: FormData): Promise<void> => {
  try {
    console.log('🚀 Отправляем formData на сервер...');
    const res = await post('/admin/coupons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Ответ от сервера:', res);
  } catch (error: any) {
    console.error('❌ Ошибка при отправке купона:', error);
    throw error;
  }
};

/**
 * Обновление статуса купона
 * @param couponId ID купона
 * @param status Новый статус (active | assigned | archived)
 */
export const updateCouponStatus = async (
  couponId: string,
  status: 'active' | 'assigned' | 'archived'
): Promise<any> => {
  try {
    const response = await patch(`/admin/coupons/${couponId}/status`, { status });
    return response;
  } catch (error: any) {
    console.error('Ошибка при обновлении статуса купона:', error.message);
    throw error;
  }
};

/**
 * Удаление купона
 * @param couponId ID купона
 */
export const deleteCoupon = async (couponId: string): Promise<void> => {
  try {
    await del(`/admin/coupons/${couponId}`);
  } catch (error: any) {
    console.error('Ошибка при удалении купона:', error.message);
    throw error;
  }
};

export const getAllCoupons = async (): Promise<any[]> => {
  try {
    const res = await get('/admin/coupons');
    return res.coupons;
  } catch (error) {
    console.error('Ошибка при получении всех купонов:', error);
    return [];
  }
};

export const getCouponsBySubdivision = async (subdivisionId: string): Promise<any[]> => {
  try {
    const res = await get(`/admin/coupons/subdivision/${subdivisionId}`);
    return res.coupons;
  } catch (error) {
    console.error('Ошибка при получении купонов подразделения:', error);
    return [];
  }
};

export const getAssignedCoupons = async (userId: string): Promise<any[]> => {
  try {
    const res = await get(`/admin/coupons/assigned/${userId}`);
    return res.coupons;
  } catch (error) {
    console.error('Ошибка при получении назначенных купонов:', error);
    return [];
  }
};

export const assignCoupon = async (couponId: string, userId: string): Promise<any> => {
  try {
    const res = await post(`/admin/coupons/${couponId}/assign`, { userId });
    return res;
  } catch (error) {
    console.error('Ошибка при назначении купона:', error);
    throw error;
  }
};

// Получить купоны по пользователю
export const getCouponsByUser = async (userId: string): Promise<any[]> => {
  const res = await get(`/admin/coupons/user/${userId}`);
  return res.coupons;
};
import api, { UserDataProps, get } from ".";

export const getUserVerificationData = async (userId: string): Promise<UserDataProps> => {
  try {
    console.log('Запрос верификационных данных для ID:', userId);

    const response = await get(`/admin/users/${userId}/verification`); // Используем `get`
    return response.user;
  } catch (error: any) {
    console.error('Ошибка при получении данных для верификации:', error.message);
    throw error;
  }
};

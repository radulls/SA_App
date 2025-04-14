import { City } from "@/types/city";
import api, { UserDataProps, get, patch, post, del } from ".";

// Получение всех городов
export const getAllCities = async (): Promise<City[]> => {
  try {
    const response = await get('/cities');
    return response || []; // просто возвращаем response, так как это уже массив
  } catch (error: any) {
    console.error('Ошибка при получении городов:', error.message);
    return [];
  }
};

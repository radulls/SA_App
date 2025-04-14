import { MarketDataProps } from "@/types/market";
import { get, post, patch, del, UserDataProps } from ".";

// ✅ Правильный тип userId — строка (ID)
// export interface MarketDataProps {
//   id: string;
//   _id?: string;
//   userId: UserDataProps; 
//   name: string;
//   ogrn: string;
//   links: string[];
//   loyalty: number;
//   completedDeals: number;
//   createdAt: string;
//   verificationStatus?: string;

//   marketPhoto?: string; // ✅ Фото маркета (логотип)
//   backgroundMarketPhoto?: string; // ✅ Фон карточки

//   user?: UserDataProps; // 👈 вручную загружаемый пользователь (если нужно)
// }

// ✅ Получение всех бизнесов
export const getAllMarkets = async (): Promise<MarketDataProps[]> => {
  try {
    const response = await get(`/markets`);
    return response.markets;
  } catch (error: any) {
    console.error('Ошибка при получении всех бизнесов:', error.message);
    throw error;
  }
};

// ✅ Получение данных конкретного бизнеса
export const getMarketById = async (marketId: string): Promise<MarketDataProps> => {
  try {
    const response = await get(`/markets/${marketId}`);
    return response.market;
  } catch (error: any) {
    console.error('Ошибка при получении бизнеса:', error.message);
    throw error;
  }
};

// ✅ Создание нового бизнеса
export const createMarket = async (data: Omit<MarketDataProps, "id" | "createdAt">) => {
  try {
    const response = await post(`/markets`, data);
    return response;
  } catch (error: any) {
    console.error('Ошибка при создании бизнеса:', error.message);
    throw error;
  }
};

// ✅ Обновление данных бизнеса
export const updateMarket = async (marketId: string, data: Partial<MarketDataProps>) => {
  try {
    const response = await patch(`/markets/${marketId}`, data);
    return response;
  } catch (error: any) {
    console.error('Ошибка при обновлении бизнеса:', error.message);
    throw error;
  }
};

// ✅ Удаление бизнеса
export const deleteMarket = async (marketId: string) => {
  try {
    const response = await del(`/markets/${marketId}`);
    return response;
  } catch (error: any) {
    console.error('Ошибка при удалении бизнеса:', error.message);
    throw error;
  }
};

// marketApi.ts
export const updateMarketVerificationStatus = async (
  marketId: string,
  status: 'verified' | 'rejected' | 'blocked',
  rejectionReason?: string
) => {
  try {
    const response = await patch(`/admin/markets/${marketId}/verification`, { status, rejectionReason });
    return response.market;
  } catch (error: any) {
    console.error('Ошибка при обновлении статуса маркета:', error.message);
    throw error;
  }
};

export { MarketDataProps };

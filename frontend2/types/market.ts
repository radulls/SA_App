import { UserDataProps } from "@/api";

export interface MarketDataProps {
  _id: string;
  name: string;
  verificationStatus: 'not_verified' | 'pending' | 'verified' | 'rejected' | 'blocked';
  ogrn: string;
  links: string[];
  loyalty: number;
  completedDeals: number;
  createdAt: string;
  marketPhoto?: string;
  backgroundMarketPhoto?: string;
  userId: string | UserDataProps; // ⚠️ нужно разрешить оба типа
  city: string | { _id: string; name: string };
  id?: string; // <-- добавь временно для фронта
}

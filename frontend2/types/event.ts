export type FullEventData = {
  title: string;
  description: string;
  cover?: string; 
  photos: string[];
  isOnline: boolean;

  // 🔁 Заменяем address на location
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;

  isFree: boolean;
  price: string;

  subdivisionId: string[];
  partners: { type: 'user' | 'market'; id: string }[];

  settings: {
    target: 'self' | 'subdivision';
    from: 'user' | 'subdivision';
    isEmergency: boolean;
    cityId: string | null;
    group: string | null;
  };
};

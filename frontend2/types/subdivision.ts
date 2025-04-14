export interface Subdivision {
  _id: string;
  city: {
    _id: string;
    name: string;
  };
  group: 'Основа' | 'Трибуна' | 'Дружина';
  creator: {
    _id: string;
    username: string;
  };
  admins: { _id: string; username: string }[];
  members: (string | { _id: string })[];
  pendingRequests: (string | { _id: string })[];
  markets?: (string | { _id: string })[];

  avatar?: string;
  sharedAvatar?: string; // ✅ добавь это поле
  description?: string;
}

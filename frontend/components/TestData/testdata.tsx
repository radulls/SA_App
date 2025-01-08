export interface UserDataProps {
  subs: number;
  rating: number;
  status?: 'active' | 'verification_request' | 'inactive';
  city?: string;
  first_name?: string;
  last_name?: string;
  id_login?: string;
  intro?: string;
}

export const mockUser: UserDataProps = {
  subs: 120,
  rating: 95,
  status: 'verification_request',
  city: 'Воронеж',
  first_name: 'Светлана',
  last_name: 'Чигрина',
  id_login: 'svetik',
  intro: 'Всем привет, меня зовут Катя, катаюсь на скейте и сноуборде, люблю вкусную еду)',
};
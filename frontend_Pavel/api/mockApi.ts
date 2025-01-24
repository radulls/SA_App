import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock storage for simulating AsyncStorage
const mockStorage: Record<string, string> = {};

AsyncStorage.setItem = async (key: string, value: string) => {
  mockStorage[key] = value;
  console.log(`Mock AsyncStorage setItem: ${key} = ${value}`);
};

AsyncStorage.getItem = async (key: string) => {
  console.log(`Mock AsyncStorage getItem: ${key}`);
  return mockStorage[key];
};

AsyncStorage.removeItem = async (key: string) => {
  delete mockStorage[key];
  console.log(`Mock AsyncStorage removeItem: ${key}`);
};

export const get = async (url: string): Promise<any> => {
  console.log(`Mock GET request to ${url}`);
  // Верните фиктивные данные, которые подойдут для вашего компонента
  if (url === '/cities') {
    return [
      { _id: '1', name: 'Москва' },
      { _id: '2', name: 'Санкт-Петербург' },
      { _id: '3', name: 'Новосибирск' },
    ];
  }
  return [];
};

// Mock user data
export const mockUserData = {
  id: '1',
  firstName: 'Иван',
  lastName: 'Иванов',
  aboutMe: 'Всем привет! Я Ваня.',
  username: 'ivan_snow',
  city: 'Москва',
  subscribers: '99',
  rating: '20.5',
  profileImage: require('../assets/profile/profile.jpg'), // Локальный путь
  backgroundImage: require('../assets/profile/background.jpg'), // Локальный путь
  qrCode: require('../assets/profile/qr-code.png'), // Локальный путь
};

 // Экспортируем по умолчанию


// Mock API functions
export const registerUser = async (code: string): Promise<any> => {
  console.log(`Mock registerUser called with code: ${code}`);
  return { userId: 'mockUserId', token: 'mockToken', refreshToken: 'mockRefreshToken' };
};

export const loginUser = async (identifier: string, password: string): Promise<any> => {
  console.log(`Mock loginUser called with identifier: ${identifier}, password: ${password}`);
  await AsyncStorage.setItem('token', 'mockToken');
  await AsyncStorage.setItem('refreshToken', 'mockRefreshToken');
  return { token: 'mockToken', refreshToken: 'mockRefreshToken' };
};

export const refreshToken = async (): Promise<string> => {
  console.log(`Mock refreshToken called`);
  await AsyncStorage.setItem('token', 'newMockToken');
  return 'newMockToken';
};

export const updateUser = async (data: Record<string, any>, files?: FormData): Promise<any> => {
  console.log(`Mock updateUser called with data:`, data);
  return { success: true, user: { ...mockUserData, ...data } };
};

export const sendVerificationCode = async (email: string): Promise<any> => {
  console.log(`Mock sendVerificationCode called with email: ${email}`);
  return { success: true };
};

export const verifyEmailCode = async (email: string, code: string): Promise<any> => {
  console.log(`Mock verifyEmailCode called with email: ${email} and code: ${code}`);
  return { success: true };
};

export const sendResetPasswordCode = async (email: string): Promise<{ message: string; email: string }> => {
  console.log(`Mock sendResetPasswordCode called with email: ${email}`);
  return { message: 'Код отправлен', email };
};

export const changePassword = async (email: string, code: string, newPassword: string): Promise<any> => {
  console.log(`Mock changePassword called with email: ${email}, code: ${code}, newPassword: ${newPassword}`);
  return { success: true };
};

export const validateActivationCode = async (code: string): Promise<any> => {
  console.log(`Mock validateActivationCode received code: "${code}"`);
  return { success: true }; // Успех для любого кода
};


export const getUserProfile = async (): Promise<any> => {
  console.log(`Mock getUserProfile called`);
  return mockUserData;
};

export const getPublicProfile = async (userId: string): Promise<any> => {
  console.log(`Mock getPublicProfile called with userId: ${userId}`);
  return { ...mockUserData, id: userId };
};

export const blockUser = async (userId: string, isBlocked: boolean): Promise<any> => {
  console.log(`Mock blockUser called with userId: ${userId}, isBlocked: ${isBlocked}`);
  return { success: true };
};

export const checkUsername = async (username: string): Promise<any> => {
  console.log(`Mock checkUsername called with username: ${username}`);
  return { available: username !== 'taken_username' };
};

export const checkEmail = async (email: string): Promise<any> => {
  console.log(`Mock checkEmail called with email: ${email}`);
  return { available: email !== 'taken@example.com' };
};

export const checkPhone = async (phone: string): Promise<any> => {
  console.log(`Mock checkPhone called with phone: ${phone}`);
  return { available: phone !== '+123456789' };
};

export const checkVerificationStatus = async (): Promise<any> => {
  console.log(`Mock checkVerificationStatus called`);
  return { verified: true };
};

export const handleError = (error: any): string | null => {
  console.log(`Mock handleError called with error:`, error);
  return 'Mock error message';
};

export const verifyResetPasswordCode  = async (): Promise<any> => {
  console.log(`Mock checkVerificationStatus called`);
  return { verified: true };
};

export default {
  registerUser,
  loginUser,
  refreshToken,
  updateUser,
  sendVerificationCode,
  verifyEmailCode,
  sendResetPasswordCode,
  changePassword,
  validateActivationCode,
  getUserProfile,
  getPublicProfile,
  blockUser,
  checkUsername,
  checkEmail,
  checkPhone,
  checkVerificationStatus,
  handleError,
};

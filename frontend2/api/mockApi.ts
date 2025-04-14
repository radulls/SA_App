// Mock API implementation
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

// Mock API functions
export const registerUser = async (code: string): Promise<any> => {
  console.log(`Mock registerUser called with code: ${code}`);
  return { userId: 'mockUserId', token: 'mockToken', refreshToken: 'mockRefreshToken' };
};

export const updateUser = async (data: Record<string, any>): Promise<any> => {
  console.log(`Mock updateUser called with data:`, data);
  return { success: true };
};

export const sendVerificationCode = async (email: string): Promise<any> => {
  console.log(`Mock sendVerificationCode called with email: ${email}`);
  return { success: true };
};

export const verifyEmailCode = async (email: string, code: string): Promise<any> => {
  console.log(`Mock verifyEmailCode called with email: ${email} and code: ${code}`);
  return { success: true };
};

export const loginUser = async (identifier: string, password: string): Promise<any> => {
  console.log(`Mock loginUser called with identifier: ${identifier}, password: ${password}`);
  return { token: 'mockToken' };
};

export const validateActivationCode = async (code: string): Promise<any> => {
  console.log(`Mock validateActivationCode called with code: ${code}`);
  return { success: true };
};

export const sendTemporaryPassword = async (email: string): Promise<any> => {
  console.log(`Mock sendTemporaryPassword called with email: ${email}`);
  return { success: true };
};

export const blockUser = async (userId: string, isBlocked: boolean): Promise<any> => {
  console.log(`Mock blockUser called with userId: ${userId}, isBlocked: ${isBlocked}`);
  return { success: true };
};

export const checkUsername = async (username: string): Promise<any> => {
  console.log(`Mock checkUsername called with username: ${username}`);
  return { available: true };
};

export const checkEmail = async (email: string): Promise<any> => {
  console.log(`Mock checkEmail called with email: ${email}`);
  return { available: true };
};

export const checkPhone = async (phone: string): Promise<any> => {
  console.log(`Mock checkPhone called with phone: ${phone}`);
  return { available: true };
};

export const checkVerificationStatus = async (userId: string): Promise<any> => {
  console.log(`Mock checkVerificationStatus called with userId: ${userId}`);
  return { verified: true };
};

export const handleError = (error: any): string | null => {
  console.log(`Mock handleError called with error:`, error);
  return 'Mock error message';
};

export default {
  registerUser,
  updateUser,
  sendVerificationCode,
  verifyEmailCode,
  loginUser,
  validateActivationCode,
  sendTemporaryPassword,
  blockUser,
  checkUsername,
  checkEmail,
  checkPhone,
  checkVerificationStatus,
  handleError,
};

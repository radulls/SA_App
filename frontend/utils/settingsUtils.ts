import { Alert } from 'react-native';
import { updateUser, UserDataProps } from '@/api';

export const handleSaveProfile = async (updatedData: Partial<UserDataProps>, onBack: () => void) => {
  try {
    console.log('📤 Отправляем обновленные данные:', updatedData);
    // Убеждаемся, что hideLastName - это boolean
    if ('hideLastName' in updatedData) {
      updatedData.hideLastName = Boolean(updatedData.hideLastName);
    }    
    const response = await updateUser(updatedData);
    console.log('✅ Профиль обновлен:', response);
    Alert.alert('✅ Успех', 'Профиль успешно обновлен!');
    onBack();
  } catch (error) {
    console.error('❌ Ошибка обновления профиля:', error);
    Alert.alert('❌ Ошибка', 'Не удалось обновить профиль.');
  }
};
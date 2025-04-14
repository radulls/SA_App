import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { updatePasswordWithOld, UpdatePasswordRequest } from '@/api'; // ✅ Импортируем новую функцию
import { Link } from 'expo-router';
import ErrorMessage from '../ErrorMessage';

const SettingsPassword: React.FC<SettingsProps> = ({ onBack }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Регулярное выражение для валидации пароля (минимум 8 символов, заглавные, строчные буквы и цифра)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const validatePassword = (password: string): string | null => {
    if (!passwordRegex.test(password)) {
      return "Пароль должен быть от 8 до 16 символов и содержать буквы, цифры и/или специальные символы.";
    }
    return null;
  };

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Новый пароль и подтверждение не совпадают.");
      return;
    }

    // Проверяем формат пароля
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    try {
      const requestData: UpdatePasswordRequest = { oldPassword, newPassword };
      await updatePasswordWithOld(requestData);
      Alert.alert("Успех", "Пароль успешно изменен");
      onBack();
    } catch (error: any) {
      setErrorMessage(error.message || "Не удалось сменить пароль");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.formWrapper}>
          <Text style={styles.subtitle}>Заданный пароль можно будет использовать для входа в объединение через ID / номер телефона / эл. почту.</Text>

          <InputField label="Старый пароль" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
          <InputField label="Новый пароль" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          <InputField label="Подтвердите пароль" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry />

          <Text style={styles.subtitle}>Пароль должен быть 8-16 знаков и включать буквы, цифры и/или специальные символы.</Text>
          <Link style={styles.forgotPassword} href="/reset-password">Забыли пароль?</Link>
          {errorMessage ? (
          <View style={styles.errorContainer}>
            <ErrorMessage message={errorMessage} style={styles.errorMessage} />
          </View>
        ) : null}
          
        </View>
      </ScrollView>

      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" />
      </View>
    </View>
  );
};

export default SettingsPassword;

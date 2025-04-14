import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Platform, ToastAndroid, Alert } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { patch } from '@/api';
import ErrorMessage from '../ErrorMessage';
import Toast from 'react-native-toast-message';
import { checkEmail } from '@/api';

const SettingsEmail: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [email, setEmail] = useState(user.email ?? '');
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const maskEmail = (email: string) => {
    if (!email.includes('@')) return email;
    const [name, domain] = email.split('@');
    const maskedName = name.length > 2 ? name[0] + '***' + name.slice(-1) : name[0] + '***';
    return `${maskedName}@${domain}`;
  };

  const handleSaveEmail = async () => {
    if (!newEmail.includes('@') || password.length < 3) {
      setErrorMessage('Введите корректный email и пароль.');
      Toast.show({
        type: 'error',
        text1: 'Введите корректный email и пароль',
      });
      return;
    }
  
    try {
      setIsSaving(true);
      setErrorMessage(null);
  
      if (newEmail === email) {
        setErrorMessage('Новый email совпадает с текущим.');
        Toast.show({
          type: 'error',
          text1: 'Вы ввели тот же самый email.',
        });
        return;
      }
  
      // 🔍 Проверка на уникальность email
      await checkEmail(newEmail);
  
      // ✅ Обновляем
      await patch('/users/update', {
        email: newEmail,
        password,
      });
  
      setEmail(newEmail);
      setNewEmail('');
      setPassword('');
  
      Toast.show({
        type: 'success',
        text1: 'Email обновлён!',
      });
  
      onBack(); // Возврат к настройкам
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || 'Ошибка при обновлении email';
      setErrorMessage(msg);
      Toast.show({
        type: 'error',
        text1: 'Не удалось обновить email',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.topItems}>
          <Text style={styles.topText}>
            Привязанная эл. почта:{'\n'}
            {isEmailVisible ? email : maskEmail(email)}
          </Text>
          <Pressable onPress={() => setIsEmailVisible(!isEmailVisible)}>
            <Text style={styles.showButton}>{isEmailVisible ? 'Скрыть' : 'Показать'}</Text>
          </Pressable>
        </View>

        <View style={styles.formWrapper}>
          <Text style={styles.subtitle}>Введите новую почту и текущий пароль:</Text>

          <InputField label="Новая почта" value={newEmail} onChangeText={setNewEmail} />
          <InputField label="Пароль от аккаунта" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSaveEmail} text="Сохранить"/>
      </View>
    </View>
  );
};

export default SettingsEmail;

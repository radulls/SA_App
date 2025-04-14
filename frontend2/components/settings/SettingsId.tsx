import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';
import { checkUsername } from '@/api';
import Toast from 'react-native-toast-message';

const SettingsId: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [username, setUsername] = useState(user.username);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (username === user.username) {
      Toast.show({
        type: 'error',
        text1: 'Вы ввели тот же самый ID',
      });
      return;
    }

    if (!username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'ID не может быть пустым',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Проверяем, свободен ли ID
      const res = await checkUsername(username.trim());
      if (!res.available) {
        Toast.show({
          type: 'error',
          text1: 'ID уже занят',
        });
        return;
      }

      // Сохраняем
      await handleSaveProfile({ username }, onBack);

      Toast.show({
        type: 'success',
        text1: 'ID обновлён',
      });
    } catch (err: any) {
      console.error('❌ Ошибка при изменении ID:', err);
      Toast.show({
        type: 'error',
        text1: 'Не удалось изменить ID',
        text2: err?.response?.data?.message || 'Попробуйте позже',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.formWrapper}>
          <InputField 
            label="ID" 
            value={username}
            onChangeText={setUsername}
            editable={!isSaving}
          />       
        </View>
        <Text style={styles.subtitle}>
          После первого изменения ID, в следующий раз ID можно изменить через 60 дней. Можно использовать русский язык.
        </Text>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" disabled={isSaving} />
      </View>
    </View>
  );
};

export default SettingsId;

import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { styles } from '@/components/settings/SettingsStyle';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';
import Toast from 'react-native-toast-message'; // ⬅️ Добавили

const SettingsAbout: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [aboutMe, setAboutMe] = useState(user.aboutMe);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await handleSaveProfile({ aboutMe }, onBack);

      Toast.show({
        type: 'success',
        text1: 'Информация обновлена',
      });
    } catch (err: any) {
      console.error('❌ Ошибка при обновлении "О себе":', err);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить данные. Попробуйте позже.',
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
            label="О себе" 
            value={aboutMe} 
            onChangeText={setAboutMe}
            multiline={true}
            isLarge={true}
            editable={!isSaving}
          />
          <Text style={styles.subtitle}>
            Информация о вас будет отображаться на странице вашего профиля.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" disabled={isSaving} />
      </View>
    </View>
  );
};

export default SettingsAbout;

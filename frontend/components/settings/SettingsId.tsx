import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';

const SettingsId: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [username, setUsername] = useState(user.username);

  const handleSave = () => {
    handleSaveProfile({ username }, onBack);
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
          />       
        </View>
        <Text style={styles.subtitle}>После первого изменения ID, в следующий раз ID можно изменить через 6 месяцев. Можно использовать русский язык.</Text>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" />
      </View>
    </View>
  );
};

export default SettingsId;

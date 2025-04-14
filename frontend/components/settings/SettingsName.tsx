import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import CustomSwitch from '@/components/settings/CustomSwitch';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';

const SettingsNameScreen: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [hideLastName, setHideLastName] = useState<boolean>(Boolean(user.hideLastName));

  const handleSave = () => {
    console.log('🔍 Данные перед отправкой:', { firstName, lastName, hideLastName });
    handleSaveProfile({ firstName, lastName, hideLastName }, onBack);
  };
  
  <ContinueButton onPress={handleSave} text="Сохранить" />;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.formWrapper}>
          <InputField label="Имя" value={firstName} onChangeText={setFirstName} />
          <InputField label="Фамилия" value={lastName} onChangeText={setLastName}/>
        </View>
        <Text style={styles.subtitle}>Ваше имя будет отображаться на странице вашего профиля.</Text>
        <View style={styles.showSurnameContainer}>
          <Text style={styles.showSurnameText}>Скрыть фамилию</Text>
          <CustomSwitch value={hideLastName} onValueChange={(val) => setHideLastName(Boolean(val))} />
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" />
      </View>
    </View>
  );
};

export default SettingsNameScreen;
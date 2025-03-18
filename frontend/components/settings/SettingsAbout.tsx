import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { styles } from '@/components/settings/SettingsStyle'
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';

const SettingsAbout: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [aboutMe, setAboutMe] = useState(user.aboutMe);

  const handleSave = () => {
    handleSaveProfile({ aboutMe }, onBack);
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
          />
          <Text style={styles.subtitle}>Информация о вас будет отображаться на странице вашего профиля.</Text>
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" />
      </View>
    </View>
  );
};

export default SettingsAbout;
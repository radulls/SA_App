import React, { useState } from 'react';
import { View, ScrollView} from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { handleSaveProfile } from '@/utils/settingsUtils';

const SettingsPhone: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [phone, setPhone] = useState(user.phone ?? '');

  const handleSave = () => {
    handleSaveProfile({ phone }, onBack);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.formWrapper}>
          <InputField 
            label="Номер телефона" 
            value={phone} 
            onChangeText={setPhone}
          /> 
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={handleSave} text="Сохранить" />
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     alignItems: 'center', 
//   },
//   scrollView: {
//     flex: 1,
//     width: '100%',
//   },
//   scrollViewContent: {
//     paddingBottom: 90,
//     alignItems: 'center', 
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     height: 22,
//     marginTop: 55,
//     width: '100%',
//     maxWidth: 600,
//   },
//   backIcon: {
//     width: 8,
//     aspectRatio: 0.57,
//   },
//   menuIcon: {
//     width: 18,
//     aspectRatio: 1,
//   },
//   formWrapper: {
//     paddingLeft: 16,
//     paddingRight: 16,
//     paddingTop: 35,
//     width: '100%',
//     maxWidth: 600, 
//   },
//   ContinueButton: {
//     paddingLeft: 16,
//     paddingRight: 16,
//     paddingTop: 35,
//     width: '100%',
//     maxWidth: 600,
//   }

// });

export default SettingsPhone;
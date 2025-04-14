import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, Platform } from 'react-native';
import VerificationNameForm from '../components/verification/VerificationNameForm';
import VerificationPhotoForm from '../components/verification/VerificationPhotoForm';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import { router } from 'expo-router';
import { patchWithFiles } from '../api/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerificationScreen: React.FC = () => {
  const [step, setStep] = useState<number>(1); // Добавлено состояние для шагов
  const [verificationData, setVerificationData] = useState({
    firstName: '',
    lastName: '',
    passportPhoto: null,
    selfiePhoto: null,
  });

  const handleDataChange = (data: Partial<typeof verificationData>) => {
    setVerificationData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmitName = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('userId не найден');
  
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('firstName', verificationData.firstName);
      formData.append('lastName', verificationData.lastName);
  
      console.log('Отправляем FormData:', formData);
  
      const response = await patchWithFiles('/users/verify', formData);

  
      console.log('Успешный ответ сервера:', response);
  
      // Alert.alert('Успех', 'Имя и фамилия успешно отправлены!');
      setStep(2); // Переход ко второму шагу
    } catch (error: any) {
      console.error('Ошибка:', error.message || error.response?.data || error);
      Alert.alert('Ошибка', error.message || 'Неизвестная ошибка');
    }
  };
  
  const handleSubmitPhotos = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('userId не найден');
  
      console.log('📸 Отправляемые файлы:', verificationData);
  
      const formData = new FormData();
      formData.append('userId', userId);
  
      // Функция добавления файлов в FormData
      const appendImageToFormData = async (fileObject: any, fieldName: string) => {
        if (Platform.OS === 'web') {
          const response = await fetch(fileObject.uri);
          const blob = await response.blob();
          const fileType = blob.type.split('/')[1] || 'jpeg';
          const fileName = `${fieldName}.${fileType}`;
          formData.append(fieldName, new File([blob], fileName, { type: blob.type }));
        } else {
          formData.append(fieldName, {
            uri: fileObject.uri,
            name: `${fieldName}.${fileObject.uri.split('.').pop() || 'jpg'}`,
            type: `image/${fileObject.uri.split('.').pop()?.toLowerCase() || 'jpeg'}`,
          } as any);
        }
      };
  
      if (verificationData.passportPhoto) {
        console.log('📤 Добавляем паспортное фото...');
        await appendImageToFormData(verificationData.passportPhoto, 'passportPhoto');
      }
      if (verificationData.selfiePhoto) {
        console.log('📤 Добавляем селфи...');
        await appendImageToFormData(verificationData.selfiePhoto, 'selfiePhoto');
      }
  
      console.log('📤 Отправляем FormData:', formData);
  
      const response = await patchWithFiles('/users/verify', formData);
      console.log('✅ Ответ сервера:', response);
  
      Alert.alert('Успех', 'Фото успешно загружены!');
      router.push('/home');
    } catch (error: any) {
      console.error('❌ Ошибка:', error.message || error.response?.data || error);
      Alert.alert('Ошибка', error.message || 'Неизвестная ошибка');
    }
  };
  

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <VerificationNameForm
          value={{
            firstName: verificationData.firstName,
            lastName: verificationData.lastName,
          }}
          onDataChange={handleDataChange}
          onSubmit={handleSubmitName} // Передача обработчика для первого шага
        />
      );
    }

    if (step === 2) {
      return (
        <VerificationPhotoForm
          value={{
            passportPhoto: verificationData.passportPhoto,
            selfiePhoto: verificationData.selfiePhoto,
          }}
          onDataChange={handleDataChange}
          onSubmit={handleSubmitPhotos} // Передача обработчика для второго шага
        />
      );
    }
  };

  return (
    <View style={styles.backgroundContainer}>
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <IconBack onPress={() => (step > 1 ? setStep(step - 1) : router.back())} 
        style={styles.iconBack}
        />
       <View style={styles.titleWrapper}> 
        <Text style={styles.headerTitle}>Верификация</Text>
      </View>
      </View> 
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderStepContent()}
      </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    maxWidth: 600,
    marginHorizontal: 'auto',
    paddingTop: 58,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  iconBack: {
    width: 32, // Фиксированная ширина иконки
    zIndex: 20,
  },
  titleWrapper: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: "SFUIDisplay-bold",
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
  },
});

export default VerificationScreen;

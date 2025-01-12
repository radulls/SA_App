import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
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
  
      const response = await patchWithFiles('/users/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
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

      const formData = new FormData();
      formData.append('userId', userId);

      const appendImageToFormData = (uri: string, fieldName: string) => {
        formData.append(fieldName, {
          uri,
          name: `${fieldName}.${uri.split('.').pop()}`,
          type: `image/${uri.split('.').pop()?.toLowerCase() || 'jpeg'}`,
        } as any);
      };

      if (verificationData.passportPhoto) {
        console.log('Добавляем паспортное фото...');
        appendImageToFormData(verificationData.passportPhoto, 'passportPhoto');
      }

      if (verificationData.selfiePhoto) {
        console.log('Добавляем селфи...');
        appendImageToFormData(verificationData.selfiePhoto, 'selfiePhoto');
      }

      console.log('Отправляем FormData:', formData);

      const response = await patchWithFiles('/users/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Ответ сервера:', response);

      Alert.alert('Успех', 'Фото успешно загружены!');
      router.push('/home');
    } catch (error: any) {
      console.error('Ошибка:', error.message || error.response?.data || error);
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
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <IconBack onPress={() => (step > 1 ? setStep(step - 1) : router.back())} />
        <Text style={styles.headerTitle}>Верификация</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderStepContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flex: 1,
    width: '100%',
    paddingHorizontal: 16
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 75,
    position: 'relative',
    height: 22,
  },
  headerTitle: {
    fontSize: 15,
    paddingRight: 40,
    color: '#fff',
    textAlign: 'center',
    width: '100%',
    fontWeight: '700',
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
  },
});

export default VerificationScreen;

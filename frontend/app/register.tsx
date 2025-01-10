import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import CodeForm from '../components/register/Code';
import RegistrationForm from '../components/register/RegistrationForm';
import IDForm from '../components/register/IDForm';
import PasswordForm from '../components/register/PasswordForm';
import PhoneForm from '../components/register/Phone';
import EmailForm from '../components/register/Email';
import CityForm from '../components/register/City';
import Button from '../components/Button';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { post } from '../api/index'; // Подключаем API
import IconBack from '@/components/svgConvertedIcons/iconBack';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface ValueProps {
  value: string; // Текущее значение
  onDataChange: (value: string) => void; // Обработчик изменения
}

const RegistrationScreen: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false); // Чекбокс

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const handleDataChange = (data: Record<string, any>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };  

  const isNextEnabled = () => {
    switch (step) {
      case 0: // Поле кода и чекбокс
        return isChecked && formData.code?.trim().length > 0;
      case 1: // Поле ID
        return formData.username?.trim().length > 0;
      case 2: // Поле пароля
        return formData.password?.trim().length > 0;
      case 3: // Поле телефона
        return formData.phone?.trim().length > 0;
      case 4: // Поле Email
        return formData.email?.trim().length > 0;
      case 5: // Поле города
        return formData.city?.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!isNextEnabled()) return;
  
    if (step === 5) {
      try {
        console.log('FormData перед отправкой:', formData);
        const newUserResponse = await post('/users/register', formData);
  
        console.log('newUserResponse', newUserResponse);
        const userId = newUserResponse._id; // Извлекаем ID пользователя
        await AsyncStorage.setItem('userId', userId); // Сохраняем ID локально
  
        router.push('/verification'); // Переход на страницу верификации
      } catch (error: any) {
        console.error('Error during registration:', error.response?.data || error.message);
      }
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const goBack = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <CodeForm
            value={formData.code || ''} // Передаем текущее значение
            isChecked={isChecked}
            onDataChange={(data) => handleDataChange({ code: data })}
            onCheckBoxToggle={toggleCheckBox}
          />
        );
      case 1:
        return (
          <IDForm
            value={formData.username || ''} // Передаем текущее значение
            onDataChange={(data) => handleDataChange({ username: data })}
          />
        );
      case 2:
        return (
          <PasswordForm
            value={formData.password || ''} // Передаем текущее значение
            onDataChange={(data) => handleDataChange({ password: data })}
          />
        );
      case 3:
        return (
          <PhoneForm
            value={formData.phone || ''} // Передаем текущее значение
            onDataChange={(data) => handleDataChange({ phone: data })}
          />
        );
      case 4:
        return (
          <EmailForm
            value={formData.email || ''} // Передаем текущее значение
            onDataChange={(data) => handleDataChange({ email: data })}
          />
        );
      case 5:
        return (
          <CityForm
            value={formData.city || ''} // Передаем текущее значение
            onDataChange={(data) => handleDataChange({ city: data })}
          />
        );
      default:
        return <Text style={styles.footerText}>Ошибка: Неверный шаг!</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {step !== 0 && (
              <View style={styles.backIconWrapper}>
                <IconBack onPress={goBack} />
              </View>
            )}
            <View style={styles.logo} />
          </View>
          {renderStepContent()}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              <Text style={styles.regularText}>Уже есть аккаунт? </Text>
              <Link style={styles.highlightText} href="/auth/login">
                Войти
              </Link>
            </Text>
            <Button title="Далее" onPress={handleNext} disabled={!isNextEnabled()} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 59,
    maxWidth: 600,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  backIconWrapper: {
    position: 'absolute',
    left: -30,
    zIndex: 1,
  },
  logo: {
    marginTop: 30,
    backgroundColor: 'rgba(67, 67, 67, 1)',
    width: 186,
    height: 240,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 41,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  regularText: {
    fontSize: 12,
    color: 'rgba(139, 139, 139, 1)',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(148,179,255,1)',
  },
});

export default RegistrationScreen;

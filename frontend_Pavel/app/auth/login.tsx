import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { loginUser } from '@/api/mockApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [formData, setFormData] = useState<{ identifier: string; password: string }>({
    identifier: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);
  
    try {
      const { identifier, password } = formData;
  
      console.log('Отправка данных на сервер:', { identifier, password });
  
      if (!identifier || !password) {
        setErrorMessage('Заполните все поля.');
        setIsLoading(false);
        return;
      }
  
      const response = await loginUser(identifier, password);
      console.log('Ответ от сервера:', response);
  
      await AsyncStorage.setItem('token', response.token);
  
      // Переход на экран с капчей
      router.push('/captcha');
    } catch (error: any) {
      console.error('Ошибка при авторизации:', error);
  
      if (error.message === 'Слишком много попыток') {
        setErrorMessage('Слишком много попыток');
      } else if (error.message === 'Аккаунт не существует') {
        setErrorMessage('Аккаунт не существует');
      } else if (error.message === 'Неверный логин или пароль') {
        setErrorMessage('Неверный логин или пароль');
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logo} />
          <View style={styles.formContainer}>
            <Text style={styles.title}>Вход</Text>
            <InputField
              label="Телефон, id или почта"
              value={formData.identifier}
              onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e }))}
            />
            <View style={styles.passwordContainer}>        
            <View style={styles.passwordContainerTitles}>
              <Text style={styles.passwordLabel}>Пароль</Text>
              <Link style={styles.forgotPassword} href="/reset-password">
                Забыли пароль?
              </Link>
            </View>
            <InputField
              value={formData.password}
              secureTextEntry
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e }))}
              label=""
            />
          </View>
            {errorMessage && (
              <ErrorMessage message={errorMessage} />
            )}
            <View style={styles.footer}>
              <Text style={styles.signUpText}>
                <Text style={styles.signUpTextGray}>У вас ещё нет аккаунта? </Text>
                <Link style={styles.signUpTextBlue} href="/captcha?action=register">
                  Зарегистрироваться
                </Link>
              </Text>
              <Button onPress={handleSubmit} title="Войти" loading={isLoading} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  erorMessageWrapper: {
    marginTop: 40,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    paddingHorizontal: 16,
    paddingTop: 59,
    maxWidth: 600,
    width: '100%',
  },
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    alignSelf: 'center',
    width: 186,
    height: 240,
    marginTop: 30,
  },
  formContainer: {
    marginTop: 28,
    flex: 1,
  },
  title: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 27,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordContainerTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10
  },
  passwordLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    fontWeight: '700'
  },
  forgotPassword: {
    color: '#94B3FF',
    fontSize: 12,
    fontWeight: '700'
  },
  signUpText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 20,
  },
  signUpTextGray: {
    color: 'rgba(139, 139, 139, 1)',
  },
  signUpTextBlue: {
    color: 'rgba(148, 179, 255, 1)',
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 41,
  },
});

export default LoginScreen;

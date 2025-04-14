import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { getUserProfile, loginUser } from '@/api';
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
      console.log('🔄 Отправка данных на сервер:', { identifier, password });
  
      if (!identifier || !password) {
        setErrorMessage('Заполните все поля.');
        setIsLoading(false);
        return;
      }
  
      // ✅ Авторизуем пользователя
      const response = await loginUser(identifier, password);
      console.log('✅ Ответ от сервера:', response);
  
      // ✅ Сохраняем токен
      await AsyncStorage.setItem('token', response.token);
  
      // 🔥 Принудительно загружаем актуальные данные пользователя
      const updatedUser = await getUserProfile();
      console.log('📡 Обновленные данные пользователя:', updatedUser);
  
      // ✅ Сохраняем обновлённые данные пользователя
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  
      // ✅ Переход на домашнюю страницу
      router.push('/home');
    } catch (error: any) {
      console.error('❌ Ошибка при авторизации:', error);
      setErrorMessage('Произошла ошибка. Попробуйте позже.');
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
              <Link style={styles.forgotPassword} href="/reset-password">
                Забыли пароль?
              </Link>      
              {/* </View> */}
              <InputField
                value={formData.password}
                secureTextEntry
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e }))}
                label=" Пароль"
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
		paddingTop: 58,
		maxWidth: 600,
		width: '100%',
	},
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    alignSelf: 'center',
    width: 186,
    height: 240,
  },
  formContainer: {
    marginTop: 28,
    flex: 1,
  },
  title: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 18,
    marginBottom: 29,
    fontFamily: "SFUIDisplay-Bold",
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordContainerTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  passwordLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    fontFamily: "SFUIDisplay-Bold",
  },
  forgotContainer: {
    position: 'relative',
  },
  forgotPassword: {
    color: '#94B3FF',
    fontSize: 12,
    position: 'absolute',
    right: 0,
    fontFamily: "SFUIDisplay-Bold",
    zIndex: 1
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
    fontFamily: "SFUIDisplay-medium",
  },
  signUpTextBlue: {
    color: 'rgba(148, 179, 255, 1)',
    fontWeight: '700',
    fontFamily: "SFUIDisplay-Bold",
  },
  footer: {
    paddingBottom: 41,
  },
});

export default LoginScreen;

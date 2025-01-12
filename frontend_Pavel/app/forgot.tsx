import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import ForgotForm from '../components/register/ForgotForm';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';

// Фиктивная функция отправки инструкции
const mockSendTemporaryPassword = async (email: string): Promise<any> => {
  console.log(`Mock отправка инструкции на email: ${email}`);
  
  // Эмуляция успешной отправки
  if (email === 'test@example.com') {
    return { message: 'Мы отправили ссылку на электронную почту: te**t@xample.com, чтобы сбросить пароль.' };
  }

  // Эмуляция ошибки
  throw new Error('Указанный email не найден.');
};

const RegistrationScreen = () => { 
  const router = useRouter(); // Навигация
  const [email, setEmail] = useState(''); // Email состояния
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Для состояния загрузки
  const [isSent, setIsSent] = useState(false); // Для контроля отображения кнопки

  const handleBack = () => {
    router.push('/auth/login'); // Возврат на страницу логина
  };

  const handleSendInstruction = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await mockSendTemporaryPassword(email); // Используем mock API
      setMessage(response.message || 'Инструкция отправлена на ваш email.');
      setIsSent(true); // Устанавливаем, что инструкция отправлена
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {/* Кнопка назад */}
            <Pressable onPress={handleBack} style={styles.backIconWrapper}>
              <CloseIcon />
            </Pressable>
            {/* Логотип */}
            <View style={styles.logo} />  
            {message && 
              <View style={styles.successContainer}>
                <Text style={styles.success}>{message}</Text>
              </View>
            }
            {error && 
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            }       
          </View>        
          <ForgotForm email={email} setEmail={setEmail} />
          <View style={styles.footer}>
            {!isSent && (
              <Button 
                title={isLoading ? 'Отправка...' : 'Отправить инструкцию'} 
                onPress={handleSendInstruction} 
                disabled={isLoading} 
              />
            )}
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
    position: 'relative',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flexGrow: 1, 
    paddingHorizontal: 16,
    paddingTop: 59,
    maxWidth: 600,
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  backIconWrapper: {
    position: 'absolute',
    left: -20,
    top: 5,
    zIndex: 100,
    padding: 20,
  },
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    width: 186,
    height: 240,
    marginTop: 30,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 41,
  },
  successContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#3C6685',
    width: '100%',
    borderRadius: 8,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#F00',
    width: '100%',
    borderRadius: 8,
  },
  success: {
    color: '#fff',
    fontSize: 12,
    width: '80%',
    lineHeight: 15,
    paddingVertical: 15,
    paddingHorizontal: 19,
  },
  error: {
    color: '#fff',
    fontSize: 12,
    width: '80%',
    lineHeight: 15,
    paddingVertical: 15,
    paddingHorizontal: 19,
  },
});

export default RegistrationScreen;

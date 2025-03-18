import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Alert } from 'react-native';
import InputField from '../eventCreation/InputField';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import { SettingsProps } from '@/app/settings';
import { sendVerificationCode, verifyEmailCode, checkEmail } from '@/api';
import ErrorMessage from '../ErrorMessage';


const SettingsEmail: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [email, setEmail] = useState(user.email ?? '');
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendCodeDisabled, setIsSendCodeDisabled] = useState(true);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Маскируем email
  const maskEmail = (email: string) => {
    if (!email || typeof email !== 'string') return ''; // Если `undefined`, возвращаем пустую строку
    if (!email.includes('@')) return email;
    const [name, domain] = email.split('@');
    const maskedName = name.length > 2 ? name[0] + '***' + name.slice(-1) : name[0] + '***';
    return `${maskedName}@${domain}`;
  };
  
  const handleSendCode = async () => {
    if (!newEmail.includes('@')) {
      setErrorMessage('Введите корректный email.');
      return;
    }
    console.log("📩 Отправляем код на сервер:", { email: newEmail, code: verificationCode });

    try {
      setErrorMessage(null);
      console.log("🔍 Проверяем доступность email:", newEmail);
  
      await checkEmail(newEmail);
  
      console.log("📩 Отправляем код подтверждения на:", newEmail);
      console.log("📩 Отправляем код на сервер:", { email: newEmail, code: verificationCode });

      await sendVerificationCode(newEmail);
  
      setIsVerifying(true);
      setIsSendCodeDisabled(true);
    } catch (error: any) {
      console.error("❌ Ошибка при проверке email:", error);
    }
  };
  
  const handleVerifyCode = async () => {
    console.log("🚀 Функция handleVerifyCode вызвана");
  
    if (verificationCode.length !== 6) {
      console.log("❌ Ошибка: Код должен содержать 6 символов.");
      setErrorMessage("Код должен содержать 6 символов.");
      return;
    }
  
    try {
      console.log("📩 Проверяем код:", verificationCode);
      setErrorMessage(null);
  
      const response = await verifyEmailCode(newEmail, verificationCode);
  
      console.log("✅ Ответ сервера:", response);
  
      if (!response || !response.email) {
        console.log("⚠️ Ошибка: сервер не вернул email.");
        setErrorMessage("Ошибка сервера. Попробуйте позже.");
        return;
      }
  
      console.log("📩 Код подтвержден, обновляем email в UI:", response.email);
      setEmail(response.email);
      setIsVerifying(false);
      setNewEmail('');
      setVerificationCode('');
      setIsSendCodeDisabled(true);
      Alert.alert("Успех", "Email успешно подтверждён!");
    } catch (error: any) {
      console.error("❌ Ошибка подтверждения кода:", error);
  
      // Получаем сообщение от сервера
      const serverMessage = error.response?.data?.message || error.message;
  
      console.log("🔴 Сообщение от сервера:", serverMessage);
  
      // Если сервер вернул "Неверный код подтверждения.", устанавливаем его напрямую
      if (serverMessage === "Неверный код подтверждения.") {
        setErrorMessage(serverMessage);
      } else if (serverMessage === "Слишком много попыток") {
        setErrorMessage("Слишком много попыток. Попробуйте позже.");
      } else {
        setErrorMessage("Ошибка при подтверждении кода.");
      }
    }
  };
  
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {/* Текущая почта */}
        <View style={styles.topItems}>
          <Text style={styles.topText}>
            Привязанная эл. почта:{'\n'}
            {isEmailVisible ? email : maskEmail(email)}
          </Text>
          <Pressable onPress={() => setIsEmailVisible(!isEmailVisible)}>
            <Text style={styles.showButton}>{isEmailVisible ? 'Скрыть' : 'Показать'}</Text>
          </Pressable>
        </View>

        {/* ✅ Кнопка "Отправить код" */}
        {!isVerifying && newEmail.length > 0 && (
          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={handleSendCode} 
              style={[styles.confirmButton, { opacity: isSendCodeDisabled ? 0.5 : 1 }]}
              disabled={isSendCodeDisabled}
            >
              <Text style={styles.buttonText}>Отправить код</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.formWrapper}>
          <Text style={styles.subtitle}>
            {isVerifying
              ? 'Введите код, отправленный на вашу почту.'
              : 'Введите адрес новой электронной почты, чтобы иметь возможность восстановить доступ к аккаунту.'
            }
          </Text>

          {/* ✅ Инпут меняется в зависимости от состояния */}
          <InputField 
            label={isVerifying ? "Код подтверждения" : ""}
            value={isVerifying ? verificationCode : newEmail} 
            onChangeText={(text) => {
              if (isVerifying) {
                setVerificationCode(text);
                setIsConfirmDisabled(text.length !== 6);
              } else {
                setNewEmail(text);
                setIsSendCodeDisabled(!text.includes('@'));
              }
            }}
          />
        </View>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <ErrorMessage message={errorMessage} style={styles.errorMessage} />
          </View>
        ) : null}
        {/* ✅ Кнопка "Подтвердить" */}
        {isVerifying && (
          <View style={styles.approveButtonContainer}>
            <Pressable 
              onPress={handleVerifyCode} 
              style={[styles.confirmButton, styles.approveButton, { opacity: isConfirmDisabled ? 0.5 : 1 }]}
              disabled={isConfirmDisabled}
            >
              <Text style={[styles.buttonText, styles.approveText]}>Подтвердить</Text>
            </Pressable>
          </View>
        )}      
      </ScrollView>
      {/* Кнопка "Сохранить" */}
      <View style={styles.ContinueButton}>
        <ContinueButton onPress={onBack} text="Сохранить" />
      </View>
    </View>
  );
};

export default SettingsEmail;
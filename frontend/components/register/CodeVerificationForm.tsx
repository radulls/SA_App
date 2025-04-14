import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { verifyEmailCode, handleError } from '@/api';
import styles from './style';
import { ValueProps } from '@/app/register';

export interface CodeVerificationFormRef {
  validateInput: () => Promise<void>;
}

const CodeVerificationForm = forwardRef<CodeVerificationFormRef, ValueProps>(({ value, email, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);
  const [isCodeChecked, setIsCodeChecked] = useState(false); // Новый стейт для предотвращения повторного запроса

  const validateInput = async () => {
    setError(null);
  
    if (!value.trim()) {
      setError('Код обязателен.');
      return Promise.reject('Validation Error');
    }
  
    if (!email) {
      setError('Email отсутствует.');
      return Promise.reject('Email отсутствует');
    }
  
    if (isCodeChecked) {
      console.log("⚠️ Код уже проверен, повторный запрос не отправляется");
      return;
    }
  
    try {
      console.log("🔍 Отправка запроса на /verify-code...");
      const result = await verifyEmailCode(email, value.trim());
      console.log('✅ Код успешно подтвержден');
      setIsCodeChecked(true); // Запоминаем, что код уже был подтвержден
    } catch (err: any) {
      console.error("❌ Ошибка верификации:", err);
      setError(handleError(err) || "Произошла ошибка. Попробуйте снова.");
      return Promise.reject(err.message || 'Произошла ошибка. Попробуйте снова.');
    }
  };

  useImperativeHandle(ref, () => ({
    validateInput,
  }));

  const handleInputChange = (code: string) => {
    onDataChange(code.trim());
    setError(null); // Убираем ошибку при вводе
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Введите код, который пришёл на вашу электронную почту.
      </Text>
      {error && <ErrorMessage message={error} />}
      <View style={styles.inputContainer}>
        <InputField
          label="Код подтверждения"
          onChange={handleInputChange}
          value={value}
        />
      </View>
    </View>
  );
});

export default CodeVerificationForm;

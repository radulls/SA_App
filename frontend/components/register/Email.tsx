import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { checkEmail, handleError } from '@/api';
import styles from './style';
import { ValueProps } from '@/app/register';

export interface EmailFormRef {
  validateInput: () => Promise<void>;
}

const EmailForm = forwardRef<EmailFormRef, ValueProps>(({ value, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);

  const validateInput = async () => {
    setError(null);

    if (!value.trim()) {
      setError('Email обязателен.');
      throw new Error('Validation Error');
    }

    const phoneRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(value)) {
      setError('Неверный формат');
      throw new Error('Validation Error');
    }

    try {
      await checkEmail(value); // Проверяем, используется ли email
    } catch (error: any) {
      const customError = handleError(error);
      if (customError === 'Email уже используется.') {
        setError('Email уже используется.');
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
      throw new Error(customError || 'Validation Error'); // Прерываем процесс
    }
  };

  useImperativeHandle(ref, () => ({
    validateInput,
  }));

  const handleInputChange = (email: string) => {
    onDataChange(email.trim());
    setError(null); // Убираем ошибку при изменении
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>На почту придёт подтверждение аккаунта.</Text>
      {error && <ErrorMessage message={error} />}
      <View style={styles.inputContainer}>
        <InputField label="Почта" onChange={handleInputChange} value={value} />
      </View>
    </View>
  );
});


export default EmailForm;

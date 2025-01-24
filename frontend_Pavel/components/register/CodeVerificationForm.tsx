import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { verifyEmailCode, handleError } from '@/api/mockApi';
import styles from './style';
import { ValueProps } from '@/app/register';

export interface CodeVerificationFormRef {
  validateInput: () => Promise<void>;
}

const CodeVerificationForm = forwardRef<CodeVerificationFormRef, ValueProps>(({ value, email, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);

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

    try {
      const result = await verifyEmailCode(email, value.trim());
      console.log('Код успешно подтвержден');
    } catch (err: any) {
      if (err.message === 'Слишком много попыток') {
        setError('Слишком много попыток');
      } else if (err.message === 'Неверный код подтверждения.') {
        setError('Неверный код подтверждения.');
      } else {
        const customError = handleError(err);
        if (customError) {
          setError(customError);
        } else {
          setError('Произошла ошибка. Попробуйте снова.');
        }
      }
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

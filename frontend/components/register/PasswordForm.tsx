import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import styles from './style';
import { ValueProps } from '@/app/register';

export interface PasswordFormRef {
  validateInput: () => Promise<void>;
}

const PasswordForm = forwardRef<PasswordFormRef, ValueProps>(({ value, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const validateInput = async () => {
    setError(null); // Сбрасываем ошибки перед проверкой

    if (!passwordRegex.test(value)) {
      setError('Неверный формат');
      throw new Error('Validation Error'); // Прерываем процесс
    }
  };

  useImperativeHandle(ref, () => ({
    validateInput,
  }));

  const handleInputChange = (password: string) => {
    onDataChange(password.trim());
    setError(null); // Убираем ошибку при изменении
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Придумайте пароль для вашего аккаунта. Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, а также цифры.
      </Text>
      {error && <ErrorMessage message={error} />}
      <View style={styles.inputContainer}>
        <InputField
          label="Пароль"
          onChange={handleInputChange}
          value={value}
        />
      </View>
    </View>
  );
});

export default PasswordForm;

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';

export interface PasswordStepRef {
  validateInput: () => Promise<void>;
  setError: (message: string | null) => void; 
}

interface Props {
  value: string;
  onDataChange: (value: string) => void;
}

const PasswordStep = forwardRef<PasswordStepRef, Props>(({ value, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);

  // Регулярное выражение для пароля
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const validateInput = async (): Promise<void> => {
    setError(null);

    if (!value.trim()) {
      setError('Пароль обязателен.');
      throw new Error('Validation Error');
    }

    if (!passwordRegex.test(value)) {
      setError('Неверный формат');
      throw new Error('Validation Error');
    }
  };

  useImperativeHandle(ref, () => ({
    validateInput,
    setError,
  }));

  const handleChange = (password: string) => {
    onDataChange(password.trim());
    setError(null); // Сбрасываем ошибку при вводе
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Введите новый пароль</Text>
      <Text style={styles.description}>
        Придумайте пароль для вашего аккаунта. Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, а также цифры.
      </Text>
      {error && <ErrorMessage message={error} />}
      <InputField
        label="Новый пароль"
        value={value}
        onChange={handleChange}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
    marginBottom: 30, 
  },
});

export default PasswordStep;

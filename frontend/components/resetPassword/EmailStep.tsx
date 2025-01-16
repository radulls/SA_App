import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';

export interface EmailStepRef {
  validateInput: () => Promise<void>;
  setError: (message: string | null) => void; // Изменяем тип на string | null
}

interface Props {
  value: string;
  onDataChange: (value: string) => void;
  onNext: () => Promise<void>;
}

const EmailStep = forwardRef<EmailStepRef, Props>(({ value, onDataChange, onNext }, ref) => {
  const [error, setError] = useState<string | null>(null);

  const validateInput = async (): Promise<void> => {
    setError(null); // Сбрасываем ошибку
  
    if (!value.trim()) {
      setError('Email обязателен.');
      throw new Error('Validation Error');
    }
  };

  // Передаём `setError` с расширенным типом
  useImperativeHandle(ref, () => ({
    validateInput,
    setError: (message: string | null) => setError(message), // Теперь принимает `null`
  }));

  const handleChange = (email: string) => {
    onDataChange(email.trim());
    if (error) setError(null); // Сбрасываем ошибку при изменении ввода
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Сброс пароля</Text>
      <Text style={styles.description}>
        Введите адрес электронной почты, который вы использовали при регистрации, мы вышлем вам код для сброса пароля.
      </Text>
      {error && <ErrorMessage message={error} />}
      <InputField label="Email" value={value} onChange={handleChange} />
    </View>
  );
});


const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  description: {
    marginTop: 10,
    color: '#fff',
    fontSize: 12,
    marginBottom: 30,
  },
});

export default EmailStep;

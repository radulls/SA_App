import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { verifyResetPasswordCode, handleError } from '@/api/mockApi';

export interface CodeVerificationStepRef {
  validateInput: () => Promise<void>;
  setError: (message: string | null) => void; 
}

interface Props {
  value: string;
  email: string;
  onDataChange: (value: string) => void;
}

const CodeVerificationStep = forwardRef<CodeVerificationStepRef, Props>(
  ({ value, email, onDataChange }, ref) => {
    const [error, setError] = useState<string | null>(null);

    const validateInput = async (): Promise<void> => {
      setError(null);
    
      if (!value.trim()) {
        setError('Код обязателен.');
        hideErrorAfterDelay();
        return Promise.reject('Validation Error');
      }
    
      if (!email) {
        setError('Email отсутствует.');
        hideErrorAfterDelay();
        return Promise.reject('Email отсутствует.');
      }
    
      try {
        await verifyResetPasswordCode(email, value.trim());
        console.log('Код успешно подтвержден');
      } catch (err: any) {
        if (err.message === 'Слишком много попыток') {
          setError('Слишком много попыток. Подождите немного и попробуйте снова.');
        } else if (err.message === 'Неверный или истёкший код смены пароля.') {
          setError('Неверный или истёкший код смены пароля.');
        } else {
          const customError = handleError(err);
          setError(customError || 'Произошла ошибка. Попробуйте снова.');
        }
        hideErrorAfterDelay(); // Скрыть ошибку через 3 секунды
        return Promise.reject(err.message || 'Произошла ошибка. Попробуйте снова.');
      }
    };
    
    // Функция для скрытия ошибки через 3 секунды
    const hideErrorAfterDelay = () => {
      setTimeout(() => {
        setError(null);
      }, 3000); // 3 секунды
    };
    
    useImperativeHandle(ref, () => ({
      validateInput,
      setError
    }));

    const handleInputChange = (code: string) => {
      onDataChange(code.trim());
      setError(null); // Убираем ошибку при вводе
    };

    return (
      <View style={styles.form}>
        <Text style={styles.title}>Подтверждение кода</Text>
        <Text style={styles.description}>
          Введите код, отправленный на ваш email: {email}.
        </Text>
        {error && <ErrorMessage message={error} />}
          <InputField
            label="Код подтверждения"
            onChange={handleInputChange}
            value={value}
          />
      </View>
    );
  }
);

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

export default CodeVerificationStep;

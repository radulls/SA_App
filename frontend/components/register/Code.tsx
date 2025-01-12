import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Pressable } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { registerUser, handleError, validateActivationCode } from '@/api';
import styles from './style';

export interface CodeFormRef {
  validateInput: () => Promise<void>;
}

interface CodeFormProps {
  value: string;
  isChecked: boolean;
  onDataChange: (value: string) => void;
  onCheckBoxToggle: () => void;
}

const CodeForm = forwardRef<CodeFormRef, CodeFormProps>(
  ({ value, isChecked, onDataChange, onCheckBoxToggle }, ref) => {
    const [error, setError] = useState<string | null>(null);

    const validateInput = async (): Promise<void> => {
      setError(null); // Сбрасываем предыдущую ошибку
    
      if (!value.trim()) {
        setError('Активационный код обязателен.');
        throw new Error('Validation Error');
      }
    
      try {
        await validateActivationCode(value); // Проверяем код
      } catch (error: any) {
        const errorMessage = error.message;
    
        if (errorMessage === 'Неверный активационный код.') {
          setError('Неверный активационный код.');
        } else {
          setError('Произошла ошибка. Попробуйте снова.');
        }
    
        throw new Error(errorMessage); // Пробрасываем ошибку для обработки
      }
    };
    
    
    useImperativeHandle(ref, () => ({
      validateInput,
    }));

    const handleInputChange = (value: string) => {
      onDataChange(value.trim());
      setError(null); // Убираем ошибку при изменении
    };

    return (
      <View style={styles.form}>
        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.description}>
          Для регистрации в приложении вам необходим активационный код, который вы можете узнать у других участников объединения.
        </Text>
        {error && <ErrorMessage message={error} />}
        <View style={styles.inputContainer}>
          <InputField label="Активационный код" onChange={handleInputChange} value={value} />
        </View>
        <Pressable style={styles.agreementContainer} onPress={onCheckBoxToggle}>
          <View style={styles.checkbox}>
            {isChecked && (
              <View style={styles.checkboxIcon}>
                <Text style={styles.checkboxText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.termsText}>
            <Text style={styles.termsRegular}>Я ознакомился и согласен с </Text>
            <Text style={styles.termsHighlight}>Условиями предоставления услуг </Text>
            <Text style={styles.termsRegular}>и </Text>
            <Text style={styles.termsHighlight}>Политикой конфиденциальности</Text>
          </Text>
        </Pressable>
      </View>
    );
  }
);


export default CodeForm;

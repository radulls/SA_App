import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import { checkPhone, handleError } from '@/api/mockApi'; // Предполагается, что API для проверки номера телефона уже настроено
import styles from './style';
import { ValueProps } from '@/app/register';

export interface PhoneFormRef {
  validateInput: () => Promise<void>;
}

const PhoneForm = forwardRef<PhoneFormRef, ValueProps>(({ value, onDataChange }, ref) => {
  const [error, setError] = useState<string | null>(null);

  // Валидация телефона
  const validateInput = async () => {
    setError(null); // Сбрасываем ошибку

    if (!value.trim()) {
      setError('Номер телефона обязателен.');
      throw new Error('Validation Error');
    }

    const phoneRegex = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(value)) {
      setError('Неверный формат');
      throw new Error('Validation Error');
    }

    try {
      await checkPhone(value);
    } catch (error: any) {
      const customError = handleError(error);
      if (customError === 'Телефон уже используется.') {
        setError('Телефон уже используется.');
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
      throw new Error(customError || 'Validation Error');
    }
  };

  useImperativeHandle(ref, () => ({
    validateInput,
  }));

  // Форматирование номера телефона
  const formatPhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, ''); // Убираем всё, кроме цифр
    const formatted = numbersOnly
      .replace(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, (_match, p1, p2, p3, p4, p5) => {
        let result = `+${p1}`;
        if (p2) result += ` ${p2}`;
        if (p3) result += ` ${p3}`;
        if (p4) result += `-${p4}`;
        if (p5) result += `-${p5}`;
        return result;
      });
    return formatted;
  };

  const handleInputChange = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    onDataChange(formattedPhone);
    setError(null); // Убираем ошибку при изменении
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Укажите свой номер телефона на случай потери доступа к вашему аккаунту.
      </Text>
      {error && <ErrorMessage message={error} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="+7 000 000-00-00"
          onChangeText={handleInputChange}
          value={value || '+7 '}
          keyboardType="phone-pad"
        />
      </View>
  
    </View>
  );
});

export default PhoneForm;

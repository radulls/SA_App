import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage'; // Подключаем компонент для отображения ошибок
import styles from './style';
import { ValueProps } from '@/app/register';
import { checkUsername, handleError } from '@/api/mockApi'; // Для проверки уникальности ID

interface IDFormProps extends ValueProps {
  isTouched?: boolean;
  onValidate: (isValid: boolean) => void; // Новый пропс
}

export interface IDFormRef {
  validateInput: () => Promise<void>;
}

const IDForm = forwardRef<IDFormRef, IDFormProps>(({ value, onDataChange, isTouched, onValidate }, ref) => {
  const [error, setError] = useState<string | null>(null);

  const validateInput = async () => {
    setError(null);

    // Проверяем формат ID
    const idRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!idRegex.test(value)) {
      setError('Неверный формат');
      onValidate(false);
      throw new Error('Validation Error'); // Прерываем процесс
    }

    // Проверяем уникальность ID
    try {
      await checkUsername(value);
      onValidate(true);
    } catch (error: any) {
      const customError = handleError(error);
      if (customError) {
        setError(customError);
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
      onValidate(false);
      throw new Error(customError || 'Validation Error'); // Прерываем процесс
    }
  };

  const handleInputChange = (id: string) => {
    onDataChange(id);
    setError(null); // Убираем ошибку при изменении
  };

  useImperativeHandle(ref, () => ({
    validateInput,
  }));

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Создайте имя пользователя (ID) для своего нового аккаунта.
      </Text>
      {isTouched && error && <ErrorMessage message={error} />}
      <View style={styles.inputContainer}>
        <InputField
          label="ID"
          value={value}
          onChange={(e) => handleInputChange(e)}
        />
      </View>
    </View>
  );
});

export default IDForm;


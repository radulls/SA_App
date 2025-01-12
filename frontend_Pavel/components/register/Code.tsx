import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Pressable } from 'react-native';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
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
      console.log(`Ввод активационного кода (без проверки): "${value}"`);
      // Убираем любые проверки, чтобы всегда пропускать
      return;
    };

    useImperativeHandle(ref, () => ({
      validateInput,
    }));

    const handleInputChange = (input: string) => {
      const trimmedValue = input.trim();
      console.log(`Ввод активационного кода: "${trimmedValue}"`);
      onDataChange(trimmedValue);
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

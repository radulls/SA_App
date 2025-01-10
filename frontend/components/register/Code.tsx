import React from 'react';
import { View, Text, Pressable } from 'react-native';
import InputField from '../InputField';
import styles from './style';

interface CodeFormProps {
  value: string;
  onDataChange: (value: string) => void; // Обработчик изменения
  isChecked: boolean;
  onCheckBoxToggle: () => void;
}

const CodeForm: React.FC<CodeFormProps> = ({ value, onDataChange, isChecked, onCheckBoxToggle }) => {
  const handleInputChange = (value: string) => {
    onDataChange(value.trim());
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Для регистрации в приложении вам необходим активационный код, который вы можете узнать у других участников объединения.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Активационный код" onChange={handleInputChange} value={value}/>
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
};

export default CodeForm;

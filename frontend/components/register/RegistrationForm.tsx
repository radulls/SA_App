import React from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';

// Тип для пропсов
interface RegistrationFormProps {
  onDataChange: (data: { firstName?: string; lastName?: string }) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onDataChange }) => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Укажите ваше настоящее имя и фамилию, это необходимо для подтверждения вашего аккаунта и создания безопасной среды.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Имя" onChange={(e) => onDataChange({ firstName: e })} />
      </View>
      <InputField label="Фамилия" onChange={(e) => onDataChange({ lastName: e })} />
      <Text style={styles.termsText}>
        <Text style={styles.termsRegular}>Я ознакомился и согласен с </Text>
        <Text style={styles.termsHighlight}>Условиями предоставления услуг </Text>
        <Text style={styles.termsRegular}>и </Text>
        <Text style={styles.termsHighlight}>Политикой конфиденциальности</Text>
      </Text>
    </View>
  );
};


export default RegistrationForm;

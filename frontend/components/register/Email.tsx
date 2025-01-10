import React from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';
import { ValueProps } from '@/app/register';

const EmailForm: React.FC<ValueProps> = ({ value, onDataChange }) => {
  const handleInputChange = (value: string) => {
    onDataChange(value.trim());
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
      На почту придёт подтверждение аккаунта.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Почта" onChange={handleInputChange} value={value}/>
      </View>
      <Text style={styles.termsText}>
        <Text style={styles.termsRegular}>Я ознакомился и согласен с </Text>
        <Text style={styles.termsHighlight}>Условиями предоставления услуг </Text>
        <Text style={styles.termsRegular}>и </Text>
        <Text style={styles.termsHighlight}>Политикой конфиденциальности</Text>
      </Text>
    </View>
  );
};


export default EmailForm;

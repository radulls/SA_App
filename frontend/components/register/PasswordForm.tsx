import React from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';
import { ValueProps } from '@/app/register';

const PasswordForm: React.FC<ValueProps> = ({ value, onDataChange }) => {
  const handleInputChange = (value: string) => {
    onDataChange(value.trim());
  };
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
      Придумайте пароль для вашего аккаунта.  Заглавные буквы, строчные буквы, цифры.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Пароль" onChange={handleInputChange} value={value}/>
      </View>
    </View>
  );
};


export default PasswordForm;

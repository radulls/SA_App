import React from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';

interface ForgotFormProps {
  email: string; // Email — строка
  setEmail: (value: string) => void; // setEmail — функция, принимающая строку
}

const ForgotForm: React.FC<ForgotFormProps> = ({ email, setEmail }) => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Сброс пароля</Text>
      <Text style={styles.description}>
        Введите адрес электронной почты, который вы использовали при регистрации, мы вышлем вам инструкции по сбросу пароля.
      </Text>
      <View style={styles.inputContainer}>
        <InputField 
          label="Почта" 
          value={email} 
          onChange={(text) => setEmail(text)} 
          keyboardType="email-address"
        />
      </View>
    </View>
  );
};

export default ForgotForm;

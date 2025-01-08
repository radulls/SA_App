import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';

const RegistrationForm = () => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Сброс пароля</Text>
      <Text style={styles.description}>
      Введите адрес электронной почты, который вы использовали при регистрации, мы вышлем вам инструкции по сбросу пароля.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Почта" />
      </View>
    </View>
  );
};


export default RegistrationForm;

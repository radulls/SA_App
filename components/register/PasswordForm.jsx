import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';

const IDForm = ({onDataChange}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
      Придумайте пароль для вашего аккаунта.  Заглавные буквы, строчные буквы, цифры.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Пароль"  onChange={e => onDataChange({password: e})}/>
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


export default IDForm;

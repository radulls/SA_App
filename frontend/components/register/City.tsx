import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';
import { ValueProps } from '@/app/register';

const CityForm: React.FC<ValueProps> = ({ value, onDataChange }) => {
  const handleInputChange = (value: string) => {
    onDataChange(value.trim());
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
      Укажите город вашей территориальной принадлежности СЧ.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Город" onChange={handleInputChange} value={value}/>
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


export default CityForm;
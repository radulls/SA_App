import React from 'react';
import { View, Text } from 'react-native';
import InputField from '../InputField';
import styles from './style';
import { ValueProps } from '@/app/register';

const IDForm: React.FC<ValueProps> = ({ value, onDataChange }) => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Создайте имя пользователя (ID) для своего нового аккаунта. Вы сможете изменить его позже.
      </Text>
      <View style={styles.inputContainer}>
        <InputField
          label="ID"
          value={value} // Установите текущее значение
          onChange={(e) => onDataChange(e)} // Передайте изменения
        />
      </View>
    </View>
  );
};

export default IDForm;

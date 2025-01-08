import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField'; 
import styles from './style';

const IDForm = ({onDataChange}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
      Для регистрации в приложении вам необходим активационный код, который вы можете узнать у других участников объединения.
      </Text>
      <View style={styles.inputContainer}>
        <InputField label="Активационный код" onChange={e => onDataChange({code: e})} />
      </View>
      {/* <Text style={styles.termsText}>
        <Text style={styles.termsRegular}>Я ознакомился и согласен с </Text>
        <Text style={styles.termsHighlight}>Условиями предоставления услуг </Text>
        <Text style={styles.termsRegular}>и </Text>
        <Text style={styles.termsHighlight}>Политикой конфиденциальности</Text>
      </Text> */}
    </View>
  );
};

export default IDForm;

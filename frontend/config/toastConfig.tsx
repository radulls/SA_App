import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig, BaseToastProps } from 'react-native-toast-message';

// Конфигурация Toast с использованием библиотеки `react-native-toast-message`
export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.success}>
      <Text style={styles.text}>{text1}</Text>
      {text2 ? <Text style={styles.textSmall}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.error}>
      <Text style={styles.text}>{text1}</Text>
      {text2 ? <Text style={styles.textSmall}>{text2}</Text> : null}
    </View>
  ),
};

const styles = StyleSheet.create({
  success: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  error: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textSmall: {
    color: '#000',
    fontSize: 14,
    marginTop: 4,
  },
});

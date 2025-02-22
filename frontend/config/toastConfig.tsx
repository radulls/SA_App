import CheckMarkIcon from '@/components/svgConvertedIcons/checkMarkIcon';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig, BaseToastProps } from 'react-native-toast-message';

// Конфигурация Toast с использованием библиотеки `react-native-toast-message`
export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.success}>
      <CheckMarkIcon/>
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
    position: 'relative',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '95%',
    maxWidth: 600,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  error: {
    position: 'relative',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    width: '95%',
    maxWidth: 600,
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    paddingLeft: 15,
  },
  textSmall: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
});

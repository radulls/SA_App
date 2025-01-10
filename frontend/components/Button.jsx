import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, disabled }) => {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={disabled ? null : onPress}
      accessibilityRole="button"
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 1)',
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(200, 200, 200, 1)', // Светло-серый цвет для заблокированной кнопки
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  disabledButtonText: {
    color: '#aaa', // Тусклый цвет текста для заблокированной кнопки
  },
});

export default Button;

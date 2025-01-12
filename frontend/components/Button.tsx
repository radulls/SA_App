import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean; // Добавляем поддержку состояния загрузки
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled, loading }) => {
  return (
    <Pressable
      style={[styles.button, (disabled || loading) && styles.disabledButton]}
      onPress={!disabled && !loading ? onPress : undefined}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color="#fff" /> // Индикатор загрузки
      ) : (
        <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5, // Число, а не строка
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

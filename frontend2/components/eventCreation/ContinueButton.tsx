import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ContinueButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean; 
};

const ContinueButton: React.FC<ContinueButtonProps> = ({ onPress, text, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && { opacity: 0.5 }]} // 👈 делаем визуально неактивной
      onPress={onPress}
      disabled={disabled} // 👈 добавь сюда
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 14.5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ContinueButton;

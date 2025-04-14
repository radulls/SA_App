import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ContinueButtonProps = {
  onPress: () => void;
  text: string;
};

const ContinueButton: React.FC<ContinueButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} accessibilityRole="button">
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

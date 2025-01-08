import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';


const ContinueButton = () => {
  return (
    <TouchableOpacity style={styles.button} accessibilityRole="button">
      <Text style={styles.buttonText}>Продолжить</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 41,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 14.5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    // fontFamily: 'SFUIDisplay-Bold',
  },
});

export default ContinueButton;

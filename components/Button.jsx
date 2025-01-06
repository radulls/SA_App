import React from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';

const Button = ({ title, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress} accessibilityRole="button">
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 100)',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    // fontFamily: "SFUIDisplay-Bold",
    color: 'rgba(255, 255, 255, 1)',
  },
});

export default Button;

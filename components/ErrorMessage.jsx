import React from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';

const ErrorMessage = ({ message }) => {
  return (
    <View style={styles.errorContainer}>
      <Image
        resizeMode="contain"
        source={require('../assets/images/close.png')}
        style={styles.errorIcon}
        accessibilityLabel="Error icon"
      />
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 0, 0, 1)",
    display: "flex",
    alignItems: "stretch",
    gap: 17,
    padding: 18,
    flexDirection: 'row',
  },
  errorIcon: {
    alignSelf: "start",
    width: 10,
    aspectRatio: 1,
  },
  messageContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
  },
  errorText: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: '700',
    fontSize: 12,
    // fontFamily: 'SF UI Display, sans-serif',
    textShadowColor: 'rgba(162, 162, 162, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default ErrorMessage;
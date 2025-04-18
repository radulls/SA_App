import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import CloseIcon from './svgConvertedIcons/closeIcon';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle; // ✅ Добавили необязательный стиль
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  return (
    <View style={[styles.errorContainer, style]}>
      <CloseIcon />
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
    gap: 17,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    top: -70,
    width: '100%',
    maxWidth: 600,
  },
  messageContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
  },
  errorText: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "700",
    fontSize: 12,
    textShadowColor: "rgba(162, 162, 162, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default ErrorMessage;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
}

const SuccessMessage: React.FC<Props> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3C6685',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    position: 'absolute',
    zIndex: 100,
    bottom: -15
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SuccessMessage;

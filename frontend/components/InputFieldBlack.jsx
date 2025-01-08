import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputFieldBlack = ({ label, secureTextEntry = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry}
        accessibilityLabel={label}
        placeholderTextColor="rgba(0, 0, 0, 0.5)" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    color: '#fff', // Label color set to white
    fontSize: 14,
    fontWeight: '700',
    // fontFamily: 'SFUIDisplay-Bold',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,  
    paddingBottom: 14,
    color: '#fff', 
    fontSize: 14,
    fontWeight: '400',
    height: 48,
  },
});

export default InputFieldBlack;



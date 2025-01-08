import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputField = ({ label, secureTextEntry = false, onChange = (e) => {console.log(e)}}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]} // Apply focused styles if isFocused is true
        secureTextEntry={secureTextEntry}
        accessibilityLabel={label}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        onChangeText={value => onChange(value)}
        onFocus={() => setIsFocused(true)}  // Set focus state to true
        onBlur={() => setIsFocused(false)}  // Set focus state to false
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    color: 'rgba(255, 255, 255, 1)', 
    fontSize: 14,
    // fontFamily: "SFUIDisplay-Bold",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 30, 100)',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,
    paddingBottom: 14,
    color: 'rgba(255, 255, 255, 1)',
    textAlignVertical: 'center',
    height: 48,
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: 'rgba(66, 66, 66, 100)',
  },
});

export default InputField;




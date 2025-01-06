import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, multiline = false }) => {
  const [inputHeight, setInputHeight] = useState(multiline ? 100 : 48);

  const handleContentSizeChange = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(48, contentHeight));
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        multiline={true}  // Включаем режим многострочного ввода
        numberOfLines={multiline ? undefined : 1} // Одна строка по умолчанию, если не многострочное поле
        accessibilityLabel={label}
        onContentSizeChange={handleContentSizeChange}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 15,
    fontWeight: '700',
    // fontFamily: 'SFUIDisplay-Bold',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(243, 243, 243, 1)',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,  // Устанавливаем паддинги для лучшего позиционирования текста
    paddingBottom: 14,
    color: 'rgba(0, 0, 0, 1)',
    textAlignVertical: 'center',
  },
});

export default InputField;

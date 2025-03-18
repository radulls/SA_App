import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  maxLength?: number;
  isLarge?: boolean;
  secureTextEntry?: boolean; // ✅ Добавлено для скрытого ввода пароля
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  maxLength = 150,
  isLarge = false,
  secureTextEntry = false, // ✅ По умолчанию false (обычный текст)
}) => {
  const [inputHeight, setInputHeight] = useState(isLarge ? 100 : 48);

  const handleContentSizeChange = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(isLarge ? 100 : 48, contentHeight));
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        multiline={multiline}
        secureTextEntry={secureTextEntry} // ✅ Теперь поддерживается скрытый ввод
        value={value ?? ''}
        onChangeText={(text) => {
          if (isLarge && text.length > maxLength) return;
          onChangeText(text);
        }}
        maxLength={isLarge ? maxLength : undefined}
        numberOfLines={multiline ? undefined : 1}
        accessibilityLabel={label}
        onContentSizeChange={handleContentSizeChange}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
      {isLarge && <Text style={styles.charCount}>{`${(value || '').length}/${maxLength}`}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(243, 243, 243, 1)',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,
    paddingBottom: 14,
    color: 'rgba(0, 0, 0, 1)',
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginTop: 4,
  },
});

export default InputField;

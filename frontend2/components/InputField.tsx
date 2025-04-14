import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions, Platform } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string; // Значение текстового поля
  secureTextEntry?: boolean; // Флаг для скрытия текста (например, для пароля)
  keyboardType?: KeyboardTypeOptions; // Тип клавиатуры
  onChange: (value: string) => void; // Функция изменения значения
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value = '',
  secureTextEntry = false,
  keyboardType = 'default',
  onChange = (e) => console.log(e),
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { whiteSpace: 'normal' } as any]}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        secureTextEntry={secureTextEntry}
        accessibilityLabel={label}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        onChangeText={onChange}
        value={value} // Связываем значение
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType} // Указываем тип клавиатуры
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
    marginBottom: 6,
    fontFamily: "SFUIDisplay-Bold",
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
    fontFamily: "SFUIDisplay-regular",
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputFocused: {
    borderWidth: 0,
    borderColor: 'rgba(66, 66, 66, 100)',
  },
});

export default InputField;
